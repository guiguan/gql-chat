package resolvers

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/guiguan/gql-chat/internal/gqlserver"
	"github.com/guiguan/gql-chat/internal/models"
	"github.com/guiguan/gql-chat/internal/services/chat"
	"github.com/pkg/errors"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	chat *chat.Chat
}

func New() gqlserver.Config {
	rsv := &Resolver{
		chat: chat.New(),
	}

	return gqlserver.Config{
		Resolvers: rsv,
		Directives: gqlserver.DirectiveRoot{
			HasRole: func(
				ctx context.Context,
				obj interface{},
				next graphql.Resolver,
				role models.Role,
			) (res interface{}, er error) {
				const userIDKey = "userId"

				args, ok := obj.(map[string]interface{})
				if !ok {
					return nil, errors.New("invalid derivative arguments")
				}

				userIDV, ok := args[userIDKey]
				if !ok {
					return nil, errors.Errorf("missing `%s` argument", userIDKey)
				}

				userID, ok := userIDV.(string)
				if !ok {
					return nil, errors.Errorf("invalid `%s` argument type: %T", userIDKey, userIDV)
				}

				err := rsv.chat.CheckUserPermission(userID, role)
				if err != nil {
					return nil, err
				}

				return next(ctx)
			},
		},
	}
}
