// eslint-disable-next-line max-classes-per-file
import {
  Controller, Get, Param, Delete,
  Query, Req, ParseIntPipe, UseInterceptors,
  Body, Post, Put, UseGuards, NotFoundException, BadRequestException,
  ConflictException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException
} from '@nestjs/common'
import type { Request } from 'express'
import { SiteService } from './site.service'
import { PaginatedData } from '~/api-services/pagination/dto/PaginationData'
import { createPaginationData } from '~/api-services/pagination/creator/createPaginationData'

import { Prisma, Site } from '@prisma/client'
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiSecurity,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiConflictResponse
} from '@nestjs/swagger'
import { ApiPaginatedResponse } from '~/api-services/pagination/ApiPaginationResponse'
import { GetSiteDto } from './dto/GetSite.dto'
import { getEndpoint } from '~/api-services/getEndpoint'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { DailyScheduleService } from '~/dailySchedule/DailySchedule.service'
import { plainToInstance } from '~/utils/dto'
import { CreateSiteDto } from './dto/CreateSite.dto'
import { DailyTime } from '~/api-services/DailyTime'
import { AbilityService, UserAction } from '~/ability/ability.service'
import { CheckAbility } from '~/ability/ability.decorator'
import { AuthenticatedUser } from '~/auth/authenticatedUser.decorator'
import { ForbiddenError, subject } from '@casl/ability'
import { AuthenticatedUserType, UserService } from '~/user/user.service'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { isAllDefined, isAllUndefined } from '~/utils/isAllDefinedOrUndefined'
import { GetSitesQueryParams } from './dto/GetSitesQueryParams.dto'
import { UserSiteInvitationBodyDto } from './dto/UserSiteInvitationBody.dto'
import { AddMemberBodyDto } from './dto/AddMemberBody.dto'

