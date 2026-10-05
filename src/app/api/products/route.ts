import { NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/src/data/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let products = [...INITIAL_PRODUCTS];

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: products.length,
    data: products,
  });
}
