import crypto from 'crypto';

interface PayTROptions {
  merchant_id: string;
  merchant_key: string;
  merchant_salt: string;
  email: string;
  payment_amount: number;
  merchant_oid: string;
  user_name: string;
  user_address: string;
  user_phone: string;
  merchant_ok_url: string;
  merchant_fail_url: string;
  user_basket: string;
  debug_on?: string;
  test_mode?: string;
  no_installment?: string;
  max_installment?: string;
  user_ip: string;
  currency?: string;
  lang?: string;
}

interface PayTRCallbackData {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
}

export class PayTRService {
  private merchant_id: string;
  private merchant_key: string;
  private merchant_salt: string;

  constructor() {
    this.merchant_id = process.env.PAYTR_MERCHANT_ID || '';
    this.merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
    this.merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';

    if (!this.merchant_id || !this.merchant_key || !this.merchant_salt) {
      throw new Error('PayTR credentials are not configured');
    }
  }

  private generateHash(options: PayTROptions): string {
    const hashStr = `${options.merchant_id}${options.user_ip}${options.merchant_oid}${options.email}${options.payment_amount}${options.user_basket}${options.no_installment}${options.max_installment}${options.currency}${options.test_mode}${this.merchant_salt}`;
    return crypto.createHash('sha256').update(hashStr).digest('base64');
  }

  private generateToken(options: PayTROptions): string {
    const hashStr = `${options.merchant_id}${options.user_ip}${options.merchant_oid}${options.email}${options.payment_amount}${options.user_basket}${options.no_installment}${options.max_installment}${options.currency}${options.test_mode}${this.merchant_salt}`;
    return crypto.createHash('sha256').update(hashStr).digest('base64');
  }

  public verifyHash(data: PayTRCallbackData): boolean {
    const hashStr = `${data.merchant_oid}${this.merchant_salt}${data.status}${data.total_amount}`;
    const hash = crypto.createHash('sha256').update(hashStr).digest('base64');
    return hash === data.hash;
  }

  public async createPaymentForm(options: PayTROptions): Promise<string> {
    const token = this.generateToken(options);

    const formData = new URLSearchParams();
    formData.append('merchant_id', this.merchant_id);
    formData.append('user_ip', options.user_ip);
    formData.append('merchant_oid', options.merchant_oid);
    formData.append('email', options.email);
    formData.append('payment_amount', options.payment_amount.toString());
    formData.append('paytr_token', token);
    formData.append('user_basket', options.user_basket);
    formData.append('debug_on', options.debug_on || '0');
    formData.append('no_installment', options.no_installment || '0');
    formData.append('max_installment', options.max_installment || '0');
    formData.append('user_name', options.user_name);
    formData.append('user_address', options.user_address);
    formData.append('user_phone', options.user_phone);
    formData.append('merchant_ok_url', options.merchant_ok_url);
    formData.append('merchant_fail_url', options.merchant_fail_url);
    formData.append('currency', options.currency || 'TL');
    formData.append('test_mode', options.test_mode || '0');
    formData.append('lang', options.lang || 'tr');

    try {
      const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('PayTR API error');
      }

      const result = await response.json();

      if (result.status === 'success') {
        return result.token;
      } else {
        throw new Error(result.reason);
      }
    } catch (error) {
      console.error('PayTR payment form creation error:', error);
      throw error;
    }
  }
} 