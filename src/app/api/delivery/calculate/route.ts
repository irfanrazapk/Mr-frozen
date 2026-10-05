import { NextResponse } from 'next/server';
import { deliveryService } from '@/src/services/DeliveryService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, subtotal } = body;

    const result = deliveryService.calculate({
      city: city || 'Karachi',
      subtotal: Number(subtotal) || 0,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || 'Server error calculating delivery charges.',
    }, { status: 500 });
  }
}
