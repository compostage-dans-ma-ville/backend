import {
  Body,
  ClassSerializerInterceptor,
  Controller, Get, Param, Put, UseGuards, UseInterceptors
} from '@nestjs/common'
import {
  ApiParam, ApiSecurity, ApiTags
} from '@nestjs/swagger'
import { User } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UpdatePasswordDto } from './dto/updatePassword.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.users({})
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({ name: 'id', type: 'string' })
  @Put('update/password/:id')
  public async updatePassword(
    @Param() params: {id: string},
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<{}> {
    await this.userService.updatePassword(updatePasswordDto, parseInt(params.id, 10))
    return {
      message: 'password update success'
    }
  }
}
