import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from '../src/app.module';

async function exportOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  const config = new DocumentBuilder()
    .setTitle('PointDrop API')
    .setDescription(
      'Система лояльності PointDrop — нарахування, списання та P2P-перекази балів.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('health')
    .addTag('transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outPath = join(process.cwd(), 'openapi.json');
  writeFileSync(outPath, JSON.stringify(document, null, 2), 'utf-8');
  // eslint-disable-next-line no-console
  console.log(`OpenAPI spec written to: ${outPath}`);

  await app.close();
  process.exit(0);
}

exportOpenApi().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to export OpenAPI spec', err);
  process.exit(1);
});
