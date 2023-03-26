import { ApiProperty } from '@nestjs/swagger'
import { Address } from '@prisma/client'

export class GetAddressDto implements Address {
  @ApiProperty({
    description: 'Unique identifier of an adress.',
    example: 1
  })
    id: number

  @ApiProperty({
    description: 'Number associated with the street',
    example: '6 ter'
  })
    houseNumber: string

  @ApiProperty({
    description: 'Last update date of this site.',
    example: 'rue Lothaire'
  })
    streetName: string

  @ApiProperty({
    description: 'Human friendly name of this site.',
    example: 67150
  })
    zipCode: number

    @ApiProperty({
      description: 'The city or village name of the address.',
      example: 'Erstein'
    })
      city: string

  @ApiProperty({
    description: 'the exact latitude in legal projection.',
    example: 1044994.79
  })
    longitude: number

  @ApiProperty({
    description: 'the exact longitude in legal projection.',
    example: 6824079.46
  })
    latitude: number
}
