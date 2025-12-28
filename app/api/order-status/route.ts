// app/api/order-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const id = req.nextUrl.searchParams.get('id');

    console.log('🔍 Order status request:', { email, id });

    if (!email) {
      console.log('❌ Missing email parameter');
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    // ทดสอบ connection ก่อน
    console.log('🔌 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('Orders')
      .select('count', { count: 'exact' });
    
    console.log('🧪 Connection test:', { testData, testError });

    if (id) {
      // Single order lookup
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .eq('email', email)
        .eq('id', id)
        .single();
        
      console.log('🕵🏻 Single order response:', { data, error });

      if (error || !data) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json(
        { order: data },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    } else {
      // Multiple orders lookup
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });
        
      console.log('🕵🏻 Multiple orders response:', { count: data?.length, error });

      if (error) {
        console.error('❌ Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
      }

      console.log('✅ Orders found successfully:', data?.length || 0);
      return NextResponse.json(
        { orders: data || [] },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }
  } catch (err) {
    console.error('❌ API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}