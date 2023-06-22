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
import { AuthModule } from '~/auth/auth.module'
import { MailerModule } from '~/mailer/mailer.module'
import { setMainConfig } from '~/main.config'
import { GetSiteDto } from '~/site/dto/GetSite.dto'
import {
  Address,
  Site, SiteRole, SiteType, User, UserSiteRelation
} from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'

const sendMailSpy = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: sendMailSpy
  })
}))

describe('sites', () => {
  let app: INestApplication
  let mockedUser: User

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
        canActivate: async (context: ExecutionContext) => {
          mockedUser = await moduleFixture.get(PrismaService).user.findFirst({
            include: { sites: true, organizations: true }
          }) as User
          const user = {
            ...mockedUser,
            role: 'ADMIN'
          }
          context.switchToHttp().getRequest().user = user
          return true
        }
      })
      .compile()

    app = moduleFixture.createNestApplication()
    setMainConfig(app)
    await app.init()
  })

  afterEach(() => {
    sendMailSpy.mockClear()
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
        type: expect.toSatisfy((x) => Object.values(SiteType).includes(x)),
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
        treatedWaste: expect.toSatisfy((x) => x === null || Number.isInteger(x)),
        members: expect.toBeArray()
      })
    })

    it('return the expected amount of site', async () => {
      const { body, status } = await request(app.getHttpServer()).get('/sites?items=10')

      expect(status).toBe(200)
      expect(body.data.length).toEqual(10)
    })

    it('return a site close to the expected position', async () => {
      const { body, status } = await request(app.getHttpServer()).get('/sites?items=1')

      expect(status).toBe(200)
      expect(body.data.length).toEqual(1)
      const siteTest = body.data[0]

      const RADIUS = 1000
      const { address } = siteTest
      const response = await request(app.getHttpServer())
        .get(`/sites?longitude=${address.longitude}&latitude=${address.latitude}&radius=${RADIUS}`)
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBeGreaterThan(0)
      const site = response.body.data[0] as GetSiteDto
      expect(site).toEqual(siteTest)
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
        type: SiteType.EDUCATIONAL_INSTITUTION,
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
        type: expect.toSatisfy((x) => Object.values(SiteType).includes(x)),
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
        treatedWaste: expect.toSatisfy((x) => x === null || Number.isInteger(x)),
        members: expect.toBeArray()
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

  describe('PUT /sites/:id/members/invitations', () => {
    let site: (Site & { address: Address; members: UserSiteRelation[]; })
    const siteAdmins: User[] = []
    const description = 'Just a description with enough characters...'

    beforeAll(async () => {
      const { body: sitesBody } = await request(app.getHttpServer()).get('/sites')
      const { id } = sitesBody.data[0]
      site = (await app.get(PrismaService).site.findUnique({
        where: {
          id
        },
        include: {
          address: true,
          members: true
        }
      }))!

      await Promise.all(site.members.map(async (member) => {
        // @ts-expect-error
        if (([SiteRole.ADMIN, SiteRole.REFEREE]).includes(member.role)) {
          const user = (await app.get(PrismaService).user.findUnique({
            where: {
              id: member.userId
            }
          }))!

          siteAdmins.push(user)
        }
      }))
    })

    it('should send the invitation request', async () => {
      const { status } = await request(app.getHttpServer())
        .put(`/sites/${site.id}/members/invitations`)
        .send({ description })

      expect(status).toBe(204)
      expect(sendMailSpy).toHaveBeenCalledOnce()

      const emailCall = sendMailSpy.mock.lastCall[0]
      const email = emailCall.html as string
      const bcc = emailCall.bcc as string[]

      expect(email).toContain('Accéder au site')
      expect(email).toContain(`${mockedUser.firstname} ${mockedUser.lastname}`)
      expect(email).toContain(mockedUser.email)
      expect(email).toContain(site.name)
      expect(email).toContain(`/sites/${site.id}`)
      expect(bcc).toIncludeAllMembers(siteAdmins.map((admin) => admin.email))
    })

    it('should not send the invitation request if already asked', async () => {
      const { status } = await request(app.getHttpServer())
        .put(`/sites/${site.id}/members/invitations`)
        .send({ description })

      expect(status).toBe(409)
      expect(sendMailSpy).toHaveBeenCalledTimes(0)
    })
  })
})
