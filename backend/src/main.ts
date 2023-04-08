import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('KupiPodariDay')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);

  console.log('service started on port', PORT);
}

bootstrap();
