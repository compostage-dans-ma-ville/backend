import {
  PipeTransform, Injectable, BadRequestException
} from '@nestjs/common'

@Injectable()
export class ItemsQueryPipe implements PipeTransform {
  transform(value: string|undefined): number {
    if (value === undefined) {
      return 20
    }

    const val = parseInt(value, 10)
    if (Number.isNaN(val)) {
      throw new BadRequestException('The items query params must be an integer.')
    }
    if (val <= 0) {
      throw new BadRequestException('The items query parameter should be a positive integer.')
    }

    return val
  }
}
