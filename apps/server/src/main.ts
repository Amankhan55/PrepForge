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

  const clientUrl = process.env['CLIENT_URL'];
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://prep-forge-delta.vercel.app',
  ];
  if (clientUrl) {
    allowedOrigins.push(clientUrl);
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server calls)
      if (!origin) {
        return callback(null, true);
      }
      
      const isAllowed = allowedOrigins.some(allowed => {
        // Compare case-insensitively and strip trailing slashes to prevent configuration typos
        return allowed.toLowerCase().replace(/\/$/, '') === origin.toLowerCase().replace(/\/$/, '');
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  });

  const port = process.env['PORT'] || 3000;
  await app.listen(port);
  console.log(`🚀 PrepForge API running at http://localhost:${port}/api`);
}

bootstrap();
