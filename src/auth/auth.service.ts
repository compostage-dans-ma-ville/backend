import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt.strategy'
import { User } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { UserService } from '~/user/user.service'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { LoginResponseDto } from './dto/login-response.dto'

export interface RegistrationStatusFailed {
    success: false;
    message: string;
}

export interface RegistrationStatusSuccess <T>{
  success: true;
  message: string;
  data: T;
}
export type RegistrationStatus<T> = RegistrationStatusFailed | RegistrationStatusSuccess<T>

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

  async register(userDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDto)
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByLogin(loginUserDto)

    const token = this.createToken(user)

    return {
      token: token.Authorization,
      data: user
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  createToken({ email }: {email: string}) {
    const user: JwtPayload = { email }
    const Authorization = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET_KEY, expiresIn: process.env.JWT_EXPIRES_IN
    })

    return {
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      Authorization
    }
  }
}
