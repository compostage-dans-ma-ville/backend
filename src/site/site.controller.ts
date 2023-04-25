import {
  Controller, Get, Param, Delete,
  Query, Req, ParseIntPipe, UseInterceptors, Body, Post, Put, UseGuards, NotFoundException
} from '@nestjs/common'
import type { Request } from 'express'
import { SiteService } from './site.service'
import { ItemsQueryPipe } from '~/api-services/pagination/pipes/ItemsQueryPipe'
import { PageQueryPipe } from '~/api-services/pagination/pipes/PageQueryPipe'
import { PaginatedData } from '~/api-services/pagination/dto/PaginationData'
import { createPaginationData } from '~/api-services/pagination/creator/createPaginationData'
import { Prisma, Site } from '@prisma/client'
import {
  ApiBadRequestResponse, ApiExtraModels, ApiForbiddenResponse, ApiInternalServerErrorResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiSecurity, ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ApiPaginatedResponse } from '~/api-services/pagination/ApiPaginationResponse'
import { GetSiteDto } from './dto/GetSite.dto'
import { getEndpoint } from '~/api-services/getEndpoint'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { DailyScheduleService } from '~/dailySchedule/DailySchedule.service'
import { plainToInstance } from '~/utils/dto'
import { CreateSiteDto } from './dto/CreateSite.dto'
import { DailyTime } from '~/api-services/DailyTime'
import { TREATED_WASTE_VALUES } from './dto/GetTreatedWaste.dto'
import { AbilityGuard } from '~/ability/ability.guard'
import { AbilityFactory, UserAction } from '~/ability/ability.factory'
import { CheckAbility } from '~/ability/ability.decorator'
import { AuthenticatedUser } from '~/auth/authenticatedUser.decorator'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { ForbiddenError, subject } from '@casl/ability'
import { AuthenticatedUserType } from '~/user/user.service'

@Controller('sites')
@ApiTags('Sites')
@ApiExtraModels(PaginatedData)
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly scheduleService: DailyScheduleService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Post()
  @UseGuards(AbilityGuard)
  @CheckAbility({ action: UserAction.Create, subject: 'site' })
  @ApiOkResponse({ description: 'The site is successfully created.', type: GetSiteDto })
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

  @Put(':id')
  replace(@Param('id') id: string, @Body() updateSiteDto: CreateSiteDto) {
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

    return this.siteService.replace(+id, site, { schedule })
  }

  @Get()
  @ApiPaginatedResponse(GetSiteDto)
  async findAll(
    @Req() req: Request,
    @Query('items', ItemsQueryPipe) items: number,
    @Query('page', PageQueryPipe) page: number,
  ): Promise<PaginatedData<GetSiteDto>> {
    const totalItemCount = await this.siteService.count()
    const sites = await this.siteService.findAll({
      skip: (page - 1) * items,
      take: items
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

  @Get('units/treated-waste')
  @ApiOkResponse({
    isArray: true,
    description: 'The current values for a treated waste',
    schema: {
      example: Object.values(TREATED_WASTE_VALUES)
    }
  })
  async getTreatedWasteUnit() {
    return TREATED_WASTE_VALUES
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
  //   return this.siteService.update(+id, updateSiteDto)
  // }

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

    const ability = this.abilityFactory.createAbility(user)
    ForbiddenError.from(ability).throwUnlessCan(UserAction.Delete, subject('site', site))

    return this.siteService.remove(id)
  }
}
