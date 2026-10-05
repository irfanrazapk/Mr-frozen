import { db } from './dbStore';
import { Coupon } from '../types';

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  discountAmount: number;
  coupon?: Coupon;
}

class CouponService {
  validate(code: string, subtotal: number): CouponValidationResult {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { isValid: false, message: 'Please enter a coupon code.', discountAmount: 0 };
    }

    const coupons = db.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === trimmed);

    if (!coupon) {
      return { isValid: false, message: `Coupon "${trimmed}" is not recognized. Try "FROZENFRESH10".`, discountAmount: 0 };
    }

    if (!coupon.isActive) {
      return { isValid: false, message: `Coupon "${trimmed}" is no longer active.`, discountAmount: 0 };
    }

    const now = new Date().toISOString();
    if (coupon.expiryDate && coupon.expiryDate < now.split('T')[0]) {
      return { isValid: false, message: `Coupon "${trimmed}" has expired.`, discountAmount: 0 };
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { isValid: false, message: `Coupon "${trimmed}" has reached maximum usage limit.`, discountAmount: 0 };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        isValid: false,
        message: `Coupon "${trimmed}" requires a minimum order of PKR ${coupon.minOrderAmount.toLocaleString()}. Current total: PKR ${subtotal.toLocaleString()}.`,
        discountAmount: 0,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'fixed') {
      discount = Math.min(subtotal, coupon.discountValue);
    } else if (coupon.discountType === 'free_shipping') {
      discount = 0; // handled via zero delivery fee
    }

    return {
      isValid: true,
      message: `Coupon "${trimmed}" applied successfully! You saved PKR ${discount.toLocaleString()}.`,
      discountAmount: discount,
      coupon,
    };
  }

  recordUsage(code: string): void {
    const coupons = db.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      found.timesUsed += 1;
      db.saveCoupons(coupons);
    }
  }
}

export const couponService = new CouponService();
