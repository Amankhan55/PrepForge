import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: process.env['CLIENT_URL'] || 'http://localhost:4200',
    credentials: true,
  });

  const port = process.env['PORT'] || 3000;
  await app.listen(port);
  console.log(`🚀 PrepForge API running at http://localhost:${port}/api`);
}

bootstrap();
