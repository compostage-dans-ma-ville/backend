import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsNotEmpty } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { MeDto } from '~/user/dto/Me.dto'

export class LoginResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  @Expose()
    token: string

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Type(() => MeDto)
    data: MeDto
}
