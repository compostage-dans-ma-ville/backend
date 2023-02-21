import { ApiProperty } from '@nestjs/swagger'
import { Site } from '@prisma/client'

export class GetSiteDto implements Site {
  @ApiProperty({
    description: 'Unique identifier of a site.',
    example: 1
  })
    id: number

  @ApiProperty({
    description: 'Date of creation of this site.',
    example: new Date()
  })
    createdAt: Date

  @ApiProperty({
    description: 'Last update date of this site.',
    example: new Date()
  })
    updatedAt: Date

  @ApiProperty({
    description: 'Human friendly name of this site.'
  })
    name: string

  @ApiProperty({
    description: 'A basic summary of this site.'
  })
    description: string | null

  @ApiProperty({
    description: 'A basic summary of this site.',
    example: new Date()
  })
    avatar: string | null

  @ApiProperty({
    description: 'The address or location of this site.',
    example: 1
  })
    addressId: number

  @ApiProperty({
    description: 'The organization id related to this site.',
    example: 1
  })
    organizationId: number | null
}
