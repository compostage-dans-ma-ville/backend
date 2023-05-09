import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { plainToInstance } from '~/utils/dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { SendValidationEmailDto } from './dto/SendValidationEmail.dto'

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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Validation email sent to the known user' })
  public async sendEmailValidationToken(
    @Body() sendEmailDto: SendValidationEmailDto
  ): Promise<void> {
    await this.authService.sendActivateAccountEmailByEmail(sendEmailDto.email)
  }
}
