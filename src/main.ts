import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setMainConfig } from './main.config'
import { setupSwagger } from './swagger.setup'
import { AbilityExceptionFilter } from './ability/ability-exception.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  setMainConfig(app)
  setupSwagger(app)

  app.useGlobalFilters(new AbilityExceptionFilter())
  await app.listen(3000)
}
bootstrap()
