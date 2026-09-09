// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader.startsWith('Basic ')) {
    console.log('❌ No auth header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encoded = authHeader.replace('Basic ', '');
  const decoded = Buffer.from(encoded, 'base64').toString(); // ex: admin:Alunda1999.
  const [username, password] = decoded.split(':');

  console.log('🔍 Decoded auth:', { username, password });
  console.log('🔐 Expected password:', validPassword);

  if (password !== validPassword) {
    console.log('❌ Invalid password. Access denied.');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  console.log('✅ Password correct. Fetching orders...');

  const result = await supabase
    .from('Orders') // ถ้า Table ใช้ชื่อว่า Orders จริง ก็โอเค แต่ถ้าเป็น lowercase ล้วนต้องเปลี่ยนเป็น 'orders'
    .select(`
      id,
      email,
      amount,
      currency,
      items,
      payment_status,
      created_at,
      tracking_number,
      courier,
      shipping_zone,
      shipping_method,
      billing_info,
      shipping_info
    `)
    .order('created_at', { ascending: false });

  const { data, error } = result;

  if (error) {
    console.error('🔥 Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`✅ Orders found: ${data?.length} records`);
  return NextResponse.json({ orders: data });
}