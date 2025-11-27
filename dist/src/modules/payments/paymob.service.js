"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymobService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PaymobService = PaymobService_1 = class PaymobService {
    configService;
    apiKey;
    cardIntegrationId;
    baseUrl;
    logger = new common_1.Logger(PaymobService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('paymob.apiKey') || '';
        this.cardIntegrationId =
            this.configService.get('paymob.cardIntegrationId') || '5017355';
        this.baseUrl = 'https://accept.paymobsolutions.com/api';
    }
    async authenticate() {
        const response = await fetch(`${this.baseUrl}/auth/tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: this.apiKey,
            }),
        });
        if (!response.ok) {
            throw new Error(`Paymob authentication failed: ${response.statusText}`);
        }
        const data = (await response.json());
        return data.token;
    }
    async createOrder(authToken, amountCents, merchantOrderId) {
        const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                auth_token: authToken,
                delivery_needed: false,
                amount_cents: amountCents,
                currency: 'EGP',
                merchant_order_id: merchantOrderId,
                items: [],
            }),
        });
        if (!response.ok) {
            throw new Error(`Paymob order creation failed: ${response.statusText}`);
        }
        return (await response.json());
    }
    async createPaymentKey(authToken, orderId, amountCents, billingData, paymentMethod, paymentId) {
        const integrationId = this.cardIntegrationId;
        this.logger.log(`Creating payment key with integration ID: ${integrationId} for payment method: card`);
        const frontendUrl = this.configService.get('app.frontendUrl') ||
            'http://localhost:3000';
        const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                auth_token: authToken,
                amount_cents: amountCents,
                expiration: 3600,
                order_id: orderId,
                billing_data: {
                    apartment: billingData.apartment || 'NA',
                    email: billingData.email,
                    floor: billingData.floor || 'NA',
                    first_name: billingData.firstName,
                    street: billingData.street || 'NA',
                    building: billingData.building || 'NA',
                    phone_number: billingData.phoneNumber,
                    shipping_method: billingData.shippingMethod || 'PKG',
                    postal_code: billingData.postalCode || 'NA',
                    city: billingData.city || 'NA',
                    country: billingData.country || 'EG',
                    last_name: billingData.lastName,
                    state: billingData.state || 'NA',
                },
                currency: 'EGP',
                integration_id: integrationId,
                callback_url: `${frontendUrl}/payment/callback?paymentId=${paymentId}&status=success`,
                redirection_url: `${frontendUrl}/payment/callback?paymentId=${paymentId}&status=success`,
            }),
        });
        if (!response.ok) {
            throw new Error(`Paymob payment key creation failed: ${response.statusText}`);
        }
        const data = (await response.json());
        return data.token;
    }
    async processPayment(request, paymentId) {
        try {
            this.logger.log(`Processing payment with method: ${request.paymentMethod}`);
            const authToken = await this.authenticate();
            const amountCents = Math.round(request.amount * 100);
            const order = await this.createOrder(authToken, amountCents, request.merchantOrderId);
            const paymentToken = await this.createPaymentKey(authToken, order.id, amountCents, request.billingData, request.paymentMethod, paymentId);
            const cardIframeId = this.configService.get('paymob.cardIframeId') || '872089';
            const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${cardIframeId}?payment_token=${paymentToken}`;
            this.logger.log(`Generated iframe URL: ${iframeUrl}`);
            return {
                paymentToken,
                orderId: order.id,
                iframeUrl,
            };
        }
        catch (error) {
            this.logger.error('Paymob payment processing error:', error);
            throw error;
        }
    }
    verifyWebhookSignature(data, signature) {
        const crypto = require('crypto');
        const hmacSecret = this.configService.get('paymob.hmacSecret') || '';
        if (!hmacSecret) {
            this.logger.warn('PAYMOB_HMAC_SECRET not set, skipping signature verification');
            return true;
        }
        if (!signature) {
            this.logger.warn('No signature provided in webhook');
            return false;
        }
        try {
            const sortedKeys = Object.keys(data).sort();
            const concatenatedString = sortedKeys
                .map((key) => {
                const value = data[key];
                return typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value);
            })
                .join('');
            const expectedSignature = crypto
                .createHmac('sha512', hmacSecret)
                .update(concatenatedString)
                .digest('hex');
            return expectedSignature === signature;
        }
        catch (error) {
            this.logger.error('Error verifying webhook signature:', error);
            return false;
        }
    }
};
exports.PaymobService = PaymobService;
exports.PaymobService = PaymobService = PaymobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymobService);
//# sourceMappingURL=paymob.service.js.map