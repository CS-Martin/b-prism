/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get the current environment (default to 'development' if not set)
    const isProduction = process.env.NODE_ENV === 'production';

    // Set CORS policy depending on the environment
    app.enableCors({
        origin: isProduction
            ? ['https://project-haribon.vercel.app'] // Production allowed origin
            : ['http://localhost:3000', 'http://localhost'], // Local development allowed origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const config = new DocumentBuilder().setTitle('Rescue Post Service').setDescription('Rescue Post Service API').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, { useGlobalPrefix: true });

    const port = process.env.NEXT_PUBLIC_RESCUE_POST_SERVICE_API_PORT;
    await app.listen(port, '0.0.0.0');

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    Logger.log(`🚀 API Documentation is running on: http://localhost:${port}/api`);
}

bootstrap();
