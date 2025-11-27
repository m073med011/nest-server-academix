const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { AllExceptionsFilter } = require('../dist/common/filters/http-exception.filter');
const { TransformInterceptor } = require('../dist/common/interceptors/transform.interceptor');

let app;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Apply global filters and interceptors
    app.useGlobalFilters(new AllExceptionsFilter.AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor.TransformInterceptor());

    // Apply global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Enable versioning
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Enable CORS for all origins
    app.enableCors();

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await getApp();
    const instance = nestApp.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};
