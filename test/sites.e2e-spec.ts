import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { SiteModule } from '~/site/site.module'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'
import 'jest-extended'

describe('sites', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SiteModule, DailyScheduleModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('GET /sites', () => {
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
          pageSize: 20,
          totalCount: 20
        },
        data: expect.toBeArray()
      })
    })

    it('return a first site', async () => {
      const { body } = await request(app.getHttpServer()).get('/sites')
      expect(body.data[0]).toEqual({
        id: expect.any(Number),
        addressId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        launchDate: expect.any(null),
        name: expect.any(String),
        description: expect.any(String),
        organizationId: null,
        schedule: expect.toIncludeAnyMembers([
          expect.arrayContaining([
            {
              open: expect.toBeString(),
              close: expect.toBeString()
            }
          ]),
          [],
          null
        ])
      })
    })

    it('return the expected amount of site', async () => {
      const { body } = await request(app.getHttpServer()).get('/sites?items=10')

      expect(body.data.length).toEqual(10)
    })
  })

  describe('DELETE /sites/:id', () => {
    it('remove a site by id', async () => {
      const { body: toDelete } = await request(app.getHttpServer()).get('/sites')
      const id = toDelete.data[0].id
      const { status, body } = await request(app.getHttpServer()).delete(`/sites/${id}`)

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id,
        addressId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        organizationId: null
      })
    })

    it('throw a 404 if the site is not found', async () => {
      const { status, body } = await request(app.getHttpServer()).delete('/sites/20230227')

      expect(status).toBe(404)
      expect(body).toMatchObject({
        message: expect.any(String)
      })
    })

    it('throw a 400 if the id is malformed', async () => {
      const { status, body } = await request(app.getHttpServer()).delete('/sites/abcd')

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: expect.any(String)
      })
    })
  })
})
