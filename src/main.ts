import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kupipodariday api')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'JWT',
      in: 'header',
      scheme: 'bearer',
    })
    .addSecurityRequirements('bearer')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  SwaggerModule.setup('/api/docs', app, swaggerDocument);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
  });

  await app.listen(configService.get('port'));
}
bootstrap();
