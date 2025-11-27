import * as Joi from 'joi';
declare const _default: (() => {
    env: string | undefined;
    port: number;
    database: {
        uri: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string;
        refreshSecret: string | undefined;
        refreshExpiresIn: string;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    paymob: {
        apiKey: string | undefined;
        cardIntegrationId: string | undefined;
        walletIntegrationId: string | undefined;
        cardIframeId: string | undefined;
        walletIframeId: string | undefined;
        hmacSecret: string | undefined;
    };
    cloudinary: {
        cloudName: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    brevo: {
        apiKey: string | undefined;
        senderEmail: string | undefined;
        senderName: string | undefined;
    };
    otp: {
        expirationMinutes: number;
        maxAttempts: number;
    };
    cors: {
        origin: string | undefined;
    };
    frontendUrl: string | undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    env: string | undefined;
    port: number;
    database: {
        uri: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string;
        refreshSecret: string | undefined;
        refreshExpiresIn: string;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    paymob: {
        apiKey: string | undefined;
        cardIntegrationId: string | undefined;
        walletIntegrationId: string | undefined;
        cardIframeId: string | undefined;
        walletIframeId: string | undefined;
        hmacSecret: string | undefined;
    };
    cloudinary: {
        cloudName: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    brevo: {
        apiKey: string | undefined;
        senderEmail: string | undefined;
        senderName: string | undefined;
    };
    otp: {
        expirationMinutes: number;
        maxAttempts: number;
    };
    cors: {
        origin: string | undefined;
    };
    frontendUrl: string | undefined;
}>;
export default _default;
export declare const validationSchema: Joi.ObjectSchema<any>;
