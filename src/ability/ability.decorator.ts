import { SetMetadata } from '@nestjs/common'
import { AppSubject, UserAction } from './ability.factory'

export const CHECK_ABILITY_KEY = 'check_ability'

export interface RequiredRule {
  action: UserAction,
  subject: AppSubject
}
export const CheckAbility = (...requirements: RequiredRule[]) => {
  return SetMetadata(CHECK_ABILITY_KEY, requirements)
}
