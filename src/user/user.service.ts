import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import {
  User, Prisma, UserRole, Site
} from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateUserDto } from './dto/create.dto'
import { LoginUserDto } from './dto/login.dto'
import dayjs from 'dayjs'
import { MailerService } from '~/mailer/mailer.service'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'

export type AuthenticatedUserType = Prisma.UserGetPayload<{
  include: { sites: true, organizations: true }
}>

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private webAppLinksService: WebAppLinksService
  ) { }

  async find(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    })
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      throw new HttpException(
        'invalid credentials',
        HttpStatus.FORBIDDEN
      )
    }

    const areEqual = await compare(password, user.password)

    if (!areEqual) {
      throw new HttpException(
        'invalid credentials',
        HttpStatus.FORBIDDEN
      )
    }

    return user
  }

  async findById(id: number): Promise<AuthenticatedUserType | null> {
    return this.prisma.user.findFirst({
      where: { id },
      include: {
        organizations: true,
        sites: true
      }
    })
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const {
      skip, take, cursor, where, orderBy
    } = params

    const query = {
      skip,
      take,
      cursor,
      where,
      orderBy
    }

    return this.prisma.$transaction([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where })
    ])
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email }
    })

    if (userInDb) {
      throw new HttpException(
        'User already exist',
        HttpStatus.CONFLICT
      )
    }

    return this.prisma.user.create({
      data: {
        ...(userDto),
        role: UserRole.USER,
        password: await hash(userDto.password, 10)
      }
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where
    })
  }

  async updatePassword(userId: number, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: await hash(newPassword, 10) }
    })
  }

  async validateEmail(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: {
        isEmailConfirmed: true
      }
    })
  }

  async canSendInvitationToSite(userId: number, siteId: number): Promise<boolean> {
    const user = await this.findById(userId)
    const isAlreadyMember = user?.sites.some(({ siteId: id }) => id === siteId)

    if (isAlreadyMember) return false

    const invitation = await this.prisma.memberSiteInvitation.findFirst({
      where: {
        userId,
        siteId
      }
    })

    const now = Date.now()

    if (!invitation) return true

    const askedLessThan7daysAgo = dayjs(now).diff(invitation.updatedAt, 'days') < 7
    return !askedLessThan7daysAgo
  }

  async sendInvitationToSite(
    user: User,
    site: Site,
    description: string,
    to: string[]
  ): Promise<void> {
    await this.mailerService.sendEmail(
      to,
      `Demande d'invitation: ${site.name}`,
      'askSiteInvitation',
      {
        title: `Demande d'invitation pour collaborer sur le site "${site.name}"`,
        user,
        site,
        description,
        pathToSite: this.webAppLinksService.site(site.id)
      }
    )

    const invitation = await this.prisma.memberSiteInvitation.findFirst({
      where: {
        userId: user.id,
        siteId: site.id
      }
    })

    if (invitation) {
      await this.prisma.memberSiteInvitation.update({
        where: {
          userId_siteId: {
            userId: user.id,
            siteId: site.id
          }
        },
        data: { updatedAt: new Date() }
      })
    } else {
      await this.prisma.memberSiteInvitation.create({
        data: {
          userId: user.id,
          siteId: site.id,
          updatedAt: new Date()
        }
      })
    }
  }
}
