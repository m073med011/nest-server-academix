"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const config_1 = require("@nestjs/config");
const Joi = require("joi");
exports.default = (0, config_1.registerAs)('app', () => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        uri: process.env.MONGODB_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE || '1d',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    paymob: {
        apiKey: process.env.PAYMOB_API_KEY,
        cardIntegrationId: process.env.PAYMOB_CARD_INTEGRATION_ID,
        walletIntegrationId: process.env.PAYMOB_WALLET_INTEGRATION_ID,
        cardIframeId: process.env.PAYMOB_CARD_IFRAME_ID,
        walletIframeId: process.env.PAYMOB_WALLET_IFRAME_ID,
        hmacSecret: process.env.PAYMOB_HMAC_SECRET,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    brevo: {
        apiKey: process.env.BREVO_API_KEY,
        senderEmail: process.env.BREVO_SENDER_EMAIL,
        senderName: process.env.BREVO_SENDER_NAME,
    },
    otp: {
        expirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || '10', 10),
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
    },
    security: {
        cookieSecure: process.env.NODE_ENV === 'production',
        cookieSameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        cookieDomain: process.env.COOKIE_DOMAIN,
    },
    cors: {
        origin: process.env.CORS_ORIGIN,
    },
    frontendUrl: process.env.FRONTEND_URL,
}));
exports.validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRE: Joi.string().default('1d'),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRE: Joi.string().default('7d'),
    GOOGLE_CLIENT_ID: Joi.string().optional(),
    GOOGLE_CLIENT_SECRET: Joi.string().optional(),
    GOOGLE_CALLBACK_URL: Joi.string().optional(),
    PAYMOB_API_KEY: Joi.string().optional(),
    PAYMOB_HMAC_SECRET: Joi.string().optional(),
    CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
    CLOUDINARY_API_KEY: Joi.string().optional(),
    CLOUDINARY_API_SECRET: Joi.string().optional(),
    BREVO_API_KEY: Joi.string().optional(),
    BREVO_SENDER_EMAIL: Joi.string().optional(),
    FRONTEND_URL: Joi.string().optional(),
});
//# sourceMappingURL=configuration.js.map