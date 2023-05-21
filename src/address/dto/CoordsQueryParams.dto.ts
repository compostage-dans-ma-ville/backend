import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { AddressDto } from './Address.dto'

export type CoordsParams = {
  latitude: number
  longitude: number
  radius: number
}

export class CoordsQueryParams extends PartialType(PickType(AddressDto, ['latitude', 'longitude'] as const)) implements Partial<CoordsParams> {
  @ApiPropertyOptional({
    description: 'The radius of the search in meters',
    example: 1000
  })
  @IsOptional()
  @IsNumber()
    radius?: number
}
