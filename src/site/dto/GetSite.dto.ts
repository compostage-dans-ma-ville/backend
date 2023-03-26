import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Site } from '@prisma/client'
import { Expose } from 'class-transformer'
import { GetAddressDto } from '~/address/dto/GetAddress.dto'
import { GetScheduleDto } from '~/dailySchedule/dto/getSchedule.dto'
import { GetOpeningDto } from '~/opening/dto/GetOpening.dto'

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
    type: 'array',
    items: {
      type: 'array',
      nullable: true,
      description: 'There are 7 cells in the array. One for every day starting on Monday. Null represents a closed day, an empty array a 24-hour opening on this day.',
      items: {
        $ref: getSchemaPath(GetOpeningDto)
      }
    }
  })
    schedule: GetScheduleDto['schedules']

  @Expose()
  @ApiProperty({
    description: 'The organization id related to this site.',
    example: 1
  })
    organizationId: number | null
}
