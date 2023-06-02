import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { mainConfig } from './main.config'
import { setupSwagger } from './swagger.setup'
import { AbilityExceptionFilter } from './ability/ability-exception.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  mainConfig(app)
  setupSwagger(app)

  app.useGlobalFilters(new AbilityExceptionFilter())
  app.useStaticAssets(join(__dirname, '..', 'uploaded-pictures'), {
    index: false,
    prefix: '/uploaded-pictures'
  })

  await app.listen(3000)
}
bootstrap()
