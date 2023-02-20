import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { SiteModule } from '~/site/site.module'

describe('GET /sites', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SiteModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('returns a default pagination structure', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/sites')

    expect(status).toBe(200)
    expect(body).toBeDefined()
    expect(body).toEqual({
      links: {
        first: expect.any(String),
        last: expect.any(String)
      },
      pagination: {
        pageNumber: 1,
        pageSize: 0,
        totalCount: 20
      },
      data: expect.any(Array)
      // data: {
      //   id: expect.any(Number),
      //   addressId: expect.any(Number),
      //   avatar: null,
      //   createdAt: expect.any(String),
      //   updatedAt: expect.any(String),
      //   name: expect.any(String),
      //   description: null,
      //   organizationId: null
      // }
    })
  })
})
