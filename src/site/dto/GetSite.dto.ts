import { ApiProperty } from '@nestjs/swagger'
import { Site } from '@prisma/client'
import { Expose } from 'class-transformer'
import { GetAddressDto } from '~/address/dto/GetAddress.dto'

export class GetSiteDto implements Site {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of a site.',
    example: 1
  })
    id: number

  @Expose()
  @ApiProperty({
    description: 'Date of creation of this site.',
    example: new Date()
  })
    createdAt: Date

  @Expose()
  @ApiProperty({
    description: 'Last update date of this site.',
    example: new Date()
  })
    updatedAt: Date

  @Expose()
  @ApiProperty({
    description: 'The date of commissioning.',
    example: new Date()
  })
    launchDate: Date

  @Expose()
  @ApiProperty({
    description: 'Human friendly name of this site.'
  })
    name: string

  @Expose()
  @ApiProperty({
    description: 'A basic summary of this site.'
  })
    description: string | null

  @ApiProperty({
    description: 'The address or location of this site.',
    example: 1
  })
    addressId: number

  @Expose()
  @ApiProperty({
    description: 'The address or location of this site.',
    example: 1
  })
    address: GetAddressDto

  @Expose()
  @ApiProperty({
    description: 'The organization id related to this site.',
    example: 1
  })
    organizationId: number | null
}
