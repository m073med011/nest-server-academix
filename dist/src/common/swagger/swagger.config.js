"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Shadboard API')
        .setDescription('The Shadboard API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const fs = require('fs');
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
}
//# sourceMappingURL=swagger.config.js.map