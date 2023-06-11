import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, Prisma, UserRole } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateUserDto } from './dto/create.dto'
import { LoginUserDto } from './dto/login.dto'

export type AuthenticatedUserType = Prisma.UserGetPayload<{
  include: { sites: true, organizations: true }
}>

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

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
}
