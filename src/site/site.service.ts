import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { Prisma, Site } from '@prisma/client'
import { CoordsParams } from '~/address/dto/CoordsQueryParams.dto'
import { AddressService } from '~/address/address.service'

export type SiteCollectionFilter = {
  coordinates?: CoordsParams
}

type ScheduleOption = (({ open: number, close: number })[] | null)[]

@Injectable()
export class SiteService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createSiteDto: Prisma.SiteCreateInput, options: { schedule?: ScheduleOption }) {
    const site = await this.prisma.site.create({ data: createSiteDto })

    const { schedule: createSchedule } = options
    let schedule
    if (createSchedule) {
      const scheduleRequests = createSchedule.map(async (dailySchedule, dayOfWeek) => {
        if (dailySchedule === null) return null
        return (await this.prisma.dailySchedule.create({
          select: {
            openings: { select: { open: true, close: true } }
          },
          data: {
            siteId: site.id,
            dayOfWeek,
            openings: {
              createMany: { data: dailySchedule }
            }
          }
        })).openings
      })
      schedule = await Promise.all(scheduleRequests)
    }
    return {
      ...site,
      schedule
    }
  }

  async replace(
    id: number,
    payload: Prisma.SiteUpdateInput,
    options: { schedule?: ScheduleOption } = {}
  ) {
    const site = await this.prisma.site.update({
      include: { address: true },
      data: payload,
      where: { id }
    })

    const { schedule: createSchedule } = options
    let schedule
    if (createSchedule) {
      const scheduleRequests = createSchedule.map(async (dailySchedule, dayOfWeek) => {
        if (dailySchedule === null) {
          await this.prisma.dailySchedule.delete({
            where: {
              siteId_dayOfWeek: {
                siteId: site.id,
                dayOfWeek
              }
            }
          })
          return null
        }

        return this.prisma.dailySchedule.updateMany({
          data: {
            ...dailySchedule
          },
          where: {
            siteId: site.id,
            dayOfWeek
          }
        })
      })

      schedule = await Promise.all(scheduleRequests)
    }

    return {
      ...site,
      schedule
    }
  }

  async findAll({ skip, take, coordinates }: Prisma.SiteFindManyArgs & SiteCollectionFilter) {
    const addressQuery = coordinates ? await this.prisma.address.findMany({
      select: {
        id: true
      },
      where: AddressService.getBBoxFromCoordinates(coordinates)
    }) : undefined

    const query = {
      include: {
        address: true,
        dailySchedules: {
          include: {
            openings: true
          }
        }
      },
      skip,
      take,
      where: addressQuery && {
        address: { id: { in: addressQuery.map(({ id }) => id) } }
      }
    }

    const [sites, count] = await this.prisma.$transaction([
      this.prisma.site.findMany(query),
      this.prisma.site.count({ where: query.where })
    ])
    return [sites, count] as const
  }

  count(): Promise<number> {
    return this.prisma.site.count()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  findOne(id: number) {
    return this.prisma.site.findUnique({
      include: {
        address: true,
        dailySchedules: {
          include: {
            openings: true
          }
        }
      },
      where: { id }
    })
  }

  // update(id: number, updateSiteDto: UpdateSiteDto) {
  //   return `This action updates a #${id} site`
  // }

  remove(id: number): Prisma.Prisma__SiteClient<Site> {
    return this.prisma.site.delete({ where: { id } })
  }
}
