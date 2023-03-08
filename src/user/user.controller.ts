import {
  Body,
  ClassSerializerInterceptor,
  Controller, Get, Param, Put, UseGuards, UseInterceptors
} from '@nestjs/common'
import {
  ApiParam, ApiSecurity, ApiTags
} from '@nestjs/swagger'
import { User } from '@prisma/client'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { CaslAbilityFactory } from '~/casl/casl-ability.factory'
import { UpdatePasswordDto } from './dto/updatePassword.dto'
import { UserAction } from './user.action'
import { UserService } from './user.service'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private caslAbilityFactory: CaslAbilityFactory
  ) { }

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

  /**
   * Uniquement pour le dev, pour tester les ability
   * @param params
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({ name: 'id', type: 'string' })
  @Get('testAbility/:id')
  public async testAbility(
    @Param() params: {id: string},
  ): Promise<{}> {
    const user = await this.userService.user({ id: parseInt(params.id, 10) })

    if (user) {
      const ability = await this.caslAbilityFactory.createAbility(user)
      return {
        ReadAll: ability.can(UserAction.Read, 'all'),
        CreateAll: ability.can(UserAction.Create, 'all')
      }
    }
    return {}
  }
}
