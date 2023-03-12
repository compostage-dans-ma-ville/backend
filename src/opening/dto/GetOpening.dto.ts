import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class GetOpeningDto {
  @ApiProperty({
    example: '08:00'
  })
  @Expose()
  open: string
  
  @ApiProperty({
    example: '10:00'
  })
  @Expose()
  close: string
}