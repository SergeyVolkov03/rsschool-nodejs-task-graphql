import { changePost, createPost, deletePost } from './endpoints/mutation/post.js';
import {
  changeProfile,
  createProfile,
  deleteProfile,
} from './endpoints/mutation/profile.js';
import {
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
} from './endpoints/mutation/user.js';
import { GraphQLObjectType } from 'graphql';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser,
    changeUser,
    deleteUser,
    subscribeTo,
    unsubscribeFrom,
    createProfile,
    changeProfile,
    deleteProfile,
    createPost,
    changePost,
    deletePost,
  }),
});
