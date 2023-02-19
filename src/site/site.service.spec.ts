import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '~/prisma/prisma.service'
import { SiteService } from './site.service'

describe('SiteService', () => {
  let service: SiteService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteService, PrismaService]
    }).compile()

    service = module.get<SiteService>(SiteService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
