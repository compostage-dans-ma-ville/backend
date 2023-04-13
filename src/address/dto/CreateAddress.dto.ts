import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class CreateAddressDto {
  @Expose()
  @ApiProperty({
    description: 'Number associated with the street',
    example: '6 ter'
  })
    houseNumber: string

  @Expose()
  @ApiProperty({
    description: 'The name of the street',
    example: 'rue Lothaire'
  })
    streetName: string

  @Expose()
  @ApiProperty({
    description: 'Postcode of the address',
    example: 67150
  })
    zipCode: number

  @Expose()
  @ApiProperty({
    description: 'The city or village name of the address.',
    example: 'Erstein'
  })
    city: string

  @Expose()
  @ApiProperty({
    description: 'the exact longitude in decimal degree',
    example: 7.66600
  })
    longitude: number

  @Expose()
  @ApiProperty({
    description: 'the exact latitude in decimal degree',
    example: 48.42523
  })
    latitude: number
}
