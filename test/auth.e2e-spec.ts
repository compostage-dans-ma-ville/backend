import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { faker } from '@faker-js/faker'
import { AuthModule } from '~/auth/auth.module'
import { mainConfig } from '~/main.config'

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
      imports: [AuthModule]
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
        data: expect.objectContaining({
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String)
        })
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
})
