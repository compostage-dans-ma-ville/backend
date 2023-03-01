import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
    firstname: string

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
    lastname: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
    email: string

  @ApiProperty()
  @IsNotEmpty()
    password: string
}