@Controller('sites')
@ApiTags('Sites')
@ApiExtraModels(PaginatedData)
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly scheduleService: DailyScheduleService,
    private readonly abilityService: AbilityService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiPaginatedResponse(GetSiteDto)
  @ApiBadRequestResponse()
  async findAll(
    @Req() req: Request,
    @Query() query: GetSitesQueryParams,
  ): Promise<PaginatedData<GetSiteDto>> {
    // Extract the query parameters to the dedicated group
    const {
      page, items, latitude, longitude, radius
    } = query
    const coordinatesQuery = { latitude, longitude, radius }

    // Extra-validation of the query parameters
    const coordinates = isAllDefined(coordinatesQuery)
    const areCoordinatesQueryEmpty = isAllUndefined(coordinatesQuery)

    if (!(areCoordinatesQueryEmpty || coordinates)) {
      throw new BadRequestException('Some arguments are missing in order to get localized sites.')
    }

    const [sites, totalItemCount] = await this.siteService.findAll({
      skip: (page - 1) * items,
      take: items,
      coordinates
    })

    const formattedSites = sites
      .map(({ dailySchedules, ...s }) => ({
        ...s,
        schedule: this.scheduleService.toDto(dailySchedules)
      }))
      .map(s => plainToInstance(GetSiteDto, s))

    return createPaginationData<GetSiteDto>({
      url: getEndpoint(req),
      items: formattedSites,
      queryOptions: { items, page },
      totalItemCount
    })
  }

  @Post()
  @ApiSecurity('access-token')
  @CheckAbility({ action: UserAction.Create, subject: 'site' })
  @ApiCreatedResponse({ description: 'The site is successfully created.', type: GetSiteDto })
  async create(
    @Body() createSiteDto: CreateSiteDto,
  ) {
    const { schedule: scheduleDto, ...siteData } = createSiteDto

    const schedule = scheduleDto?.map((dailySchedule) => dailySchedule?.map((x) => ({
      open: DailyTime.fromString(x.open),
      close: DailyTime.fromString(x.close)
    })) ?? null) ?? undefined

    const site = {
      ...siteData,
      address: {
        create: createSiteDto.address
      }
    }

    return this.siteService.create(site, { schedule })
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The site is successfully retrieved.', type: GetSiteDto })
  @ApiNotFoundResponse({ description: 'The site is not found.' })
  @UseInterceptors(new NotFoundInterceptor('The site is not found.'))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetSiteDto | undefined> {
    const site = await this.siteService.findOne(id)

    if (!site) return undefined

    const { dailySchedules, ...s } = site
    const formattedSite = {
      ...s,
      schedule: this.scheduleService.toDto(dailySchedules)
    }

    return plainToInstance(
      GetSiteDto,
      formattedSite
    )
  }

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteDto: CreateSiteDto
  ) {
    const { schedule: scheduleDto, ...siteData } = updateSiteDto

    const schedule = scheduleDto?.map((dailySchedule) => dailySchedule?.map((x) => ({
      open: DailyTime.fromString(x.open),
      close: DailyTime.fromString(x.close)
    })) ?? null) ?? undefined

    const site: Prisma.SiteUpdateInput = {
      ...siteData,
      address: {
        update: updateSiteDto.address
      }
    }

    return this.siteService.replace(id, site, { schedule })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOkResponse({ description: 'The site is successfully deleted.', type: GetSiteDto })
  @ApiBadRequestResponse({ description: 'The id is malformed.' })
  @ApiUnauthorizedResponse({ description: 'You need to provide a valid access-token.' })
  @ApiForbiddenResponse({ description: 'You are not an administrator of the site.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiNotFoundResponse({ description: 'The site is not found.' })
  @UseInterceptors(new NotFoundInterceptor('The site is not found.'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthenticatedUser() user: AuthenticatedUserType,
  ): Promise<Prisma.Prisma__SiteClient<Site | undefined>> {
    const site = await this.siteService.findOne(id)
    if (!site) throw new NotFoundException('The site is not found.')

    const ability = this.abilityService.createAbility(user)
    ForbiddenError.from(ability).throwUnlessCan(UserAction.Delete, subject('site', site))
    return this.siteService.remove(id)
  }

  @Put(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: 'You need to provide a valid access-token.' })
  @ApiForbiddenResponse({ description: 'You are not an administrator of the site.' })
  @ApiNotFoundResponse({ description: 'The site is not found.' })
  @ApiConflictResponse({ description: 'User with that email is already member of the site.' })
  async addMember(
    @Param('id', ParseIntPipe) id: number,
    @AuthenticatedUser() user: AuthenticatedUserType,
    @Body() body: AddMemberBodyDto
  ): Promise<void> {
    const site = await this.siteService.findOne(id)
    if (!site) throw new NotFoundException('The site is not found.')

    const ability = this.abilityService.createAbility(user)
    ForbiddenError.from(ability).throwUnlessCan(UserAction.Update, subject('site', site))
    return this.siteService.addMember(site, body.email, body.role)
  }

  @Put(':id/members/invitations')
  @ApiSecurity('access-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: 'You need to provide a valid access-token.' })
  @ApiNotFoundResponse({ description: 'The site is not found.' })
  @ApiConflictResponse({ description: 'The user is already a member or has already asked for invitation less than 7 days ago.' })
  async askForInvitation(
    @Param('id', ParseIntPipe) id: number,
    @AuthenticatedUser() user: AuthenticatedUserType,
    @Body() userInvitation: UserSiteInvitationBodyDto
  ): Promise<void> {
    const site = await this.siteService.findOne(id)
    const { description } = userInvitation

    if (!site) throw new NotFoundException('The site is not found.')

    if (!(await this.userService.canSendInvitationToSite(user.id, site.id))) {
      throw new ConflictException('The user is already a member or has already asked for invitation less than 7 days ago.')
    }

    try {
      const admins = await this.siteService.getAdminsAndReferee(site.id)
      await this.userService.sendInvitationToSite(
        user,
        site,
        description,
        admins.map(({ email }) => email)
      )
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
