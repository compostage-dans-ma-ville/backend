import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

import { DESCRIPTION_MAX_LENGTH } from '~/utils/dto'

export class UserSiteInvitationBodyDto {
  @Expose()
  @IsString()
  @MinLength(30)
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  @ApiProperty({
    description: 'A basic summary of why yuou should be invited into the site.',
    example: 'Just a description with enough character.'
  })
    description: string
}
