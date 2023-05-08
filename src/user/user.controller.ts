import {
  Controller, Get, Param, ParseIntPipe, UseInterceptors
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse
} from '@nestjs/swagger'
import { plainToInstance } from '~/utils/dto'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  /*
  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.users({})
    return plainToInstance(UserDto, users)
  }
  */

  @Get(':id')
  @ApiOkResponse({ description: 'The user is successfully retrieved.', type: UserDto })
  @ApiNotFoundResponse({ description: 'The user is not found.' })
  @UseInterceptors(new NotFoundInterceptor('The user is not found.'))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto | undefined> {
    const user = await this.userService.findById(id)

    if (!user) return undefined

    return plainToInstance(
      UserDto,
      user
    )
  }
}
