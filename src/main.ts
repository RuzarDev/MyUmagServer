  import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
  import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем поддержку CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Разрешаем передачу cookies и заголовков Authorization
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные HTTP-методы
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
