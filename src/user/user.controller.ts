import {
  Controller, Get, Param, ParseIntPipe, Query, Req, UseInterceptors
} from '@nestjs/common'
import type { Request } from 'express'
import {
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger'
import { plainToInstance } from '~/utils/dto'
import { UserService } from './user.service'
import { UserDto } from './dto/User.dto'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { PaginationQueryParams } from '~/api-services/pagination/dto/PaginationQueryParams'
import { getEndpoint } from '~/api-services/getEndpoint'
import { createPaginationData } from '~/api-services/pagination/creator/createPaginationData'
import { ApiPaginatedResponse } from '~/api-services/pagination/ApiPaginationResponse'
import { GetUserDto } from './dto/GetUser.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  @ApiPaginatedResponse(UserDto)
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
