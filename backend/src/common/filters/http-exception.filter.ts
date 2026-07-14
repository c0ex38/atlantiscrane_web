import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Sunucu hatası oluştu.';
    let code = 'INTERNAL_SERVER_ERROR';
    let errors: Record<string, string>[] = [];

    if (exception instanceof HttpException) {
      const resObj = exception.getResponse();
      if (typeof resObj === 'object' && resObj !== null) {
        const responseData = resObj as Record<string, unknown>;
        message = (responseData.message as string) || exception.message;
        code = (responseData.error as string) || exception.name;

        // Handle ValidationPipe errors
        if (Array.isArray(responseData.message)) {
          code = 'VALIDATION_ERROR';
          message = 'Gönderilen bilgiler geçerli değil.';
          errors = responseData.message.map((msg: unknown) => {
            const msgStr = String(msg);
            const field = msgStr.split(' ')[0] || 'field';
            return {
              field,
              message: msgStr,
            };
          });
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      console.error('Unhandled Exception:', exception);
      message = exception.message;
    } else {
      console.error('Unhandled Exception:', exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      code: code
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/EXCEPTION$/, ''),
      message,
      ...(errors.length > 0 ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
