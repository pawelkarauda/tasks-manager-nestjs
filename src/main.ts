import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');

  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const options = new DocumentBuilder()
    .setTitle('Testing API docs')
    // .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/documentation', app, document);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`App listerning on ${port}`);
}
bootstrap();
