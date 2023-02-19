import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, Req
} from '@nestjs/common'
import { SiteService } from './site.service'
import { CreateSiteDto } from './dto/create-site.dto'
import { UpdateSiteDto } from './dto/update-site.dto'
import { Site } from '.prisma/client'
import { ItemsQueryPipe } from '~/services/pagination/pipes/ItemsQueryPipe'
import { PageQueryPipe } from '~/services/pagination/pipes/PageQueryPipe'
import { PaginatedData } from '~/services/pagination/dto/PaginationData'
import { createPaginationData } from '~/services/pagination/creator/createPaginationData'

@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.create(createSiteDto)
  }

  @Get()
  async findAll(
    @Query('items', ItemsQueryPipe) items: number,
    @Query('page', PageQueryPipe) page: number,
    @Req() req: Request
  ): Promise<PaginatedData<Site>> {
    const sites = await this.siteService.findAll({
      skip: page * items,
      take: items
    })
    const totalSites = await this.siteService.count()

    return createPaginationData<Site>({
      url: req.url,
      items: sites,
      queryOptions: { items, page },
      totalItemCount: totalSites
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.siteService.update(+id, updateSiteDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.remove(+id)
  }
}
