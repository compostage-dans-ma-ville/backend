import { ApiProperty } from '@nestjs/swagger'
import { SiteRole } from '@prisma/client'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class UserSiteDto {
  @ApiProperty({
    enum: SiteRole
  })
  @IsNotEmpty()
  @Expose()
    role: SiteRole

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
    siteId: number
}
