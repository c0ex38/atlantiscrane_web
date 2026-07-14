import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set API prefix
  app.setGlobalPrefix('api/v1');

  // Cookie Parser
  app.use(cookieParser());

  // Static files for uploads
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Standard API Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS configuration
  const corsOrigins =
    configService.get<string>('CORS_ORIGINS') ||
    'http://localhost:3000,http://localhost:3002';
  const allowedOrigins = corsOrigins.split(',').map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`NestJS Backend running on: http://localhost:${port}/api/v1`);
}
void bootstrap();
