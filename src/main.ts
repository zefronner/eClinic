// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const PORT = Number(process.env.PORT)
//   const app = await NestFactory.create(AppModule);
//   await app.listen(PORT, () => console.log('Server is running on port: ', PORT));
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('eClinic API')
    .setDescription('eClinic loyihasi uchun API hujjatlari')
    .setVersion('1.0')
    .build(); 

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('eClinic', app, document);

  await app.listen(3000);
}
bootstrap();
