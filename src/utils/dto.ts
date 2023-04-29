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
