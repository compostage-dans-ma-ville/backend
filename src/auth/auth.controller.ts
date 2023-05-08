import {
  Body,
  Controller,
  HttpCode,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags
} from '@nestjs/swagger'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { plainToInstance } from '~/utils/dto'
import { LoginResponseDto } from './dto/login-response.dto'

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
}
