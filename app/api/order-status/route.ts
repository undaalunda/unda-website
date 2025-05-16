// app/api/order-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const id = req.nextUrl.searchParams.get('id');

  if (!email || !id) {
    return NextResponse.json({ error: 'Missing email or order ID' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('Orders')
      .select('*')
      .eq('email', email)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error('❌ Failed to fetch order status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
