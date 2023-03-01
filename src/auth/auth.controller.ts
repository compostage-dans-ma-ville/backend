import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'
import { RegisterResponseDto } from './dto/register-response.dto'
import { plainToClass } from '~/utils/dto'

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
        private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(200)
  @ApiOkResponse({ description: 'User created successfully', type: RegisterResponseDto })
  public async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(createUserDto)
    if (!result.success) {
      throw new HttpException(
        result.message,
        HttpStatus.BAD_REQUEST
      )
    }

    return plainToClass(
      RegisterResponseDto,
      {
        ...result.data,
        token: this.authService.createToken({ email: createUserDto.email }).Authorization
      }
    )
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<{}> {
    return this.authService.login(loginUserDto)
  }
}
