import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejar error de "record not found"
      if (exception.code === 'P2025') {
        response.status(404).json({
          statusCode: 404,
          // timestamp: new Date().toISOString(),
          // path: request.url,
          message: 'Request does not exist or was not found.',
          error: 'resource not found',
        });
        return;
      }

      // Otros errores conocidos de Prisma
      response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        error: 'Error de base de datos',
      });
      return;
    }

    // Manejar errores HTTP estándar
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(typeof errorResponse === 'string'
          ? { message: errorResponse }
          : errorResponse),
      });
      return;
    }

    // Errores genéricos no manejados
    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Error interno del servidor',
      error: 'Error no manejado',
    });
  }
}
