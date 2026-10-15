import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * HttpExceptionFilter - Chỉ bắt các HttpException (400, 401, 403, 404, v.v.)
 * Trả về response chuẩn với statusCode, message, timestamp, path
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const body =
      typeof exceptionResponse === 'string'
        ? {
            statusCode: status,
            message: exceptionResponse,
            timestamp: new Date().toISOString(),
            path: request.url,
          }
        : {
            ...(exceptionResponse as object),
            timestamp: new Date().toISOString(),
            path: request.url,
          };

    response.status(status).json(body);
  }
}
