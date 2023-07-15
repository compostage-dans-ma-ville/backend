import { ApiProperty, PickType } from '@nestjs/swagger'
import { SiteRole } from '@prisma/client'
import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { UserDto } from '~/user/dto/User.dto'

export class AddMemberBodyDto extends PickType(UserDto, ['email'] as const) {
  @Expose()
  @IsEnum(SiteRole)
  @ApiProperty({
    description: 'Granted role to the user',
    enum: SiteRole
  })
    role: SiteRole
}
