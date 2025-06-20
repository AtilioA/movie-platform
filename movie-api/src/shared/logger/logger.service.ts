import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class Logger implements NestLoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    const logContext = context || this.context || 'App';
    console.log(`[${this.getTimestamp()}] [INFO] [${logContext}]`, message);
  }

  error(message: any, trace?: string, context?: string) {
    const logContext = context || this.context || 'App';
    console.error(`[${this.getTimestamp()}] [ERROR] [${logContext}]`, message, trace || '');
  }

  warn(message: any, context?: string) {
    const logContext = context || this.context || 'App';
    console.warn(`[${this.getTimestamp()}] [WARN] [${logContext}]`, message);
  }

  debug(message: any, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      const logContext = context || this.context || 'App';
      console.debug(`[${this.getTimestamp()}] [DEBUG] [${logContext}]`, message);
    }
  }

  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      const logContext = context || this.context || 'App';
      console.log(`[${this.getTimestamp()}] [VERBOSE] [${logContext}]`, message);
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }
}

export const LoggerService = new Logger();
