import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, Prisma, UserRole } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateUserDto } from './dto/create.dto'
import { LoginUserDto } from './dto/login.dto'
import { UpdatePasswordDto } from './dto/updatePassword.dto'

interface FormatLogin extends Partial<User> {
  email: string
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    })
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      throw new HttpException(
        'invalid credentials',
        HttpStatus.UNAUTHORIZED
      )
    }

    const areEqual = await compare(password, user.password)

    if (!areEqual) {
      throw new HttpException(
        'invalid credentials',
        HttpStatus.UNAUTHORIZED
      )
    }
    // deso pas le choix sauf si on trouve le moyen de faire
    // une sorte de select = false dans le schema prisma pour le password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...rest } = user
    return rest
  }

  async findByPayload({ email }: {email: string}): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email }
    })
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const {
      skip, take, cursor, where, orderBy
    } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    })
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email }
    })

    if (userInDb) {
      throw new HttpException(
        'user already exist',
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

  async updatePassword(payload: UpdatePasswordDto, id: number):
  Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })
    if (!user) {
      throw new HttpException(
        'user id: ' + id + ' is not found',
        HttpStatus.NOT_FOUND
      )
    }

    const areEqual = await compare(
      payload.old_password,
      user.password
    )
    if (!areEqual) {
      throw new HttpException(
        'invalid credentials',
        HttpStatus.UNAUTHORIZED
      )
    }
    return this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 10) }
    })
  }
}
