import { Controller, Get, VERSION_NEUTRAL, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './shared/decorators/public.decorator';

class HealthCheckResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
}

@ApiTags('Health')
@Controller({
  version: VERSION_NEUTRAL,
  path: '',
})
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
    this.logger.log('AppController initialized');
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Check if the API is running' })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    type: HealthCheckResponse,
  })
  getHealth(): HealthCheckResponse {
    this.logger.debug('Health check endpoint called');
    try {
      const healthData = {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };

      this.logger.log(`Health check successful - Uptime: ${healthData.uptime.toFixed(2)}s`);
      return healthData;
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`, error.stack);
      return {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }
  }
}
