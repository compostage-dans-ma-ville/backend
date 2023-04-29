import {
  Body,
  ClassSerializerInterceptor,
  Controller, Get, Param, Put, UseInterceptors
} from '@nestjs/common'
import {
  ApiParam, ApiSecurity, ApiTags
} from '@nestjs/swagger'
import { plainToInstance } from '~/utils/dto'
import { UpdatePasswordDto } from './dto/updatePassword.dto'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.users({})
    return plainToInstance(UserDto, users)
  }

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
