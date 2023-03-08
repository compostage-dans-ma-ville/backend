import {
  AbilityBuilder, AbilityClass, ExtractSubjectType, PureAbility
} from '@casl/ability'
import { User } from '@prisma/client'
import { UserAction } from '~/user/user.action'
import { PrismaQuery, Subjects } from '@casl/prisma'
import { Injectable } from '@nestjs/common'

type ExtendedSubjects = 'all';
export type AppSubjects = Subjects<{
    User: User
  }> | ExtendedSubjects;
export type AppAbility = PureAbility<[UserAction, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  async createAbility(user: User): Promise<PureAbility<[UserAction, AppSubjects]>> {
    const { can, build } = new AbilityBuilder<
    PureAbility<[UserAction, AppSubjects]>
  >(PureAbility as AbilityClass<AppAbility>)

    if (user.role === 'ADMIN') {
      can(UserAction.Manage, 'all') // read-write access to everything
    } else {
      can(UserAction.Read, 'all') // read-only access to everything
    }

    // ex pour verifier l'ownership d'un élément
    // can(UserAction.Update, Article, { authorId: user.id })

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as unknown as ExtractSubjectType<AppSubjects>
    })
  }
}
