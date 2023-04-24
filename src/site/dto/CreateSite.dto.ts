import { Prisma } from '@prisma/client'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CreateAddressDto } from '~/address/dto/CreateAddress.dto'
import { CreateOpeningDto } from '~/opening/dto/CreateOpening.dto'
import { CreateScheduleDto } from '~/dailySchedule/dto/createSchedule.dto'

export class CreateSiteDto {
    @Expose()
    @ApiProperty({
      description: 'The date of commissioning.',
      example: new Date()
    })
      launchDate: Date

    @Expose()
    @ApiProperty({
      description: 'Human friendly name of this site.',
      example: 'Le Poulor\'nay'
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
      description: 'Describe if the site is available for general public.',
      example: 'You must live at the residence les mimosas to be able to use our composters. This one is locked by a padlock. Ask our janitor for the code.'
    })
      accessConditions: string

    @Expose()
    @ApiProperty({
      description: 'The address or location of this site.',
      type: CreateAddressDto
    })
      address: Prisma.AddressCreateInput

    @Expose()
    @ApiProperty({
      type: 'array',
      nullable: true,
      items: {
        type: 'array',
        nullable: true,
        description: 'There are 7 cells in the array. One for every day starting on Monday. Null represents a closed day, an empty array a 24-hour opening on this day.',
        items: {
          $ref: getSchemaPath(CreateOpeningDto)
        }
      }
    })
      schedule?: CreateScheduleDto['schedules']

      @Expose()
      @ApiProperty({
        description: 'Average quantity of compost produced after each collection',
        nullable: true,
        example: 5000
      })
        treatedWaste?: number
}
