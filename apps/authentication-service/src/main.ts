/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const isProduction = process.env.APP_ENV === 'production';

    app.enableCors({
        origin: isProduction ? ['https://projectharibon.com', 'https://www.projectharibon.com'] : ['http://localhost:3000', 'http://localhost'], // Local development allowed origins
        methods: ['GET', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        credentials: true,
    });

    const config = new DocumentBuilder().setTitle('Authentication Service').setDescription('Authentication Service API').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, { useGlobalPrefix: true });

    const port = process.env.NEXT_PUBLIC_AUTH_SERVICE_API_PORT;
    await app.listen(port, '0.0.0.0');

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    Logger.log(`🚀 API Documentation is running on: http://localhost:${port}/api`);
}

bootstrap();
