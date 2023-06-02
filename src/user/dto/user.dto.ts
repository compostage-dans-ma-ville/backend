import { Factory } from 'nestjs-seeder'
import { Expose, Transform } from 'class-transformer'
import {
  IsEmail, IsNotEmpty, Matches, MaxLength, MinLength
} from 'class-validator'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { PASSWORD_MATCHER } from '~/utils/dto'
import path from 'path'

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Factory(faker => faker?.datatype.number())
  id: number

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
  @Expose()
  @Factory(faker => faker?.datatype.boolean())
  isEmailConfirmed: boolean

  @ApiHideProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    PASSWORD_MATCHER,
    { message: 'Password should be a string of more than 8 characters containing at least one lower case, one upper case, one number and one symbol' }
  )
  @Factory(faker => faker?.internet.password())
  password: string

  @ApiProperty()
  @Expose()
  @Transform(value => `${path.join('uploaded-pictures', 'avatar', value.value)}.webp`, { toClassOnly: true })
  avatarId: string | null
}
