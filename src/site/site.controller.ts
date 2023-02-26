import {
  Controller, Get, Param, Delete, Query, Req, ParseIntPipe, HttpException, HttpStatus
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

@Controller('sites')
@ApiTags('Sites')
@ApiExtraModels(PaginatedData)
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

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
  ): Promise<PaginatedData<Site>> {
    const sites = await this.siteService.findAll({
      skip: (page - 1) * items,
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
  @ApiOkResponse({ description: 'The site is successfully retrieved.', type: GetSiteDto })
  @ApiNotFoundResponse({ description: 'The site is not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): ReturnType<SiteService['findOne']> | HttpException {
    const site = this.siteService.findOne(id)
    if(!site) {
      return new HttpException('The site is not found.', HttpStatus.NOT_FOUND)
    }
    return site
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
  //   return this.siteService.update(+id, updateSiteDto)
  // }

  @Delete(':id')
  @ApiOkResponse({ description: 'The site is successfully deleted.', type: GetSiteDto })
  @ApiBadRequestResponse({ description: 'The id is malformed.' })
  @ApiNotFoundResponse({ description: 'No site with this id is found.' })
  @ApiInternalServerErrorResponse()
  remove(@Param('id', ParseIntPipe) id: number): Prisma.Prisma__SiteClient<Site> {
    return this.siteService.remove(id)
  }
}
