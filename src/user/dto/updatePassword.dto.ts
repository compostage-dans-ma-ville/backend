import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
    new_password: string

  @ApiProperty()
  @IsNotEmpty()
    old_password: string
}
