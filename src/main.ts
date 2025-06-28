import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,  
  }));
  const config = new DocumentBuilder()
    .setTitle('Clinic API')
    .setDescription('Clinic service API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  await app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}
bootstrap();
