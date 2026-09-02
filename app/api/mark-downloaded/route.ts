// /app/api/mark-downloaded/route.ts - ใช้ตาราง DownloadTokens แยกต่างหาก

import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { token, orderId } = await req.json();
        
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    console.log('🔒 Marking download as used:', { token: token.substring(0, 8) + '...', orderId });

    // ✅ อัพเดทในตาราง DownloadTokens แทน Orders
    const { data, error } = await supabase
      .from('DownloadTokens')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('token', token)
      .select('id, order_id, is_used, used_at, file_path')
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ error: 'Failed to mark download as used' }, { status: 500 });
    }

    if (!data) {
      console.error('❌ Token not found:', token);
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    console.log('✅ Download marked as used successfully:', {
      orderId: data.order_id,
      usedAt: data.used_at,
      filePath: data.file_path?.split('/').pop()
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Download marked as used',
      usedAt: data.used_at
    });

  } catch (error) {
    console.error('🔥 Error marking download as used:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}