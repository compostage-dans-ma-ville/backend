import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UserService } from '~/user/user.service'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { MailerService } from '~/mailer/mailer.service'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'

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
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly webAppLinksService: WebAppLinksService,
  ) {}

  async register(userDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.createUser(userDto)

    this.sendActivateAccountEmail(createdUser)

    return createdUser
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByLogin(loginUserDto)

    const token = this.getUserToken(user)

    return {
      token,
      data: user
    }
  }

  getUserToken(user: User): string {
    return this.jwtService.sign({ id: user.id })
  }

  async validateEmail(token: string): Promise<void> {
    try {
      const { email } = this.jwtService.verify(token)
      await this.userService.validateEmail(email)
    } catch (error) {
      throw new HttpException(
        'Provided token has expired or is invalid',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async sendActivateAccountEmailByEmail(email: string): Promise<void> {
    const user = await this.userService.find({ email })
    if (user && !user.isEmailConfirmed) {
      this.sendActivateAccountEmail(user)
    }
  }

  sendActivateAccountEmail(user: User): void {
    const validateEmailToken = this.jwtService.sign({
      email: user.email
    }, { expiresIn: '10m' })

    this.mailerService.sendEmail(
      user.email,
      'Activer votre compte',
      'validateEmail',
      {
        validationLink: this.webAppLinksService.activateAccount(validateEmailToken),
        title: 'Activer votre compte',
        username: user.firstname
      }
    )
  }
}
