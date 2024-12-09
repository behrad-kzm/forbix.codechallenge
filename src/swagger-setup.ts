import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggers(app: INestApplication) {
  const userConfig = new DocumentBuilder()
    .setTitle('API Documents')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const userDocument = SwaggerModule.createDocument(app, userConfig);

  SwaggerModule.setup('docs', app, userDocument);
}
