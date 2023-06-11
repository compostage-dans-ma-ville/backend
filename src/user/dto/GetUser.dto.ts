import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { UserDto } from './User.dto'

export class GetUserDto extends OmitType(UserDto, ['isEmailConfirmed', 'role']) {
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
