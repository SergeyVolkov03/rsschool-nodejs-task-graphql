import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../../../member-types/schemas.js';
import { UUIDType } from '../../types/uuid.js';
import { memberIdEnumType } from '../query/member-type.js';
import { profileType } from '../query/profile.js';
import { Context } from '../../types/context.js';

type CreateProfileInputType = {
  dto: {
    userId: string;
    yearOfBirth: number;
    isMale: boolean;
    memberTypeId: MemberTypeId;
  };
};

type ChangeProfileInputType = {
  id: string;
  dto: {
    yearOfBirth: number;
    isMale: boolean;
    memberTypeId: MemberTypeId;
  };
};

type DeleteProfileInputType = {
  id: string;
};

const createProfileInputObjectType = new GraphQLInputObjectType({
  name: 'createProfileInputObjectType',
  fields: () => ({
    userId: { type: new GraphQLNonNull(UUIDType) },
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
    memberTypeId: { type: memberIdEnumType },
  }),
});

const changeProfileInputObjectType = new GraphQLInputObjectType({
  name: 'changeProfileInputObjectType',
  fields: () => ({
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
    memberTypeId: { type: memberIdEnumType },
  }),
});

export const createProfile = {
  type: profileType,
  args: { dto: { type: new GraphQLNonNull(createProfileInputObjectType) } },
  resolve: async (_, data: CreateProfileInputType, { prisma }: Context) => {
    return await prisma.profile.create({
      data: data.dto,
    });
  },
};

export const changeProfile = {
  type: profileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: changeProfileInputObjectType },
  },
  resolve: async (_, data: ChangeProfileInputType, { prisma }: Context) => {
    return await prisma.profile.update({
      where: { id: data.id },
      data: data.dto,
    });
  },
};

export const deleteProfile = {
  type: GraphQLString,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, data: DeleteProfileInputType, { prisma }: Context) => {
    await prisma.profile.delete({
      where: {
        id: data.id,
      },
    });
    return 'profile deleted';
  },
};
