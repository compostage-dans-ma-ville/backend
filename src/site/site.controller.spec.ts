import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '~/prisma/prisma.service'
import { SiteController } from './site.controller'
import { SiteService } from './site.service'

describe('SiteController', () => {
  let controller: SiteController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteController],
      providers: [SiteService, PrismaService]
    }).compile()

    controller = module.get<SiteController>(SiteController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
