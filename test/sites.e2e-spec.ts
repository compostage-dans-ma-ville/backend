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

  it('returns some sites', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/sites')

    expect(status).toBe(200)
    expect(body).toBeDefined()
    expect(body).toMatchSnapshot()
  })
})
