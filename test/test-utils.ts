import { UserRole } from '@prisma/client'
import { AuthenticatedUserType } from '~/user/user.service'

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
