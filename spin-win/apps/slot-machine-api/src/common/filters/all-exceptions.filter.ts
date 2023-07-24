import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || null;

    if (typeof message === 'object' && message !== null) {
      response
        .status(status)
        .send({
          ...message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    } else {
      response
        .status(status)
        .send({
          errorMessage: message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
