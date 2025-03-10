/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['https://project-haribon.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const config = new DocumentBuilder().setTitle('Dispensing Point Service').setDescription('Dispensing Point Service API').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, { useGlobalPrefix: true });

    const port = process.env.NEXT_PUBLIC_DISPENSING_POINT_SERVICE_API_PORT;
    await app.listen(port, '0.0.0.0');

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    Logger.log(`🚀 API Documentation is running on: http://localhost:${port}/api`);
}

bootstrap();
