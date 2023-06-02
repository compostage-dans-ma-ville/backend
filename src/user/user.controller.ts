import {
  Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiSecurity,
  ApiCreatedResponse
} from '@nestjs/swagger'
import { plainToInstance } from '~/utils/dto'
import { AuthenticatedUserType, UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { FileInterceptor } from '@nestjs/platform-express'
import { AvatarSharpPipe } from '~/sharp-pipe/avatar-sharp.pipe'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { AuthenticatedUser } from '~/auth/authenticatedUser.decorator'

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

  @Post('avatar')
  @ApiCreatedResponse({ description: 'User\'s avatar successfully uploaded.', type: UserDto })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @UploadedFile(AvatarSharpPipe) image: string,
    @AuthenticatedUser() user: AuthenticatedUserType
  ) {
    await this.userService.updateUser({
      where: { id: user.id },
      data: { avatarId: image }
    })

    return plainToInstance(
      UserDto,
      user
    )
  }
}
