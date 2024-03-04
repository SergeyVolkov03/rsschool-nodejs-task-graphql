import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { MemberType } from '@prisma/client';
import { Context } from '../types/context.js';
import { profileType } from './profile.js';

export const memberIdEnumType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: MemberTypeId.BASIC,
    },
    business: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const memberObjectType: GraphQLObjectType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: memberIdEnumType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (memberType: MemberType, _: unknown, { prisma }: Context) => {
        return await prisma.profile.findMany({ where: { memberTypeId: memberType.id } });
      },
    },
  }),
});

export const memberType = {
  type: memberObjectType,
  args: {
    id: { type: memberIdEnumType },
  },
  resolve: async (_, memberType: MemberType, { prisma }: Context) => {
    return await prisma.memberType.findUnique({
      where: {
        id: memberType.id,
      },
    });
  },
};

export const memberTypes = {
  type: new GraphQLList(memberObjectType),
  resolve: async (_, __, { prisma }: Context) => {
    return await prisma.memberType.findMany();
  },
};
