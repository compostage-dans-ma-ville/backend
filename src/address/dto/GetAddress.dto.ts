import { ApiProperty } from '@nestjs/swagger'
import { Address } from '@prisma/client'
import { Expose } from 'class-transformer'

export class GetAddressDto implements Address {
  @ApiProperty({
    description: 'Unique identifier of an adress.',
    example: 1
  })
    id: number

  @Expose()
  @ApiProperty({
    description: 'Number associated with the street',
    example: '6 ter'
  })
    houseNumber: string

  @Expose()
  @ApiProperty({
    description: 'Last update date of this site.',
    example: 'rue Lothaire'
  })
    streetName: string

  @Expose()
  @ApiProperty({
    description: 'Human friendly name of this site.',
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
    description: 'the exact latitude in legal projection.',
    example: 1044994.79
  })
    longitude: number

  @Expose()
  @ApiProperty({
    description: 'the exact longitude in legal projection.',
    example: 6824079.46
  })
    latitude: number
}
