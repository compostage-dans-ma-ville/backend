import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common'
import { AuthService, RegistrationStatus } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '~/user/dto/create.dto'
import { LoginUserDto } from '~/user/dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
        private readonly authService: AuthService,
  ) {}

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto,): Promise<RegistrationStatus> {
    const result = await this.authService.register(createUserDto)
    if (!result.success) {
      throw new HttpException(
        result.message,
        HttpStatus.BAD_REQUEST
      )
    }
    return result
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<{}> {
    return this.authService.login(loginUserDto)
  }
}
