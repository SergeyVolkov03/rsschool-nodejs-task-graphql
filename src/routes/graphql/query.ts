import { GraphQLObjectType } from 'graphql';
import { user, users } from './endpoints/query/user.js';
import { profile, profiles } from './endpoints/query/profile.js';
import { post, posts } from './endpoints/query/post.js';
import { memberType, memberTypes } from './endpoints/query/member-type.js';

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
