import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { postType } from '../query/post.js';
import { Context } from '../../types/context.js';

type CreatePostInputType = {
  dto: {
    authorId: string;
    title: string;
    content: string;
  };
};

type ChangePostInputType = {
  id: string;
  dto: {
    title: string;
    content: string;
  };
};

type DeletePostInputType = {
  id: string;
};

const CreatePostInputObjectType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const ChangePostInputObjectType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const createPost = {
  type: postType,
  args: { dto: { type: CreatePostInputObjectType } },
  resolve: async (_, data: CreatePostInputType, { prisma }: Context) => {
    return await prisma.post.create({
      data: data.dto,
    });
  },
};

export const changePost = {
  type: postType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: ChangePostInputObjectType },
  },
  resolve: async (_, data: ChangePostInputType, { prisma }: Context) => {
    return await prisma.post.update({
      where: { id: data.id },
      data: data.dto,
    });
  },
};

export const deletePost = {
  type: GraphQLString,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, data: DeletePostInputType, { prisma }: Context) => {
    await prisma.post.delete({
      where: {
        id: data.id,
      },
    });
    return 'Post deleted';
  },
};
