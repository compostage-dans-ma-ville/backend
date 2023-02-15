import { ApiProperty } from '@nestjs/swagger'

export class Pagination {
  @ApiProperty({
    description: 'Page within the complete list returned by the call',
    example: 1
  })
    pageNumber: number

  @ApiProperty({
    description: 'Size of the page returned by the call',
    example: 10
  })
    pageSize: number

  @ApiProperty({
    description: 'Total number of items in the list',
    example: 20
  })
    totalCount: number
}
