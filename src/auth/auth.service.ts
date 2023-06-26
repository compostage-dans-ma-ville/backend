import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UserService } from '~/user/user.service'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { MailerService } from '~/mailer/mailer.service'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'
import { plainToInstance } from '~/utils/dto'
import { MeDto } from '~/user/dto/Me.dto'

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
      data: plainToInstance(
        MeDto,
        user
      )
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

  async sendResetPasswordEmail(email: string): Promise<void> {
    const user = await this.userService.find({ email })
    if (!user) {
      throw new HttpException(
        'The email is unknown',
        HttpStatus.NOT_FOUND
      )
    }

    const title = 'Modification de votre mot de passe'
    this.mailerService.sendEmail(
      user.email,
      title,
      'resetPassword',
      {
        title,
        redirectLink: this.webAppLinksService.resetPassword(this.getResetPasswordToken(user))
      }
    )
  }

  async resetPassword(token: string, password: string): Promise<void> {
    // @ts-expect-error: userId should be in the token payload
    const userId = this.jwtService.decode(token)?.userId

    if (!userId) {
      throw this.getInvalidPasswordTokenException()
    }

    const user = await this.userService.find({ id: userId })
    if (!user) {
      throw this.getInvalidPasswordTokenException()
    }

    try {
      this.jwtService.verify(
        token,
        { secret: this.getResetPasswordTokenSecret(user) }
      )

      await this.userService.updatePassword(user.id, password)
    } catch (error) {
      throw this.getInvalidPasswordTokenException()
    }
  }

  private getInvalidPasswordTokenException(): HttpException {
    return new HttpException(
      'Invalid or expired token',
      HttpStatus.FORBIDDEN
    )
  }

  private getResetPasswordTokenSecret(user: User): string {
    return process.env.JWT_SECRET_KEY + user.password
  }

  private getResetPasswordToken(user: User): string {
    return this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '10m', secret: this.getResetPasswordTokenSecret(user) }
    )
  }
}
