import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Context } from '../types/context.js';
import { Post } from '@prisma/client';
import { userType } from './user.js';

export const postType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: new GraphQLNonNull(userType),
      resolve: async (post: Post, _, { prisma }: Context) => {
        return await prisma.user.findUnique({
          where: {
            id: post.authorId,
          },
        });
      },
    },
  }),
});

export const post = {
  type: postType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, post: Post, { prisma }: Context) => {
    return await prisma.post.findUnique({
      where: {
        id: post.id,
      },
    });
  },
};

export const posts = {
  type: new GraphQLList(postType),
  resolve: async (_, __, { prisma }: Context) => {
    return await prisma.post.findMany();
  },
};
