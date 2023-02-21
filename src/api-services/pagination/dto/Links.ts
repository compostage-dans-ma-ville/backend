import { ApiProperty } from '@nestjs/swagger'

export class Links {
  @ApiProperty({
    description: 'Link to the previous page if this exists',
    example:
      'http://localhost:3000/api/v1/sites?page=2&items=20'
  })
    prev?: string

  @ApiProperty({
    description: 'Link to the next page if this exists',
    example:
      'http://localhost:3000/api/v1/sites?page=4&items=20'
  })
    next?: string

  @ApiProperty({
    description: 'Link to the last page',
    example:
      'http://localhost:3000/api/v1/sites?page=5&items=20'
  })
    last: string

  @ApiProperty({
    description: 'Link to the first page',
    example:
      'http://localhost:3000/api/v1/sites?page=1&items=20'
  })
    first: string
}
