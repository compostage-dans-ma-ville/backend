import { ApiProperty, PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsJWT, IsNotEmpty } from 'class-validator'
import { UserDto } from '~/user/dto/user.dto'

export class ResetPasswordDto extends PickType(UserDto, ['password'] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  @Expose()
    token: string

  @Expose()
    password: string
}
