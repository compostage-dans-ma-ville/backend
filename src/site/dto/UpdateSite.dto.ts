import { PartialType } from '@nestjs/mapped-types'
import { CreateSiteDto } from './CreateSite.dto'

export class UpdateSiteDto extends PartialType(CreateSiteDto) {}
