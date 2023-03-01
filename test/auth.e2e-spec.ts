import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { faker } from '@faker-js/faker'
import { AuthModule } from '~/auth/auth.module'

describe('auth', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('POST /auth/register', () => {
    it('create a user', async () => {
      const userData = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'testTest1231*'
      }
      const { status, body } = await request(app.getHttpServer()).post('/auth/register').send(userData)

      expect(status).toBe(200)
      expect(body).toBeDefined()
      expect(body).toEqual({
        firstname: expect.any(String),
        lastname: expect.any(String),
        email: expect.any(String),
        token: expect.any(String)
      })
    })
  })
})
