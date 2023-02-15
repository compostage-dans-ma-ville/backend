import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationQueryOptions {
  @ApiPropertyOptional({
    description: 'Filter the result for the given property values',
    type: 'string',
    example: 'property=value1,value2',
    default: 'No filter'
  })
    filter?: string

  @ApiPropertyOptional({
    description: 'The requested page of the list of existing resources',
    type: 'string',
    example: '1',
    default: '1'
  })
    page?: string

  @ApiPropertyOptional({
    description: 'The amount of items on the page',
    type: 'string',
    example: '20',
    default: '20'
  })
    items?: string

  @ApiPropertyOptional({
    description:
      'Sort order of the returned objects, either "ASC" or "DESC", defaults to "DESC"',
    type: 'string',
    default: 'DESC'
  })
    sortOrder?: string

  @ApiPropertyOptional({
    description: 'Sort data by the given property',
    type: 'string',
    example: 'id',
    default: 'id'
  })
    sortBy?: string
}
