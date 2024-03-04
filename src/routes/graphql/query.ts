import { GraphQLObjectType } from 'graphql';
import { user, users } from './endpoints/user.js';
import { profile, profiles } from './endpoints/profile.js';
import { post, posts } from './endpoints/post.js';
import { memberType, memberTypes } from './endpoints/member-type.js';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user,
    users,
    profile,
    profiles,
    post,
    posts,
    memberType,
    memberTypes,
  }),
});
