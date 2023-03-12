import { Injectable } from '@nestjs/common'
// import type { CreateSiteDto } from './dto/create-site.dto'
// import type { UpdateSiteDto } from './dto/update-site.dto'
import { PrismaService } from '~/prisma/prisma.service'
import {
  Address, ImageSiteRelation, Organization, Prisma, DailySchedule, Site, Opening
} from '@prisma/client'

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createSiteDto: CreateSiteDto) {
  //   return 'This action adds a new site'
  // }

  findAll({ skip, take }: Prisma.SiteFindManyArgs): Promise<(Site & {
    DailySchedules: Array<DailySchedule & { openings: Opening[] }> 
  })[]> {
    return this.prisma.site.findMany({
      include: {
        DailySchedules: {
          include: {
            openings: true
          }
        },
      },
      skip,
      take
    })
  }

  count(): Promise<number> {
    return this.prisma.site.count()
  }

  findOne(id: number): Prisma.Prisma__SiteClient<(Site & {
    DailySchedules: Array<DailySchedule & { openings: Opening[] }>;
    Images: ImageSiteRelation[];
    Address: Address;
    Organization: Organization | null;
}) | null, null> {
    return this.prisma.site.findUnique({
      include: {
        Address: true,
        DailySchedules: {
          include: {
            openings: true
          }
        },
        Images: true, Organization: true
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
