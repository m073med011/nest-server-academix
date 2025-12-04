import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod, BillingData } from './schemas/payment.schema';

export interface PaymobAuthResponse {
  token: string;
}

export interface PaymobOrderResponse {
  id: number;
  created_at: string;
  delivery_needed: boolean;
  merchant: {
    id: number;
    created_at: string;
    phones: string[];
    company_emails: string[];
    company_name: string;
    state: string;
    country: string;
    city: string;
    postal_code: string;
    street: string;
  };
  collector: any;
  amount_cents: number;
  shipping_data: any;
  currency: string;
  is_payment_locked: boolean;
  is_return: boolean;
  is_cancel: boolean;
  is_returned: boolean;
  is_canceled: boolean;
  merchant_order_id: string;
  wallet_notification: any;
  paid_amount_cents: number;
  notify_user_with_email: boolean;
  items: any[];
  order_url: string;
  commission_fees: number;
  delivery_fees_cents: number;
  delivery_vat_cents: number;
  payment_method: string;
  merchant_staff_tag: any;
  api_source: string;
  data: any;
}

export interface PaymobPaymentKeyResponse {
  token: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  merchantOrderId: string;
  billingData: BillingData;
  paymentMethod: PaymentMethod;
}

@Injectable()
export class PaymobService {
  private apiKey: string;
  private cardIntegrationId: string;
  private baseUrl: string;
  private readonly logger = new Logger(PaymobService.name);

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.paymob.apiKey') || '';
    this.cardIntegrationId =
      this.configService.get<string>('app.paymob.cardIntegrationId') || '5017355';
    this.baseUrl = 'https://accept.paymobsolutions.com/api';

    // Log configuration status (without exposing sensitive data)
    this.logger.log(`Paymob API Key configured: ${!!this.apiKey}`);
    this.logger.log(`Card Integration ID: ${this.cardIntegrationId}`);
  }

  async authenticate(): Promise<string> {
    if (!this.apiKey) {
      this.logger.error('Paymob API Key is not configured');
      throw new Error('Paymob API Key is missing. Please check your environment configuration.');
    }

    this.logger.log('Attempting Paymob authentication...');

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
      const errorText = await response.text();
      this.logger.error(`Paymob authentication failed: ${response.status} ${response.statusText}`);
      this.logger.error(`Error details: ${errorText}`);
      throw new Error(`Paymob authentication failed: ${response.statusText}`);
    }

    const data = (await response.json()) as PaymobAuthResponse;
    this.logger.log('Paymob authentication successful');
    return data.token;
  }

  async createOrder(
    authToken: string,
    amountCents: number,
    merchantOrderId: string,
  ): Promise<PaymobOrderResponse> {
    this.logger.log(`Creating order: ${merchantOrderId}, amount: ${amountCents}`);

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
      const errorText = await response.text();
      this.logger.error(`Paymob order creation failed: ${response.status} ${response.statusText}`);
      this.logger.error(`Error details: ${errorText}`);
      throw new Error(`Paymob order creation failed: ${response.statusText}`);
    }

    const data = (await response.json()) as PaymobOrderResponse;
    this.logger.log(`Order created successfully: ${data.id}`);
    return data;
  }

  async createPaymentKey(
    authToken: string,
    orderId: number,
    amountCents: number,
    billingData: BillingData,
    paymentMethod: PaymentMethod,
    paymentId: string,
  ): Promise<string> {
    const integrationId = this.cardIntegrationId;

    this.logger.log(
      `Creating payment key with integration ID: ${integrationId} for payment method: card`,
    );

    const frontendUrl =
      this.configService.get<string>('app.frontendUrl') ||
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
        // Add callback URLs
        callback_url: `${frontendUrl}/payment/callback?paymentId=${paymentId}&status=success`,
        redirection_url: `${frontendUrl}/payment/callback?paymentId=${paymentId}&status=success`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Paymob payment key creation failed: ${response.status} ${response.statusText}`);
      this.logger.error(`Error details: ${errorText}`);
      throw new Error(
        `Paymob payment key creation failed: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as PaymobPaymentKeyResponse;
    this.logger.log('Payment key created successfully');
    return data.token;
  }

  async processPayment(
    request: CreatePaymentRequest,
    paymentId: string,
  ): Promise<{
    paymentToken: string;
    orderId: number;
    iframeUrl: string;
  }> {
    try {
      this.logger.log(
        `Processing payment with method: ${request.paymentMethod}`,
      );

      const authToken = await this.authenticate();

      const amountCents = Math.round(request.amount * 100);

      const order = await this.createOrder(
        authToken,
        amountCents,
        request.merchantOrderId,
      );

      const paymentToken = await this.createPaymentKey(
        authToken,
        order.id,
        amountCents,
        request.billingData,
        request.paymentMethod,
        paymentId,
      );

      // Use test iframe ID for development
      const cardIframeId =
        this.configService.get<string>('app.paymob.cardIframeId') || '872089';

      const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${cardIframeId}?payment_token=${paymentToken}`;

      this.logger.log(`Using iframe ID: ${cardIframeId}`);
      this.logger.log(`Generated iframe URL: ${iframeUrl}`);

      return {
        paymentToken,
        orderId: order.id,
        iframeUrl,
      };
    } catch (error) {
      this.logger.error('Paymob payment processing error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(data: any, signature: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');
    const hmacSecret =
      this.configService.get<string>('paymob.hmacSecret') || '';

    if (!hmacSecret) {
      this.logger.warn(
        'PAYMOB_HMAC_SECRET not set, skipping signature verification',
      );
      return true; // Skip verification if secret not set
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
    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}
