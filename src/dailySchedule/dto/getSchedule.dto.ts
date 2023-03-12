import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { GetOpeningDto } from "~/opening/dto/GetOpening.dto";

export class GetScheduleDto {
  @ApiProperty()
  @Expose()
  schedules: [
    GetOpeningDto[] | null,
    GetOpeningDto[] | null,
    GetOpeningDto[] | null,
    GetOpeningDto[] | null,
    GetOpeningDto[] | null,
    GetOpeningDto[] | null,
    GetOpeningDto[] | null,
  ]
}