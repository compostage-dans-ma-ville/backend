import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { CreateUserDto } from '~/user/dto/create.dto'
import { Expose } from 'class-transformer'

export class RegisterResponseDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
    token: string
}
