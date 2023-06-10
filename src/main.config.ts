import { INestApplication, ValidationPipe } from '@nestjs/common'

export const setMainConfig = (app: INestApplication): void => {
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    // remove properties that are not defined in a DTO
    // those without any decorator in the validation class
    whitelist: true,
    // transform the data in the DTO directly
    transform: true,
    transformOptions: {
      // use TS type to convert the input into its type
      // currently set to false as it does not work when set to true
      enableImplicitConversion: false,
      // use the default values of undefined fields
      exposeDefaultValues: true
    }
  }))
}
