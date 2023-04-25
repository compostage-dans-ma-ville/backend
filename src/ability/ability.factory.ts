import {
  AbilityBuilder, PureAbility
} from '@casl/ability'
import {
  Organization, OrganizationRole, Site, SiteRole, User
} from '@prisma/client'
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma'
import { Injectable } from '@nestjs/common'
import { AuthenticatedUserType } from '~/user/user.service'

export enum UserAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type ExtendedSubject = 'all';
export type AppSubject = Subjects<{
    user: User,
    site: Site,
    organization: Organization
  }> | ExtendedSubject;
export type AppAbility = PureAbility<[UserAction, AppSubject], PrismaQuery>;

@Injectable()
export class AbilityFactory {
  createAbility(user: AuthenticatedUserType): PureAbility<[UserAction, AppSubject]> {
    const {
      can, cannot, build
    } = new AbilityBuilder<AppAbility>(createPrismaAbility)

    can([UserAction.Read, UserAction.Create], 'all')

    cannot(UserAction.Manage, 'organization').because('This user is not an administrator of this organization')
    user.organizations.forEach(({ role, organizationId }) => {
      if (role === OrganizationRole.ADMIN) {
        can(UserAction.Manage, 'organization', { id: organizationId })
      }
    })

    cannot(UserAction.Manage, 'site').because('This user is not an administrator of this site')
    user.sites.forEach(({ role, siteId }) => {
      if (role === SiteRole.ADMIN) {
        can(UserAction.Manage, 'site', { id: siteId })
      }
    })

    if (!user.isEmailConfirmed) {
      cannot(
        [UserAction.Create, UserAction.Update, UserAction.Delete],
        'all'
      ).because("This user didn't confirmed it's email!")
    }

    if (user.role === 'ADMIN') {
      can(UserAction.Manage, 'all')
    }

    return build()
  }
}
