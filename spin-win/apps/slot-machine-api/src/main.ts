import * as tsConfig from 'tsconfig-paths';
// import * as tsConfigJson from '../../../tsconfig.base.json';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import dotenv from 'dotenv';
import { DatabaseSeeder } from '@common/persistence/database/database.seeder';

dotenv.config();

// Register path aliases
// tsConfig.register({
//   baseUrl: '.',
//   paths: tsConfigJson.compilerOptions.paths
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Casino API')
    .setDescription('The Casino API description')
    .setVersion('1.0')
    .addTag('casino')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Enable CORS
  app.enableCors();

  // Seed the database
  try {
    const seeder = app.get(DatabaseSeeder);
    await seeder.seed();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Casino is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
