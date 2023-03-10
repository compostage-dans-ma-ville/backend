import { ApiProperty } from '@nestjs/swagger'
import { Links } from './Links'
import { Pagination } from './Pagination'

export class PaginatedData<T> {
  @ApiProperty({
    description: 'Pagination information',
    type: Pagination
  })
    pagination: Pagination

  readonly data: T[]

  @ApiProperty({
    description: 'Links to surrounding pages',
    type: Links
  })
    links: Links
}
