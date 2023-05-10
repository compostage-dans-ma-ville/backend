import { ApiProperty, OmitType } from '@nestjs/swagger'
import { IsJWT, IsNotEmpty } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { UserDto } from '~/user/dto/user.dto'

export class LoginResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  @Expose()
    token: string

  @ApiProperty({
    type: OmitType(UserDto, ['password'] as const)
  })
  @IsNotEmpty()
  @Expose()
  @Type(() => OmitType(UserDto, ['password'] as const))
    data: Omit<UserDto, 'password'>
}
