import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { validationOptions, HttpExceptionFilter } from './utils';
import { setupSwaggers } from './swagger-setup';
import { ClusterService } from './cluster/cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  if (`${configService.get('app.nodeEnv')}` === 'production') {
    app.enableCors({
      origin: [configService.get('app.clientUrl')],
      methods: '*',
      allowedHeaders: '*',
    });
  }
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(validationOptions.default));
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  if (['development', 'local'].includes(configService.get('app.nodeEnv'))) {
    setupSwaggers(app);
  }
  await app.listen(configService.get('app.port'));
}
ClusterService.buildClusters(bootstrap);
