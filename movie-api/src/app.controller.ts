import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller({
  version: VERSION_NEUTRAL,
  path: '',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check if the API is running' })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
