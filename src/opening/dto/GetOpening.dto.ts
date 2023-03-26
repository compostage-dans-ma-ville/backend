import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GetOpeningDto {
  @Expose()
  @ApiProperty({
    example: '08:00'
  })
    open: string

  @Expose()
  @ApiProperty({
    example: '10:00'
  })
    close: string
}
