import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedUserType } from '~/user/user.service'

export const AuthenticatedUser = createParamDecorator<AuthenticatedUserType>(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUserType => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as AuthenticatedUserType | undefined

    if (!user) {
      throw new Error('@AuthenticatedUser params decorator has to be called after the call of JwtAuthGuard. Did you forget the @UseGuards(JwtAuthGuard) decorator?')
    }

    return user
  },
)
