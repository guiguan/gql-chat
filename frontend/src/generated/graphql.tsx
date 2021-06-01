import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
};


export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  user: User;
  content: Scalars['String'];
  timestamp: Scalars['Time'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Register or login a user. Everyone is welcomed */
  registerUser: User;
  sendMessage: Message;
};


export type MutationRegisterUserArgs = {
  user: NewUser;
};


export type MutationSendMessageArgs = {
  userId: Scalars['ID'];
  msg: NewMessage;
};

export type NewMessage = {
  content: Scalars['String'];
};

export type NewUser = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getMessages: Array<Message>;
};


export type QueryGetMessagesArgs = {
  userId: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Everyone = 'EVERYONE'
}

export type Subscription = {
  __typename?: 'Subscription';
  subscribeMessages: Message;
};


export type SubscriptionSubscribeMessagesArgs = {
  userId: Scalars['ID'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type RegisterUserMutationVariables = Exact<{
  user: NewUser;
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

export type SendMessageMutationVariables = Exact<{
  userId: Scalars['ID'];
  msg: NewMessage;
}>;


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & { message: (
    { __typename?: 'Message' }
    & Pick<Message, 'id'>
  ) }
);

export type SubscribeMessagesSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type SubscribeMessagesSubscription = (
  { __typename?: 'Subscription' }
  & { message: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'content' | 'timestamp'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  ) }
);


export const RegisterUserDocument = gql`
    mutation registerUser($user: NewUser!) {
  user: registerUser(user: $user) {
    id
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const SendMessageDocument = gql`
    mutation sendMessage($userId: ID!, $msg: NewMessage!) {
  message: sendMessage(userId: $userId, msg: $msg) {
    id
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      msg: // value for 'msg'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const SubscribeMessagesDocument = gql`
    subscription subscribeMessages($userId: ID!) {
  message: subscribeMessages(userId: $userId) {
    id
    user {
      id
      name
    }
    content
    timestamp
  }
}
    `;

/**
 * __useSubscribeMessagesSubscription__
 *
 * To run a query within a React component, call `useSubscribeMessagesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeMessagesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeMessagesSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useSubscribeMessagesSubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeMessagesSubscription, SubscribeMessagesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeMessagesSubscription, SubscribeMessagesSubscriptionVariables>(SubscribeMessagesDocument, options);
      }
export type SubscribeMessagesSubscriptionHookResult = ReturnType<typeof useSubscribeMessagesSubscription>;
export type SubscribeMessagesSubscriptionResult = Apollo.SubscriptionResult<SubscribeMessagesSubscription>;