import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'
import { SiteController } from './site.controller'
import { SiteService } from './site.service'

describe('SiteController', () => {
  let controller: SiteController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DailyScheduleModule],
      controllers: [SiteController],
      providers: [SiteService, PrismaService]
    }).compile()

    controller = module.get<SiteController>(SiteController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
