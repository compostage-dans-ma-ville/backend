import { Injectable } from '@nestjs/common'
import type { CreateSiteDto } from './dto/create-site.dto'
import type { UpdateSiteDto } from './dto/update-site.dto'
import { PrismaService } from '~/prisma/prisma.service'
import { Site } from '@prisma/client'

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSiteDto: CreateSiteDto) {
    return 'This action adds a new site'
  }

  findAll(): Promise<Site[]> {
    return this.prisma.site.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} site`
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`
  }

  remove(id: number) {
    return `This action removes a #${id} site`
  }
}
