import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { Prisma, Site } from '@prisma/client'

type ScheduleOption = (({ open: number, close: number })[] | null)[]
@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSiteDto: Prisma.SiteCreateInput, options: { schedule?: ScheduleOption }) {
    const site = await this.prisma.site.create({ data: createSiteDto })
    
    const { schedule: createSchedule } = options
    let schedule;
    if(createSchedule) {
      const scheduleRequests = createSchedule.map(async (dailySchedule, dayOfWeek) => {
        if(dailySchedule === null) return null
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

  findAll({ skip, take }: Prisma.SiteFindManyArgs) {
    return this.prisma.site.findMany({
      include: {
        address: true,
        dailySchedules: {
          include: {
            openings: true
          }
        }
      },
      skip,
      take
    })
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
