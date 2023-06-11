import { IntersectionType } from '@nestjs/mapped-types'
import { CoordsQueryParams } from '~/address/dto/CoordsQueryParams.dto'
import { PaginationQueryParams } from '~/api-services/pagination/dto/PaginationQueryParams'

export class GetSitesQueryParams
  extends PaginationQueryParams {}
