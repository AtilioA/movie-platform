import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_CONFIG = (config: ConfigService) => ({
  title: config.get<string>('SWAGGER_TITLE', 'Movie Platform API'),
  description: config.get<string>(
    'SWAGGER_DESCRIPTION',
    'The movie-platform REST API',
  ),
  version: config.get<string>('SWAGGER_VERSION', '1.0'),
  path: config.get<string>('SWAGGER_PATH', '/docs'),
});

export function createSwaggerConfig(config: ConfigService) {
  const configValues = SWAGGER_CONFIG(config);

  return new DocumentBuilder()
    .setTitle(configValues.title)
    .setDescription(configValues.description)
    .setVersion(configValues.version)
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'api-key',
    )
    .build();
}
