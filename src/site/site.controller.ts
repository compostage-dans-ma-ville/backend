import {
  Controller, Get, Param, Delete,
  Query, Req, ParseIntPipe, HttpException, UseInterceptors
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
      url: getEndpoint(req),
      items: sites,
      queryOptions: { items, page },
      totalItemCount
    })
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The site is successfully retrieved.', type: GetSiteDto })
  @UseInterceptors(new NotFoundInterceptor('The site is not found.'))
  findOne(@Param('id', ParseIntPipe) id: number): ReturnType<SiteService['findOne']> | HttpException {
    return this.siteService.findOne(id)
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
