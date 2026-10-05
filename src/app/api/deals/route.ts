import { NextResponse } from 'next/server';
import { INITIAL_DEALS } from '@/src/data/seedData';
import { db } from '@/src/services/dbStore';

export async function GET() {
  const deals = db.getDeals();
  return NextResponse.json({
    success: true,
    count: deals.length,
    data: deals,
  });
}
