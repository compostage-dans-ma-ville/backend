import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationQueryParams {
  @ApiPropertyOptional({
    description: 'The requested page of the list of existing resources',
    example: '1'
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
    page: number = 1

  @ApiPropertyOptional({
    description: 'The amount of items on the page',
    example: '20'
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
    items: number = 20

  // @ApiPropertyOptional({
  //   description:
  //     'Sort order of the returned objects, either "ASC" or "DESC", defaults to "DESC"',
  //   type: 'string',
  //   default: 'DESC'
  // })
  //   sortOrder?: string

  // @ApiPropertyOptional({
  //   description: 'Sort data by the given property',
  //   type: 'string',
  //   example: 'id',
  //   default: 'id'
  // })
  //   sortBy?: string
}
