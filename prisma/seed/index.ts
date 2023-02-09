/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Prisma, PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/fr'
import * as dotenv from 'dotenv'

const prisma = new PrismaClient()

const fakerUser = (): Prisma.UserCreateInput => ({
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const seedUser = async (): Promise<void> => {
  const fakerRounds = 10
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.user.create({ data: fakerUser() })
  }
}

const main = async (): Promise<void> => {
  dotenv.config()
  console.log('Seeding...')
  await seedUser()
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
