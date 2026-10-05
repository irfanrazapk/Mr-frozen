import { NextResponse } from 'next/server';
import { couponService } from '@/src/services/CouponService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({
        success: false,
        message: 'Invalid request: code and subtotal are required.',
      }, { status: 400 });
    }

    const result = couponService.validate(code, subtotal);
    return NextResponse.json({
      success: result.isValid,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || 'Server error during coupon validation.',
    }, { status: 500 });
  }
}
