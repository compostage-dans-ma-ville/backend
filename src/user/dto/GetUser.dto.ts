import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { UserDto } from './User.dto'

export class GetUserDto extends UserDto {
  @Expose()
  @ApiProperty({
    description: 'Date of creation of this site.',
    example: new Date()
  })
    createdAt: Date

  @Expose()
  @ApiProperty({
    description: 'Last update date of this site.',
    example: new Date()
  })
    updatedAt: Date
}
