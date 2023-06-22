import { ApiProperty, PickType, OmitType } from '@nestjs/swagger'
import { SiteRole } from '@prisma/client'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { UserSiteDto } from './UserSite.dto'
import { GetSiteDto } from '~/site/dto/GetSite.dto'

class SiteDto extends OmitType(GetSiteDto, ['members', 'schedule'] as const) {}

export class UserSiteExtendedDto extends PickType(UserSiteDto, ['role'] as const) {
  @ApiProperty({
    enum: SiteRole
  })
  @IsNotEmpty()
  @Expose()
    role: SiteRole

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => SiteDto)
  @Expose()
    site: SiteDto
}
