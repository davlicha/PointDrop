import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('port', 3000);
  const corsOrigin = config.get<string>(
    'corsOrigin',
    'http://localhost:5173',
  );
  const swaggerPath = config.get<string>('swaggerPath', 'api/docs');
  const nodeEnv = config.get<string>('nodeEnv', 'development');

  app.enableCors({ origin: corsOrigin, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PointDrop API')
    .setDescription(
      'Система лояльності PointDrop — нарахування, списання та P2P-перекази балів.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('health', 'Liveness + DB connectivity')
    .addTag('transactions', 'EARN / REDEEM / TRANSFER операції')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  if (nodeEnv !== 'production') {
    const specPath = join(process.cwd(), 'openapi.json');
    writeFileSync(specPath, JSON.stringify(document, null, 2), 'utf-8');
    logger.log(`OpenAPI spec exported to ${specPath}`);
  }

  await app.listen(port);

  logger.log(`PointDrop API listening on http://localhost:${port}`);
  logger.log(`Swagger UI available at http://localhost:${port}/${swaggerPath}`);
  logger.log(`OpenAPI JSON at    http://localhost:${port}/${swaggerPath}-json`);
}

bootstrap().catch((err: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to bootstrap the app', err as Error);
  process.exit(1);
});
