import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Academix API')
    .setDescription('The Academix API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Write the OpenAPI spec to a file
  const fs = require('fs');
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
}
