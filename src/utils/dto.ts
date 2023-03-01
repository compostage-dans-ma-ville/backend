import { plainToClass as plainToClassTransformer } from 'class-transformer'

export const plainToClass: typeof plainToClassTransformer = (cls, plain, opts) => {
  return plainToClassTransformer(
    cls,
    plain,
    {
      excludeExtraneousValues: true,
      ...opts
    }
  )
}
