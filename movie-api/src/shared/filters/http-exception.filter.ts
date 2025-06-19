import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let validationErrors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
      error = response.error || exception.name;

      if (status === HttpStatus.BAD_REQUEST && Array.isArray(message)) {
        validationErrors = message;
        message = 'Validation failed';
      }
    }

    // Log the error
    this.logger.error(
      `HTTP Exception: ${status} ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(validationErrors.length > 0 && { errors: validationErrors }),
    });
  }
}
