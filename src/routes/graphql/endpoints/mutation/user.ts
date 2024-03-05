import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { userType } from '../query/user.js';
import { Context } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';

type CreateUserInputType = {
  dto: {
    name: string;
    balance: number;
  };
};

type ChangeUserInputType = {
  id: string;
  dto: {
    name: string;
    balance: number;
  };
};

type DeleteUserInputType = {
  id: string;
};

type SubscriptionUserInputType = {
  userId: string;
  authorId: string;
};

const CreateUserInputObjectType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const ChangeUserInputObjectType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const createUser = {
  type: userType,
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInputObjectType) },
  },
  resolve: async (_, data: CreateUserInputType, { prisma }: Context) => {
    return await prisma.user.create({
      data: data.dto,
    });
  },
};

export const changeUser = {
  type: userType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInputObjectType) },
  },
  resolve: async (_, data: ChangeUserInputType, { prisma }: Context) => {
    return await prisma.user.update({
      where: { id: data.id },
      data: data.dto,
    });
  },
};

export const deleteUser = {
  type: GraphQLString,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, data: DeleteUserInputType, { prisma }: Context) => {
    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
    return `user ${data.id} deleted`;
  },
};

export const subscribeTo = {
  type: userType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, data: SubscriptionUserInputType, { prisma }: Context) => {
    return await prisma.user.update({
      where: { id: data.userId },
      data: {
        userSubscribedTo: {
          create: {
            authorId: data.authorId,
          },
        },
      },
    });
  },
};

export const unsubscribeFrom = {
  type: GraphQLString,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, data: SubscriptionUserInputType, { prisma }: Context) => {
    await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          authorId: data.authorId,
          subscriberId: data.userId,
        },
      },
    });
    return 'unsubscribed';
  },
};
