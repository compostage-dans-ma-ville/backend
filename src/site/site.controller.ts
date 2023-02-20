import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ParseIntPipe
} from '@nestjs/common'
import type { Request } from 'express'
import { SiteService } from './site.service'
import { CreateSiteDto } from './dto/create-site.dto'
import { UpdateSiteDto } from './dto/update-site.dto'
import { Site } from '.prisma/client'
import { ItemsQueryPipe } from '~/api-services/pagination/pipes/ItemsQueryPipe'
import { PageQueryPipe } from '~/api-services/pagination/pipes/PageQueryPipe'
import { PaginatedData } from '~/api-services/pagination/dto/PaginationData'
import { createPaginationData } from '~/api-services/pagination/creator/createPaginationData'
import { Prisma } from '@prisma/client'

@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.create(createSiteDto)
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('items', ItemsQueryPipe) items: number,
    @Query('page', PageQueryPipe) page: number,
  ): Promise<PaginatedData<Site>> {
    const sites = await this.siteService.findAll({
      skip: page * items,
      take: items
    })
    const totalItemCount = await this.siteService.count()

    return createPaginationData<Site>({
      url: `${req.protocol}://${req.get('Host')}${req.url}`,
      items: sites,
      queryOptions: { items, page },
      totalItemCount
    })
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ReturnType<SiteService['findOne']> {
    return this.siteService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.siteService.update(+id, updateSiteDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Prisma.Prisma__SiteClient<Site> {
    return this.siteService.remove(id)
  }
}