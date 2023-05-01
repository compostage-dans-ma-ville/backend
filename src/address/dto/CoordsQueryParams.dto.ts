import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export type Coordinates = {
  latitude: number
  longitude: number
  radius: number
}

export class CoordsQueryParams implements Partial<Coordinates> {
  @ApiPropertyOptional({
    description: 'The latitude in decimal degree (WGS84)',
    example: 1
  })
  @IsOptional()
  @IsNumber()
    latitude?: number // TODO: used as string in the rest of the code, should be number

  @ApiPropertyOptional({
    description: 'The longitude in decimal degree (WGS84)',
    example: 1
  })
  @IsOptional()
  @IsNumber()
    longitude?: number

  @ApiPropertyOptional({
    description: 'The radius of the search in meters',
    example: 1000
  })
  @IsOptional()
  @IsNumber()
    radius?: number
}
