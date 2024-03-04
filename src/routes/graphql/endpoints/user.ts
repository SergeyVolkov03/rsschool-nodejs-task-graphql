import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { profileType } from './profile.js';
import { User } from '@prisma/client';
import { Context } from '../types/context.js';
import { postType } from './post.js';

export const userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      resolve: async (user: User, _, { prisma }: Context) => {
        return await prisma.profile.findUnique({
          where: {
            userId: user.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user: User, _, { prisma }: Context) => {
        return await prisma.post.findMany({
          where: {
            authorId: user.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (user: User, _, { prisma }: Context) => {
        return await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (user: User, _, { prisma }: Context) => {
        return await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const user = {
  type: userType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, user: User, { prisma }: Context) => {
    return await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  },
};

export const users = {
  type: new GraphQLList(userType),
  resolve: async (_, __, { prisma }: Context) => {
    return await prisma.user.findMany();
  },
};
