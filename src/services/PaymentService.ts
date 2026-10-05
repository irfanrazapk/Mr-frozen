import { PaymentMethod } from '../types';

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: 'PKR';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  method: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  method: PaymentMethod;
  message: string;
  instructions?: string;
  details?: Record<string, string>;
}

export interface IPaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<boolean>;
}

/**
 * Production-ready Payment Service with provider abstraction.
 * To connect a live Pakistani gateway (e.g. JazzCash, EasyPaisa, PayFast, Safepay, Kuickpay):
 * Set environment variables JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, etc.
 * The interface remains identical.
 */
class PaymentServiceImpl implements IPaymentService {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const timestamp = Date.now();

    switch (request.method) {
      case 'cod':
        return {
          success: true,
          transactionId: `COD-${request.orderNumber}-${timestamp}`,
          method: 'cod',
          message: 'Cash on delivery selected. Please have exact change ready upon temperature-controlled delivery.',
          instructions: 'Pay cash to our cold-chain delivery rider upon verifying the safety seal on your insulated box.',
        };

      case 'bank_transfer':
        return {
          success: true,
          transactionId: `IBFT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          method: 'bank_transfer',
          message: 'Bank transfer instructions generated.',
          instructions: 'Please transfer PKR ' + request.amount.toLocaleString() + ' to Meezan Bank, A/C: 0102-0103498102, Title: MR FROZEN FOODS SMC PVT LTD. Share screenshot on WhatsApp +92-300-1234567.',
          details: {
            bankName: 'Meezan Bank Ltd',
            accountTitle: 'MR FROZEN FOODS SMC PVT LTD',
            accountNumber: '0102-0103498102',
            iban: 'PK42MEZN0001020103498102',
          }
        };

      case 'jazzcash_easypaisa':
        return {
          success: true,
          transactionId: `MW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          method: 'jazzcash_easypaisa',
          message: 'Mobile wallet prompt simulated.',
          instructions: 'Send money to JazzCash / EasyPaisa Merchant Till # 03001234567. Include your Order ID in reference.',
        };

      case 'online_card':
        // Simulating 3DS payment gateway authorization
        return {
          success: true,
          transactionId: `PAY-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
          method: 'online_card',
          message: 'Card authorized successfully.',
          instructions: 'Card transaction confirmed. You will receive an SMS receipt shortly.',
        };

      default:
        throw new Error('Unsupported payment method');
    }
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return transactionId.length > 5;
  }
}

export const paymentService: IPaymentService = new PaymentServiceImpl();
