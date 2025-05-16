// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const validPassword = process.env.ADMIN_PASSWORD || 'letmein';

  if (!authHeader.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encoded = authHeader.replace('Basic ', '');
  const decoded = Buffer.from(encoded, 'base64').toString();

  if (decoded !== validPassword) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase.from('Orders').select('*').order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}