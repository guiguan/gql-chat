package chat

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/guiguan/caster"
	"github.com/guiguan/gql-chat/internal/models"
	pkgerr "github.com/pkg/errors"
)

type Chat struct {
	caster    *caster.Caster
	users     *sync.Map
	nextMsgID int64

	messages    []*models.Message
	messagesRWM *sync.RWMutex
}

func New() *Chat {
	return &Chat{
		caster:      caster.New(context.Background()),
		users:       new(sync.Map),
		nextMsgID:   -1,
		messages:    []*models.Message{},
		messagesRWM: new(sync.RWMutex),
	}
}

func (c *Chat) genNextMsgID() string {
	return fmt.Sprintf("%v", atomic.AddInt64(&c.nextMsgID, 1))
}

func (c *Chat) getUser(userID string) (*models.User, error) {
	v, ok := c.users.Load(userID)
	if !ok {
		return nil, ErrUserNotFound
	}

	return v.(*models.User), nil
}

func (c *Chat) getUserRole(userID string) (models.Role, error) {
	user, err := c.getUser(userID)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return models.RoleEveryone, nil
		}

		return "", err
	}

	if user.ID == "root@guiguan.net" {
		return models.RoleAdmin, nil
	}

	return models.RoleUser, nil
}

func (c *Chat) CheckUserPermission(userID string, requiredRole models.Role) error {
	actualRole, err := c.getUserRole(userID)
	if err != nil {
		return err
	}

	if actualRole == requiredRole {
		return nil
	}

	for _, r := range models.AllRole {
		if actualRole == r {
			return nil
		} else if requiredRole == r {
			return fmt.Errorf("user role `%s` is required but got `%s`", requiredRole, actualRole)
		}
	}

	return nil
}

func (c *Chat) GetMessages(ctx context.Context, userID string) ([]*models.Message, error) {
	c.messagesRWM.RLock()
	defer c.messagesRWM.RUnlock()

	return c.messages, nil
}

func (c *Chat) RegisterUser(ctx context.Context, user models.NewUser) (*models.User, error) {
	hasErr := false

	if user.Email == "" {
		graphql.AddErrorf(ctx, "email must be provided")
		hasErr = true
	}

	if user.Name == "" {
		graphql.AddErrorf(ctx, "name must be provided")
		hasErr = true
	}

	if hasErr {
		return nil, nil
	}

	newUser := &models.User{
		ID:   user.Email,
		Name: user.Name,
	}
	c.users.Store(newUser.ID, newUser)

	return newUser, nil
}

func (c *Chat) SendMessage(ctx context.Context, userID string, msg models.NewMessage) (*models.Message, error) {
	user, err := c.getUser(userID)
	if err != nil {
		return nil, err
	}

	c.messagesRWM.Lock()
	defer c.messagesRWM.Unlock()

	newMsg := &models.Message{
		ID:        c.genNextMsgID(),
		User:      user,
		Content:   msg.Content,
		Timestamp: time.Now(),
	}
	c.messages = append(c.messages, newMsg)

	ok := c.caster.TryPub(newMsg)
	if !ok {
		return nil, pkgerr.New("chat is closed")
	}

	return newMsg, nil
}

func (c *Chat) DeleteMessage(ctx context.Context, userID string, msgID string) (*models.Message, error) {
	c.messagesRWM.Lock()
	defer c.messagesRWM.Unlock()

	for i, m := range c.messages {
		if m.ID == msgID {
			c.messages = append(c.messages[:i], c.messages[i+1:]...)
			return m, nil
		}
	}

	return nil, nil
}

func (c *Chat) SubscribeMessages(ctx context.Context, userID string) (<-chan *models.Message, error) {
	msgChan := make(chan *models.Message, 3)
	subChan, ok := c.caster.Sub(ctx, 3)
	if !ok {
		return nil, pkgerr.New("chat is closed")
	}

	go func() {
		defer close(msgChan)

		msgs, err := c.GetMessages(ctx, userID)
		if err != nil {
			// TODO handle error
			fmt.Printf("failed to subscribe to messages: %+v\n", err)
			return
		}

		sendAndShouldReturn := func(msg *models.Message) bool {
			select {
			case <-ctx.Done():
				return true
			case msgChan <- msg:
				return false
			}
		}

		for _, m := range msgs {
			if sendAndShouldReturn(m) {
				return
			}
		}

		for m := range subChan {
			if sendAndShouldReturn(m.(*models.Message)) {
				return
			}
		}
	}()

	return msgChan, nil
}
