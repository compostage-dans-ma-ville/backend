import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { mainConfig } from './main.config'
import { setupSwagger } from './swagger.setup'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  mainConfig(app)
  setupSwagger(app)

  await app.listen(3000)
}
bootstrap()
