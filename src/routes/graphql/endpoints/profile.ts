import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from '@prisma/client';
import { Context } from '../types/context.js';
import { memberIdEnumType, memberObjectType } from './member-type.js';
import { userType } from './user.js';

export const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: {
      type: userType,
      resolve: async (profile: Profile, _, { prisma }: Context) => {
        return await prisma.user.findUnique({
          where: {
            id: profile.userId,
          },
        });
      },
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: memberIdEnumType },
    memberType: {
      type: memberObjectType,
      resolve: async (profile: Profile, _, { prisma }: Context) => {
        return await prisma.memberType.findUnique({
          where: {
            id: profile.memberTypeId,
          },
        });
      },
    },
  }),
});

export const profile = {
  type: profileType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, profile: Profile, { prisma }: Context) => {
    return await prisma.profile.findUnique({
      where: {
        id: profile.id,
      },
    });
  },
};

export const profiles = {
  type: new GraphQLList(profileType),
  resolve: async (_, __, { prisma }: Context) => {
    return await prisma.profile.findMany();
  },
};
