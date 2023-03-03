import { INestApplication, ValidationPipe } from '@nestjs/common'

export const mainConfig = (app: INestApplication): void => {
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
}
