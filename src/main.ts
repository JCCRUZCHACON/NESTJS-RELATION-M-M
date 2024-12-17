import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Usar el filtro global para errores de Prisma
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  // Rutas de la Url
  app.setGlobalPrefix('api/v1')
  
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
