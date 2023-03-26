import { Injectable } from '@nestjs/common'
// import type { CreateSiteDto } from './dto/create-site.dto'
// import type { UpdateSiteDto } from './dto/update-site.dto'
import { PrismaService } from '~/prisma/prisma.service'
import { Prisma, Site } from '@prisma/client'

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createSiteDto: CreateSiteDto) {
  //   return 'This action adds a new site'
  // }

  findAll({ skip, take }: Prisma.SiteFindManyArgs) {
    return this.prisma.site.findMany({
      include: {
        Address: true,
        DailySchedules: {
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
        Address: true,
        DailySchedules: {
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
