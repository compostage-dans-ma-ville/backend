import { GetOpeningDto } from "~/opening/dto/GetOpening.dto";

export class GetDailyScheduleDto extends Array<GetOpeningDto> {}

export class GetScheduleDto {
  schedules: [
    GetDailyScheduleDto | null,
    GetDailyScheduleDto | null,
    GetDailyScheduleDto | null,
    GetDailyScheduleDto | null,
    GetDailyScheduleDto | null,
    GetDailyScheduleDto | null,
    GetDailyScheduleDto | null,
  ]
}