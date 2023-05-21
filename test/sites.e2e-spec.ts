import 'jest-extended'
import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common'
import request from 'supertest'
import { SiteModule } from '~/site/site.module'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'
import { CreateSiteDto } from '~/site/dto/CreateSite.dto'
import { GetOpeningDto } from '~/opening/dto/GetOpening.dto'
import { AbilityModule } from '~/ability/ability.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { authenticatedUser } from './test-utils'
import { AuthModule } from '~/auth/auth.module'
import { AuthenticatedUserType } from '~/user/user.service'
import { MailerModule } from '~/mailer/mailer.module'
import { SiteType } from '@prisma/client'

describe('sites', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SiteModule,
        DailyScheduleModule,
        JwtModule,
        AuthModule,
        AbilityModule,
        MailerModule
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const user: AuthenticatedUserType = {
            ...authenticatedUser,
            role: 'ADMIN'
          }
          context.switchToHttp().getRequest().user = user
          return true
        }
      })
      .compile()

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
          pageNumber: expect.any(Number),
          pageSize: expect.any(Number),
          totalCount: expect.any(Number)
        },
        data: expect.toBeArray()
      })
    })

    it('return a first site', async () => {
      const { body } = await request(app.getHttpServer()).get('/sites')

      expect(body.data[0]).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        launchDate: null,
        name: expect.any(String),
        description: expect.any(String),
        accessConditions: expect.toSatisfy(e => e === null || typeof e === 'string'),
        type: expect.arrayContaining(Object.values(SiteType)),
        isPublic: expect.any(Boolean),
        address: {
          id: expect.any(Number),
          houseNumber: expect.any(String),
          streetName: expect.any(String),
          zipCode: expect.any(Number),
          city: expect.any(String),
          latitude: expect.any(Number),
          longitude: expect.any(Number)
        },
        schedule: expect.toSatisfy(e => e === undefined
          || (e.length === 7
            && e.every((daily: null | GetOpeningDto[]) => daily === null
              || daily.length === 0
              || daily.every((opening: GetOpeningDto) => opening.open && opening.close)))),
        treatedWaste: expect.toSatisfy((x) => x === null || Number.isInteger(x))
      })
    })

    it('return the expected amount of site', async () => {
      const { body } = await request(app.getHttpServer()).get('/sites?items=10')

      expect(body.data.length).toEqual(10)
    })
  })

  describe('POST /sites', () => {
    it('add a new basic site with its address', async () => {
      const payload: CreateSiteDto = {
        launchDate: new Date(),
        name: 'A new site',
        description: 'A fancy description',
        isPublic: true, // it is always better
        type: SiteType.EDUCATIONAL_INSTITUTION,
        accessConditions: 'Free4All',
        address: {
          houseNumber: '5',
          streetName: 'chemin des carrières',
          zipCode: 33150,
          city: 'Cenon',
          latitude: 44.8578807,
          longitude: -0.5343909
        }
      }
      const req = await request(app.getHttpServer())
        .post('/sites')
        .send(payload)

      expect(req.status).toBe(HttpStatus.CREATED)

      await request(app.getHttpServer()).delete(`/sites/${req.body.id}`)
    })

    it('add a new site with schedule', async () => {
      const payload: CreateSiteDto = {
        launchDate: new Date(),
        name: 'A new site',
        description: 'A fancy description about this site',
        isPublic: true, // it is always better
        type: SiteType.EDUCATIONAL_INSTITUTION,
        accessConditions: 'Free4All under the following openings',
        address: {
          houseNumber: '5',
          streetName: 'chemin des carrières',
          zipCode: 33150,
          city: 'Cenon',
          latitude: 44.8578807,
          longitude: -0.5343909
        },
        schedule: [
          null,
          [{ open: '08:00', close: '12:00' }, { open: '13:00', close: '17:00' }],
          null,
          [{ open: '12:00', close: '16:00' }],
          null,
          null,
          null
        ]
      }
      const req = await request(app.getHttpServer())
        .post('/sites')
        .send(payload)

      expect(req.ok).toBe(true)
      expect(req.body).toEqual({
        accessConditions: 'Free4All under the following openings',
        addressId: expect.any(Number),
        createdAt: expect.any(String),
        description: 'A fancy description about this site',
        id: expect.any(Number),
        isPublic: true,
        launchDate: expect.any(String),
        name: 'A new site',
        organizationId: null,
        schedule: [
          null,
          [{ close: 720, open: 480 }, { close: 1020, open: 780 }],
          null,
          [{ close: 960, open: 720 }],
          null,
          null,
          null
        ],
        treatedWaste: null,
        updatedAt: expect.any(String)
      })

      await request(app.getHttpServer()).delete(`/sites/${req.body.id}`)
    })
  })

  describe('GET /sites/:id', () => {
    it('returns the site with the expected id', async () => {
      const { body: sitesBody } = await request(app.getHttpServer()).get('/sites')
      const { id } = sitesBody.data[0]
      const { status, body } = await request(app.getHttpServer()).get(`/sites/${id}`)

      expect(status).toBe(200)
      expect(body).toEqual({
        id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        launchDate: null,
        name: expect.any(String),
        description: expect.any(String),
        accessConditions: expect.toSatisfy(e => e === null || typeof e === 'string'),
        isPublic: expect.any(Boolean),
        tyoe: SiteType.EDUCATIONAL_INSTITUTION,
        address: {
          id: expect.any(Number),
          houseNumber: expect.any(String),
          streetName: expect.any(String),
          zipCode: expect.any(Number),
          city: expect.any(String),
          latitude: expect.any(Number),
          longitude: expect.any(Number)
        },
        schedule: expect.toSatisfy(e => e === undefined
          || (e.length === 7
            && e.every((daily: null | GetOpeningDto[]) => daily === null
              || daily.length === 0
              || daily.every((opening: GetOpeningDto) => opening.open && opening.close)))),
        treatedWaste: expect.toSatisfy((x) => x === null || Number.isInteger(x))
      })
    })
  })

  describe('PUT /sites/:id', () => {
    it('replace a new basic site with its address', async () => {
      const sites = await request(app.getHttpServer())
        .get('/sites')
      const original = sites.body.data[0]

      const payload: CreateSiteDto = {
        launchDate: new Date(),
        name: 'A new site',
        description: 'A fancy description',
        isPublic: true, // it is always better
        type: SiteType.EDUCATIONAL_INSTITUTION,
        accessConditions: 'Free4All',
        treatedWaste: 3000,
        address: {
          houseNumber: '5',
          streetName: 'chemin des carrières',
          zipCode: 33150,
          city: 'Cenon',
          latitude: 44.8578807,
          longitude: -0.5343909
        }
      }
      const req = await request(app.getHttpServer())
        .put(`/sites/${original.id}`)
        .send(payload)

      expect(req.ok).toBe(true)
      expect(req.body).toEqual({
        accessConditions: 'Free4All',
        address: {
          id: original.address.id,
          city: 'Cenon',
          houseNumber: '5',
          latitude: 44.8578807,
          longitude: -0.5343909,
          streetName: 'chemin des carrières',
          zipCode: 33150
        },
        addressId: original.address.id,
        createdAt: expect.any(String),
        description: 'A fancy description',
        id: original.id,
        isPublic: true,
        type: SiteType.EDUCATIONAL_INSTITUTION,
        launchDate: expect.any(String),
        name: 'A new site',
        treatedWaste: 3000,
        organizationId: null,
        updatedAt: expect.any(String)
      })
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: expect.any(String),
        description: expect.any(String)
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
