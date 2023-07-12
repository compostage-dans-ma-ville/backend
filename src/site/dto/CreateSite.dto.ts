import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { CreateAddressDto } from '~/address/dto/CreateAddress.dto'
import { CreateOpeningDto } from '~/opening/dto/CreateOpening.dto'
import { CreateScheduleDto } from '~/dailySchedule/dto/createSchedule.dto'
import {
  IsArray,
  IsOptional,
  ValidateNested
} from 'class-validator'
import { GetSiteDto } from './GetSite.dto'

export class CreateSiteDto extends OmitType(
  GetSiteDto,
  ['id', 'createdAt', 'updatedAt', 'address', 'schedule', 'members'] as const
) {
  @Expose()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @ApiProperty({
    description: 'The address or location of this site.',
    type: CreateAddressDto
  })
    address: CreateAddressDto

  @Expose()
  @IsArray()
  @IsOptional()
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
}
