import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Site, SiteType } from '@prisma/client'
import { Expose } from 'class-transformer'
import { GetAddressDto } from '~/address/dto/GetAddress.dto'
import { GetScheduleDto } from '~/dailySchedule/dto/getSchedule.dto'
import { GetOpeningDto } from '~/opening/dto/GetOpening.dto'

export class GetSiteDto implements Omit<Site, 'organizationId' | 'addressId'> {
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

  @Expose()
  @ApiProperty({
    description: 'Describe if the site is available for general public.',
    example: true
  })
    isPublic: boolean

  @Expose()
  @ApiProperty({
    description: 'The type of the current site.',
    enum: SiteType
  })
    type: SiteType

  @Expose()
  @ApiProperty({
    description: 'Describe if the site is available for general public.',
    example: 'You must live at the residence les mimosas to be able to use our composters. This one is locked by a padlock. Ask our janitor for the code.'
  })
    accessConditions: string

  @Expose()
  @ApiProperty({
    description: 'The address or location of this site.',
    example: {
      id: 1,
      houseNumber: '6 ter',
      streetName: 'rue Lothaire',
      zipCode: 67150,
      city: 'Ersteing',
      latitude: 48.42523,
      longitude: 7.66600
    }
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
    description: 'Average quantity of compost produced after each collection',
    nullable: true,
    example: 5000
  })
    treatedWaste: number | null
}
