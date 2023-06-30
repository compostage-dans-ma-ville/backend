import { ApiProperty } from '@nestjs/swagger'
import { SiteRole } from '@prisma/client'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class SiteMembersDto {
  @ApiProperty({
    enum: SiteRole
  })
  @IsNotEmpty()
  @Expose()
    role: SiteRole

  @Expose()
  @ApiProperty()
    userId: number
}
