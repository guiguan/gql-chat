package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/guiguan/gql-chat/internal/gqlserver"
	"github.com/guiguan/gql-chat/internal/models"
)

func (r *mutationResolver) RegisterUser(ctx context.Context, user models.NewUser) (*models.User, error) {
	return r.chat.RegisterUser(ctx, user)
}

func (r *mutationResolver) SendMessage(ctx context.Context, userID string, msg models.NewMessage) (*models.Message, error) {
	return r.chat.SendMessage(ctx, userID, msg)
}

func (r *queryResolver) GetMessages(ctx context.Context, userID string) ([]*models.Message, error) {
	return r.chat.GetMessages(ctx, userID)
}

func (r *subscriptionResolver) SubscribeMessages(ctx context.Context, userID string) (<-chan *models.Message, error) {
	return r.chat.SubscribeMessages(ctx, userID)
}

// Mutation returns gqlserver.MutationResolver implementation.
func (r *Resolver) Mutation() gqlserver.MutationResolver { return &mutationResolver{r} }

// Query returns gqlserver.QueryResolver implementation.
func (r *Resolver) Query() gqlserver.QueryResolver { return &queryResolver{r} }

// Subscription returns gqlserver.SubscriptionResolver implementation.
func (r *Resolver) Subscription() gqlserver.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
