import {
  CanActivate, ExecutionContext, ForbiddenException, Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AbilityFactory } from './ability.factory'
import { CHECK_ABILITY_KEY, RequiredRule } from './ability.decorator'
import { ForbiddenError } from '@casl/ability'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'

@Injectable()
export class AbilityGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {
    super(reflector)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)

    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITY_KEY,
      context.getHandler()
    )

    const req = context.switchToHttp().getRequest()
    const user = req.user
    const ability = await this.abilityFactory.createAbility(user)

    try {
      rules.forEach((rule =>{
        return ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
      }))

      return true
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message)
      }

      return false
    }
  }
}
