import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainModule } from './main-module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const config = new DocumentBuilder()
    .setTitle('Pomodoro API')
    .setDescription('Api for a pomodoro timer application')
    .setVersion('1.0')
    .addTag('pomodoros')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().catch((err) => console.error(err));
