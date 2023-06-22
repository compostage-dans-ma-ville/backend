import { UserRole } from '@prisma/client'
import { AuthenticatedUserType } from '~/user/user.service'
import { faker } from '@faker-js/faker'

export const authenticatedUser: AuthenticatedUserType = {
  id: 42,
  firstname: 'firstname',
  lastname: 'lastname',
  isEmailConfirmed: true,
  email: 'justaneöail@myemail.fr',
  description: null,
  password: '12345',
  imageId: null,
  role: UserRole.USER,
  organizations: [],
  sites: [],
  createdAt: new Date(2020, 0, 1),
  updatedAt: new Date(2021, 0, 1)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getUserDataFactory = () => {
  return {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'testTest1231*'
  }
}
