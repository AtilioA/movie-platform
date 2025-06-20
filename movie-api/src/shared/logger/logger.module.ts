import { Global, Module, OnModuleInit } from '@nestjs/common';
import { Logger } from './logger.service';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useValue: new Logger(),
    },
  ],
  exports: [Logger],
})
export class LoggerModule implements OnModuleInit {
  private readonly logger = new Logger(LoggerModule.name);

  onModuleInit() {
    this.logger.log('Logger module initialized');
  }
}
