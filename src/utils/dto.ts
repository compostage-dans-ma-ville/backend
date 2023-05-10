import { plainToInstance as plainToClassTransformer } from 'class-transformer'

export const plainToInstance: typeof plainToClassTransformer = (cls, plain, opts) => {
  return plainToClassTransformer(
    cls,
    plain,
    {
      excludeExtraneousValues: true,
      ...opts
    }
  )
}

// string of more than 8 characters containing at least one lower case, one upper case, one number and one symbol
export const PASSWORD_MATCHER = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g
