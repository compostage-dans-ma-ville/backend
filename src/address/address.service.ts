import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Coordinates } from './dto/CoordsQueryParams.dto'
import type { BBox } from './types'

@Injectable()
export class AddressService {
  static EARTH_RADIUS = 6379000

  /**
     * @param longitude in degree with the format WSG84
     * @param latitude in degree with the format WSG84
     * @param radius in km
     */
  static getBBoxFrom(longitude: number, latitude: number, radius: number): BBox {
    const delta = (radius / AddressService.EARTH_RADIUS) * (180 / Math.PI)

    const maxLat = latitude + delta
    const maxLong = longitude + delta

    const minLat = latitude - delta
    const minLong = longitude - delta

    return {
      maxLat,
      maxLong,
      minLat,
      minLong
    }
  }

  static getBBoxFromCoordinates(coordinates: Coordinates): Prisma.AddressWhereInput | undefined {
    const { longitude, latitude, radius } = coordinates
    const {
      minLong, minLat, maxLong, maxLat
    } = AddressService.getBBoxFrom(longitude, latitude, radius)

    return {
      longitude: { gte: minLong, lte: maxLong },
      latitude: { gte: minLat, lte: maxLat }
    }
  }
}
