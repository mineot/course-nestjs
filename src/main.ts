import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './core/interceptors/log/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO to more details see de doc on nest github, find by cors doc
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LogInterceptor()); // para que o interceptor esteja disponivel a todos os controllers
  await app.listen(3000);
}
bootstrap();
