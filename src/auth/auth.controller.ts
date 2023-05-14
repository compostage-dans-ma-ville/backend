import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { plainToInstance } from '~/utils/dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { SendResetPasswordEmailDto } from './dto/SendResetPasswordEmail.dto'
import { ResetPasswordDto } from './dto/ResetPassword.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { AuthenticatedUserType } from '~/user/user.service'
import { AuthenticatedUser } from './authenticatedUser.decorator'

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(200)
  @ApiConflictResponse({ description: 'User with this email already exist' })
  @ApiOkResponse({ description: 'User created successfully', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<LoginResponseDto> {
    const user = await this.authService.register(createUserDto)

    return plainToInstance(
      LoginResponseDto,
      {
        data: user,
        token: this.authService.getUserToken(user)
      }
    )
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'User logged in successfully', type: LoginResponseDto })
  @ApiForbiddenResponse({ description: 'Invalid credentials provided' })
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return plainToInstance(
      LoginResponseDto,
      await this.authService.login(loginUserDto)
    )
  }

  @Post('activate/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'token',
    description: 'Token sended in the account validation email during registration'
  })
  @ApiNoContentResponse({ description: 'User account successfully activated' })
  @ApiBadRequestResponse({ description: 'The given token is invalid or has expired' })
  public async validateEmail(
    @Param('token') token: string
  ): Promise<void> {
    await this.authService.validateEmail(token)
  }

  @Post('send-email-validation-token')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Validation email sent to the authenticated user' })
  public sendEmailValidationToken(
    @AuthenticatedUser() user: AuthenticatedUserType,
  ): void {
    this.authService.sendActivateAccountEmail(user)
  }

  @Post('send-reset-password-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Email sent with success' })
  @ApiNotFoundResponse({ description: 'The email is unknown' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async sendResetPasswordEmail(
    @Body() sendResetPasswordEmailDto: SendResetPasswordEmailDto
  ): Promise<void> {
    const { email } = sendResetPasswordEmailDto

    await this.authService.sendResetPasswordEmail(email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Password updated with success' })
  @ApiForbiddenResponse({ description: 'Reset password token is not (anymore) valid' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    const { token, password } = resetPasswordDto

    await this.authService.resetPassword(token, password)
  }
}
