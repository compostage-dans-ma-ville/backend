import { ApiProperty } from '@nestjs/swagger'

export class Pagination {
  @ApiProperty({
    description: 'Current page returned by the call',
    example: 1
  })
    pageNumber: number

  @ApiProperty({
    description: 'Amount of items in the page returned by the call',
    example: 10
  })
    pageSize: number

  @ApiProperty({
    description: 'Total number of items in the list',
    example: 20
  })
    totalCount: number
}
