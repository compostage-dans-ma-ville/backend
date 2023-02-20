import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt.strategy'
import { User } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { UserService } from '~/user/user.service'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'

export interface RegistrationStatus{
    success: boolean;
    message: string;
    data?: User;
}
export interface RegistrationSeederStatus {
    success: boolean;
    message: string;
    data?: User[];
}

@Injectable()
export class AuthService {
  constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS'
    }

    try {
      status.data = await this.userService.createUser(userDto)
    } catch (err) {
      status = {
        success: false,
        message: err
      }
    }
    return status
  }

  async login(loginUserDto: LoginUserDto): Promise<{}> {
    const user = await this.userService.findByLogin(loginUserDto)

    const token = this.createToken(user)

    return {
      ...token,
      data: user
    }
  }

  private createToken({ email }: {email: string}): {} {
    const user: JwtPayload = { email }
    const Authorization = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET_KEY, expiresIn: process.env.JWT_EXPIRES_IN
    })
    return {
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      Authorization
    }
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.userService.findByPayload(payload)
    if (!user) {
      throw new HttpException(
        'INVALID_TOKEN',
        HttpStatus.UNAUTHORIZED
      )
    }
    return user
  }
}
