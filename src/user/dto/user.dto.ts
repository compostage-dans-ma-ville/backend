import { Factory } from 'nestjs-seeder'
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Factory(faker => faker?.name.firstName())
    firstname: string

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Factory(faker => faker?.name.lastName())
    lastname: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  @Factory(faker => faker?.internet.email())
    email: string

  @ApiProperty()
  @IsNotEmpty()
  @Factory(faker => faker?.internet.password())
    password: string
}
