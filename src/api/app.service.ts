import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "src/config";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default class Application {
    public static async main(): Promise<void> {
        let app = await NestFactory.create(AppModule);
        app.useGlobalPipes(
            new ValidationPipe({
              whitelist: true,
              forbidNonWhitelisted: true,
              errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            }),
          );
        app.use(cookieParser());
        app.enableCors({
          origin: '*',
        });
        const api = 'api/v1';
        app.setGlobalPrefix(api);
        const config_swagger = new DocumentBuilder()
          .setTitle('Base app')
          .setVersion('1.0')
          .addBearerAuth({
            type: 'http',
            scheme: 'Bearer',
            in: 'Header'
          })
          .build();
          const documnetFactory = () => 
            SwaggerModule.createDocument(app, config_swagger);
          SwaggerModule.setup(api, app, documnetFactory);
        await app.listen(config.PORT, () => {
            console.log(Date.now());
          });
    }
}