import { ApiProperty } from '@nestjs/swagger'
import { Site } from '@prisma/client'
import { Expose } from 'class-transformer'
import { GetScheduleDto } from '~/dailySchedule/dto/getSchedule.dto'

export class GetSiteDto implements Site {
  @ApiProperty({
    description: 'Unique identifier of a site.',
    example: 1
  })
  @Expose()
    id: number

  @ApiProperty({
    description: 'Date of creation of this site.',
    example: new Date()
  })
  @Expose()
    createdAt: Date

  @ApiProperty({
    description: 'Last update date of this site.',
    example: new Date()
  })
  @Expose()
    updatedAt: Date

  @ApiProperty({
    description: 'Human friendly name of this site.'
  })
  @Expose()
    name: string

  @ApiProperty({
    description: 'A basic summary of this site.'
  })
  @Expose()
    description: string | null

  @ApiProperty({
    description: 'The address or location of this site.',
    example: 1
  })
  @Expose()
    addressId: number

  @ApiProperty({
    description: 'The organization id related to this site.',
    example: 1
  })
  @Expose()
    organizationId: number | null

  @ApiProperty()
  @Expose()
  schedule: GetScheduleDto['schedules']
}
