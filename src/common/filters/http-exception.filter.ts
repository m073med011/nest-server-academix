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
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && 'message' in res) {
        message = Array.isArray((res as any).message)
          ? (res as any).message.join(', ')
          : (res as any).message;
      } else if (typeof res === 'string') {
        message = res;
      }
    } else if (exception instanceof Error) {
      // Mongoose CastError
      if (exception.name === 'CastError') {
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
      }
      // Mongoose Duplicate Key
      else if ((exception as any).code === 11000) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Duplicate field value entered';
      }
      // Mongoose ValidationError
      else if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST;
        const errors = Object.values((exception as any).errors).map(
          (e: any) => e.message,
        );
        message = errors.join(', ');
      } else {
        message = exception.message;
      }
      stack = exception.stack;
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      stack,
    );

    const errorResponse: any = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (process.env.NODE_ENV === 'development' && stack) {
      errorResponse.stack = stack;
    }

    response.status(status).json(errorResponse);
  }
}
