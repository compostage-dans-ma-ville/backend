import {
  Controller, Get, Param, Delete,
  Query, Req, ParseIntPipe, UseInterceptors, Body, Post
} from '@nestjs/common'
import type { Request } from 'express'
import { SiteService } from './site.service'
import { Site } from '.prisma/client'
import { ItemsQueryPipe } from '~/api-services/pagination/pipes/ItemsQueryPipe'
import { PageQueryPipe } from '~/api-services/pagination/pipes/PageQueryPipe'
import { PaginatedData } from '~/api-services/pagination/dto/PaginationData'
import { createPaginationData } from '~/api-services/pagination/creator/createPaginationData'
import { Prisma } from '@prisma/client'
import {
  ApiBadRequestResponse, ApiExtraModels, ApiInternalServerErrorResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiTags
} from '@nestjs/swagger'
import { ApiPaginatedResponse } from '~/api-services/pagination/ApiPaginationResponse'
import { GetSiteDto } from './dto/GetSite.dto'
import { getEndpoint } from '~/api-services/getEndpoint'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { DailyScheduleService } from '~/dailySchedule/DailySchedule.service'
import { plainToClass } from '~/utils/dto'
import { CreateSiteDto } from './dto/CreateSite.dto'
import { DailyTime } from '~/api-services/DailyTime'

@Controller('sites')
@ApiTags('Sites')
@ApiExtraModels(PaginatedData)
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly scheduleService: DailyScheduleService
  ) {}

  @Post()
  @ApiOkResponse({ description: 'The site is successfully created.', type: GetSiteDto })
  async create(@Body() createSiteDto: CreateSiteDto) {
    const { schedule: scheduleDto, ...siteData } = createSiteDto
    
    const schedule = scheduleDto?.map((dailySchedule) => dailySchedule?.map((x) => ({
          open: DailyTime.fromString(x.open),
          close: DailyTime.fromString(x.close)
        })) ?? null
    ) ?? undefined
  
    const site = {
      ...siteData,
      address: {
        create: createSiteDto.address
      }
    }

    return this.siteService.create(site, { schedule })
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
      .map(s => plainToClass(GetSiteDto, s))

    return createPaginationData<GetSiteDto>({
      url: getEndpoint(req),
      items: formattedSites,
      queryOptions: { items, page },
      totalItemCount
    })
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

    return plainToClass(
      GetSiteDto,
      formattedSite
    )
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
  //   return this.siteService.update(+id, updateSiteDto)
  // }

  @Delete(':id')
  @ApiOkResponse({ description: 'The site is successfully deleted.', type: GetSiteDto })
  @ApiBadRequestResponse({ description: 'The id is malformed.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiNotFoundResponse({ description: 'The site is not found.' })
  @UseInterceptors(new NotFoundInterceptor('The site is not found.'))
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Prisma.Prisma__SiteClient<Site>> {
    return this.siteService.remove(id)
  }
}
