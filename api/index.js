const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { AllExceptionsFilter } = require('../dist/common/filters/http-exception.filter');
const { TransformInterceptor } = require('../dist/common/interceptors/transform.interceptor');

let app;

async function getApp() {
  if (!app) {
    try {
      console.log('Starting NestJS app initialization...');
      console.log('Environment Check:');
      console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Missing');
      console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
      console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'Set' : 'Missing');

      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      });

      // Apply global filters and interceptors
      app.useGlobalFilters(new AllExceptionsFilter());
      app.useGlobalInterceptors(new TransformInterceptor());

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
      console.log('NestJS app initialized successfully');
    } catch (error) {
      console.error('CRITICAL ERROR: NestJS app failed to initialize');
      console.error(error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await getApp();
    const instance = nestApp.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    console.error('Serverless function invocation failed:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      details: 'Check Vercel Runtime Logs for "CRITICAL ERROR"'
    });
  }
};
