// /app/api/mark-downloaded/route.ts - แก้ใช้ Supabase แทน file system

import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { token, orderId } = await req.json();
        
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    console.log('🔒 Marking download as used:', { token: token.substring(0, 8) + '...', orderId });

    // อัพเดท Supabase - mark as used
    const { data, error } = await supabase
      .from('Orders')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('download_token', token)
      .select('id, is_used, used_at, file_path')
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
      orderId: data.id,
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