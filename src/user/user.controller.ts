import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseInterceptors,
  UseGuards,
  NotFoundException
} from '@nestjs/common'
import type { Request } from 'express'
import {
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { plainToInstance } from '~/utils/dto'
import { AuthenticatedUserType, UserService } from './user.service'
import { UserDto } from './dto/User.dto'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { PaginationQueryParams } from '~/api-services/pagination/dto/PaginationQueryParams'
import { getEndpoint } from '~/api-services/getEndpoint'
import { createPaginationData } from '~/api-services/pagination/creator/createPaginationData'
import { ApiPaginatedResponse } from '~/api-services/pagination/ApiPaginationResponse'
import { GetUserDto } from './dto/GetUser.dto'
import { AuthenticatedUser } from '~/auth/authenticatedUser.decorator'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { MeDto } from './dto/Me.dto'
import { UserSiteExtendedDto } from './dto/UserSiteExtended.dto'
import { PaginatedData } from '~/api-services/pagination/dto/PaginationData'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  @ApiPaginatedResponse(GetUserDto)
  @ApiBadRequestResponse()
  async findAll(
    @Req() req: Request,
    @Query() query: PaginationQueryParams,
  ) {
    const { page, items } = query

    const [users, totalItemCount] = await this.userService.findAll({
      skip: (page - 1) * items,
      take: items
    })

    const formattedUsers = users
      .map(s => plainToInstance(GetUserDto, s))

    return createPaginationData<GetUserDto>({
      url: getEndpoint(req),
      items: formattedUsers,
      queryOptions: { items, page },
      totalItemCount
    })
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'The user is successfully retrieved.', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'You need to provide a valid access-token.' })
  @UseInterceptors(new NotFoundInterceptor('The user is not found.'))
  async getMe(
    @AuthenticatedUser() user: AuthenticatedUserType,
  ): Promise<MeDto | undefined> {
    const storedUser = await this.userService.findById(user.id)

    if (!storedUser) return undefined

    return plainToInstance(
      MeDto,
      storedUser
    )
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The user is successfully retrieved.', type: GetUserDto })
  @ApiNotFoundResponse({ description: 'The user is not found.' })
  @UseInterceptors(new NotFoundInterceptor('The user is not found.'))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto | undefined> {
    const user = await this.userService.findById(id)

    if (!user) return undefined

    return plainToInstance(
      GetUserDto,
      user
    )
  }

  @Get(':id/sites')
  @ApiPaginatedResponse(UserSiteExtendedDto)
  @ApiNotFoundResponse({ description: 'The user is not found.' })
  async findSites(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Query() query: PaginationQueryParams,
  ): Promise<PaginatedData<UserSiteExtendedDto> | undefined> {
    const { page, items } = query
    const user = await this.userService.findById(id)

    if (!user) throw new NotFoundException('The user is not found.')

    const sites = await this.userService.getSites(user, query)

    const formattedSites = sites.map(s => plainToInstance(UserSiteExtendedDto, s))

    return createPaginationData<UserSiteExtendedDto>({
      url: getEndpoint(req),
      items: formattedSites,
      queryOptions: { items, page },
      totalItemCount: formattedSites.length
    })
  }
}
