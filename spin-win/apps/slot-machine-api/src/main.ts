import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Casino API')
    .setDescription('The Casino API description')
    .setVersion('1.0')
    .addTag('casino')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Casino is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`🚀 Swagger UI is running on: http://localhost:${port}/api-docs`);
}

bootstrap();
