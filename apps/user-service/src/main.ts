/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('User Service')
        .setDescription('User Service API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, { useGlobalPrefix: true });

    console.log("USER_SERVICE_API_PORT", process.env.USER_SERVICE_API_PORT);

    const port = process.env.USER_SERVICE_API_PORT;
    await app.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
    Logger.log(`🚀 API Documentation is running on: http://localhost:${port}/api`);
}

bootstrap();
