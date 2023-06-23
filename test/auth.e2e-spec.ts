import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, INestApplication } from '@nestjs/common'
import * as cheerio from 'cheerio'

import { AuthModule } from '~/auth/auth.module'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'
import { MailerModule } from '~/mailer/mailer.module'
import { UserModule } from '~/user/user.module'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { AuthenticatedUserType } from '~/user/user.service'
import { authenticatedUser, getUserDataFactory } from './test-utils'
import { setMainConfig } from '~/main.config'

const sendMailSpy = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: sendMailSpy
  })
}))

describe('auth', () => {
  let app: INestApplication
  const userData = getUserDataFactory()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MailerModule, UserModule],
      providers: [WebAppLinksService]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const user: AuthenticatedUserType = {
            ...authenticatedUser,
            isEmailConfirmed: false
          }
          context.switchToHttp().getRequest().user = user
          return true
        }
      }).compile()

    app = moduleFixture.createNestApplication()
    setMainConfig(app)
    await app.init()
  })

  afterEach(() => {
    sendMailSpy.mockClear()
  })

  describe('POST /auth/register', () => {
    it('should create a user', async () => {
      const { status, body } = await request(app.getHttpServer()).post('/auth/register').send(userData)

      expect(status).toBe(200)
      expect(body).toBeDefined()
      expect(body).toStrictEqual({
        token: expect.any(String),
        data: {
          id: expect.any(Number),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isEmailConfirmed: false,
          role: 'USER',
          description: expect.toSatisfy(e => typeof e === 'string' || e === null)
        }
      })
      expect(sendMailSpy).toHaveBeenCalledOnceWith({
        from: expect.any(String),
        to: userData.email,
        subject: 'Activer votre compte',
        html: expect.stringContaining('/authentication/activate/')
      })
    })

    it('should fail on invalid provided data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...invalidData } = userData
      const { status } = await request(app.getHttpServer()).post('/auth/register').send(invalidData)

      expect(status).toBe(400)
    })

    it('should fail when user exist', async () => {
      const user = getUserDataFactory()
      const { status: fistUserCreationStatus } = await request(app.getHttpServer()).post('/auth/register').send(user)
      expect(fistUserCreationStatus).toBe(200)
      const { status: secondUserCreationStatus } = await request(app.getHttpServer()).post('/auth/register').send(userData)
      expect(secondUserCreationStatus).toBe(409)
    })
  })

  describe('POST /auth/login', () => {
    it('should login a valid user', async () => {
      const { status, body } = await request(app.getHttpServer()).post('/auth/login').send(userData)

      expect(status).toBe(200)
      expect(body).toBeDefined()
      expect(body).toEqual({
        token: expect.any(String),
        data: expect.objectContaining({
          id: expect.any(Number),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String)
        })
      })
    })

    it('should forbid access', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...userData, password: 'invalidPwd' })

      expect(status).toBe(403)
    })
  })

  describe('POST /auth/activate/:token', () => {
    it('should activate a new user account', async () => {
      const newUser = getUserDataFactory()
      const { body } = await request(app.getHttpServer()).post('/auth/register').send(newUser)

      const testUser = body.data

      const $email = cheerio.load(sendMailSpy.mock.lastCall[0].html)

      const validationLink = $email('a').attr('href')!
      const token = validationLink.split('/').slice(-1).pop()

      const { status } = await request(app.getHttpServer()).post(`/auth/activate/${token}`).send()

      expect(status).toBe(204)

      const { body: getUserRes } = await request(app.getHttpServer())
        .get(`/users/${testUser.id}`)
        .send()

      expect(getUserRes.isEmailConfirmed).toBeTrue()
    })

    it('should fail if invalid token', async () => {
      const { status } = await request(app.getHttpServer()).post('/auth/activate/foobar').send()

      expect(status).toBe(400)
    })
  })

  describe('POST /auth/send-email-validation-token', () => {
    it('should send an email', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/auth/send-email-validation-token')
        .send()

      expect(status).toBe(204)
      expect(sendMailSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('POST /auth/send-reset-password-email', () => {
    it('shouldn\'t send an email to unknown email', async () => {
      const { status } = await request(app.getHttpServer()).post('/auth/send-reset-password-email').send({ email: 'thisemailisunknow@foobar.test' })

      expect(status).toBe(404)
      expect(sendMailSpy).not.toHaveBeenCalled()
    })

    it('should fail if invalid payload', async () => {
      const { status } = await request(app.getHttpServer()).post('/auth/send-reset-password-email').send()

      expect(status).toBe(400)
    })

    it('should send email', async () => {
      const { status } = await request(app.getHttpServer()).post('/auth/send-reset-password-email').send({ email: userData.email })

      expect(status).toBe(204)
      expect(sendMailSpy).toHaveBeenCalledOnceWith({
        from: expect.any(String),
        to: userData.email,
        subject: 'Modification de votre mot de passe',
        html: expect.stringContaining('/authentication/reset-password/')
      })
    })
  })

  describe('POST /auth/reset-password', () => {
    it('should fail if invalid payload', async () => {
      const { status } = await request(app.getHttpServer()).post('/auth/reset-password').send()

      expect(status).toBe(400)
    })

    it('should update the password', async () => {
      await request(app.getHttpServer()).post('/auth/send-reset-password-email').send({ email: userData.email })

      const $email = cheerio.load(sendMailSpy.mock.lastCall[0].html)

      const validationLink = $email('a').attr('href')!
      const token = validationLink.split('/').slice(-1).pop()

      const newPassword = 'AnewPassw0rd!'
      const { status } = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token, password: newPassword })

      expect(status).toBe(204)

      const { status: getUserStatus } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userData.email, password: newPassword })

      expect(getUserStatus).toBe(200)
    })
  })
})
