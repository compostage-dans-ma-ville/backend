import 'jest-extended'
import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, INestApplication } from '@nestjs/common'
import request from 'supertest'
import { SiteModule } from '~/site/site.module'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'
import { AbilityModule } from '~/ability/ability.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { authenticatedUser } from './test-utils'
import { AuthModule } from '~/auth/auth.module'
import { AuthenticatedUserType } from '~/user/user.service'
import { MailerModule } from '~/mailer/mailer.module'
import { setMainConfig } from '~/main.config'
import { UserRole } from '@prisma/client'

describe('users', () => {
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
    setMainConfig(app)
    await app.init()
  })

  describe('GET /users', () => {
    it('returns a default pagination structure', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/users')

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

    it('returns correctly formatted users', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/users')

      expect(status).toBe(200)
      expect(body.data[0]).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        createdAt: expect.toBeDateString(),
        updatedAt: expect.toBeDateString(),
        firstname: expect.any(String),
        lastname: expect.any(String),
        description: expect.toSatisfy(e => typeof e === 'string' || e === null)
      })
    })
  })
})
