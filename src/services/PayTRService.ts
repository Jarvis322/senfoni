import crypto from 'crypto';

interface PayTRTokenParams {
  userId: string;
  email: string;
  address: string;
  basketItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  currency: string;
  successUrl?: string;
  failUrl?: string;
  merchantOid?: string;
  userIp?: string;
  userAgent?: string;
  noInstallment?: number;
  userName?: string;
  userPhone?: string;
}

class PayTRService {
  private merchantId: string;
  private merchantKey: string;
  private merchantSalt: string;

  constructor() {
    this.merchantId = process.env.PAYTR_MERCHANT_ID || '';
    this.merchantKey = process.env.PAYTR_MERCHANT_KEY || '';
    this.merchantSalt = process.env.PAYTR_MERCHANT_SALT || '';

    if (!this.merchantId || !this.merchantKey || !this.merchantSalt) {
      throw new Error('PayTR credentials are missing');
    }
  }

  async createPaymentToken(params: PayTRTokenParams): Promise<string> {
    try {
      const merchantOid = params.merchantOid || `MO${Date.now()}`;
      const successUrl = params.successUrl || process.env.PAYTR_SUCCESS_URL || 'http://localhost:3000/payment/success';
      const failUrl = params.failUrl || process.env.PAYTR_FAIL_URL || 'http://localhost:3000/payment/fail';
      const userIp = params.userIp || '127.0.0.1';
      const userAgent = params.userAgent || 'Mozilla/5.0';
      const noInstallment = params.noInstallment || 0;

      // Sepet içeriğini hazırla
      const basket = params.basketItems.map(item => {
        return [item.name, item.price, item.quantity];
      });
      const basketStr = JSON.stringify(basket);

      // Hash string'i oluştur
      const hashStr = `${this.merchantId}${userIp}${merchantOid}${params.email}${params.totalAmount}${basketStr}${noInstallment}${params.currency}${successUrl}${failUrl}`;
      
      // Token oluştur
      const paytrToken = crypto
        .createHmac('sha256', this.merchantKey)
        .update(hashStr + this.merchantSalt)
        .digest('base64');

      // PayTR API parametreleri
      const requestParams = {
        merchant_id: this.merchantId,
        user_ip: userIp,
        merchant_oid: merchantOid,
        email: params.email,
        payment_amount: params.totalAmount,
        paytr_token: paytrToken,
        user_basket: basketStr,
        debug_on: process.env.NODE_ENV === 'development' ? 1 : 0,
        no_installment: noInstallment,
        max_installment: 0,
        user_name: params.userName || params.email.split('@')[0],
        user_address: params.address || 'Adres belirtilmedi',
        user_phone: params.userPhone || '05555555555',
        merchant_ok_url: successUrl,
        merchant_fail_url: failUrl,
        timeout_limit: 30,
        currency: params.currency,
        test_mode: process.env.NODE_ENV === 'development' ? 1 : 0,
        lang: 'tr'
      };

      // API isteği gönder
      const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestParams as any).toString()
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`PAYTR-${response.status}: ${error}`);
      }

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(`PAYTR-400: ${result.reason}`);
      }

      return result.token;

    } catch (error) {
      console.error('PayTR token creation error:', error);
      throw error;
    }
  }

  verifyPaymentCallback(params: any): boolean {
    try {
      const { merchant_oid, status, total_amount, hash } = params;
      
      const hashStr = `${this.merchantId}${merchant_oid}${total_amount}${status}${this.merchantSalt}`;
      const calculatedHash = crypto
        .createHmac('sha256', this.merchantKey)
        .update(hashStr)
        .digest('base64');

      return hash === calculatedHash;
    } catch (error) {
      console.error('PayTR callback verification error:', error);
      return false;
    }
  }
}

export default new PayTRService(); 