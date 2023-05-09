import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as cheerio from 'cheerio'

import { faker } from '@faker-js/faker'
import { AuthModule } from '~/auth/auth.module'
import { mainConfig } from '~/main.config'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'
import { MailerModule } from '~/mailer/mailer.module'
import { UserModule } from '~/user/user.module'

const sendMailSpy = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: sendMailSpy
  })
}))

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getUserDataFactory = () => {
  return {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'testTest1231*'
  }
}
describe('auth', () => {
  let app: INestApplication
  const userData = getUserDataFactory()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MailerModule, UserModule],
      providers: [WebAppLinksService]
    }).compile()

    app = moduleFixture.createNestApplication()

    mainConfig(app)

    await app.init()
  })

  describe('POST /auth/register', () => {
    it('should create a user', async () => {
      const { status, body } = await request(app.getHttpServer()).post('/auth/register').send(userData)

      expect(status).toBe(200)
      expect(body).toBeDefined()
      expect(body).toEqual({
        token: expect.any(String),
        data: {
          id: expect.any(Number),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String),
          isEmailConfirmed: false
        }
      })
      expect(sendMailSpy).toHaveBeenCalledOnceWith({
        from: expect.any(String),
        to: userData.email,
        subject: 'Activer votre compte',
        html: expect.stringContaining('/authentification/activate/')
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

      const createdUser = body.data

      const $email = cheerio.load(sendMailSpy.mock.lastCall[0].html)

      const validationLink = $email('a').attr('href')!
      const token = validationLink.split('/').slice(-1).pop()

      const { status } = await request(app.getHttpServer()).post(`/auth/activate/${token}`).send()

      expect(status).toBe(204)

      const { body: getUserRes } = await request(app.getHttpServer()).get(`/users/${createdUser.id}`).send()

      expect(getUserRes.isEmailConfirmed).toBeTrue()
    })

    it('should fail if invalid token', async () => {
      const { status } = await request(app.getHttpServer()).post('/auth/activate/foobar').send()

      expect(status).toBe(400)
    })
  })
})
