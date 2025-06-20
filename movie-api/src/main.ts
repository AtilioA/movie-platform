import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerConfig } from './config/swagger.config';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Set api prefix for all routes
  const apiVersion = configService.get<string>('API_VERSION', '1');
  app.setGlobalPrefix('api');

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
    prefix: 'v'
  });

  // Swagger setup
  const swaggerConfig = createSwaggerConfig(configService);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = '/api/docs';

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`API Version: ${apiVersion}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}${swaggerPath}`);
}

bootstrap().catch(error => {
  const logger = new Logger('Bootstrap', { timestamp: true });
  logger.error('Error during bootstrap', error);
  process.exit(1);
});
