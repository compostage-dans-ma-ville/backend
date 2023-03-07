import {
  Controller, Get, Param, Delete,
  Query, Req, ParseIntPipe, UseInterceptors
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
import { GetSiteDto } from './dto/get-site.dto'
import { getEndpoint } from '~/api-services/getEndpoint'
import { NotFoundInterceptor } from '~/api-services/NotFoundInterceptor'
import { ScheduleService } from '~/schedule/schedule.service'

@Controller('sites')
@ApiTags('Sites')
@ApiExtraModels(PaginatedData)
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly scheduleService: ScheduleService
  ) {}

  // @Post()
  // create(@Body() createSiteDto: CreateSiteDto) {
  //   return this.siteService.create(createSiteDto)
  // }

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
    const formattedSites = sites.map(({ Schedules, ...s }) => ({
      ...s,
      schedules: this.scheduleService.toDto(Schedules)
    }))

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

    const { Schedules, ...s } = site
    const formattedSite = {
      ...s,
      schedules: this.scheduleService.toDto(Schedules)
    }

    return formattedSite
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
