// Vercel serverless function handler
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  const app = await getApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
