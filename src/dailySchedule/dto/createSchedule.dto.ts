import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CreateOpeningDto } from '~/opening/dto/CreateOpening.dto'

export class CreateScheduleDto {
  @ApiProperty()
  @Expose()
    schedules: [
      CreateOpeningDto[] | null,
      CreateOpeningDto[] | null,
      CreateOpeningDto[] | null,
      CreateOpeningDto[] | null,
      CreateOpeningDto[] | null,
      CreateOpeningDto[] | null,
      CreateOpeningDto[] | null,
    ] | undefined
}
