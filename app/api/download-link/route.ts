// /app/api/download-link/route.ts - แก้แล้ว (ลบ File System ออก)

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';

// 🧹 ฟังก์ชัน cleanup expired tokens ใน Supabase
const cleanupExpiredTokensInSupabase = async () => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('Orders')
      .update({ 
        download_token: null, 
        download_expires: null 
      })
      .lt('download_expires', now)
      .not('download_token', 'is', null)
      .select('id');

    if (error) {
      console.error('❌ Error cleaning up expired tokens in Supabase:', error);
    } else {
      console.log('🧹 Cleaned up expired tokens in Supabase:', data?.length || 0, 'records');
    }
  } catch (err) {
    console.error('❌ Unexpected error during Supabase cleanup:', err);
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filePath, orderId, expiresInMinutes = 60 } = body;

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  const token = uuidv4();

  try {
    // ถ้ามี orderId ให้อัพเดท download_token และ download_expires ในตาราง Orders
    if (orderId) {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('Orders')
        .update({ 
          download_token: token,
          download_expires: expiresAt
        })
        .eq('id', orderId)
        .select('id, email, download_expires')
        .single();

      if (error) {
        console.error('Error updating download token:', error);
        return NextResponse.json({ error: 'Failed to update download token' }, { status: 500 });
      }

      console.log('✅ Updated Supabase with token and expires:', {
        orderId,
        token: token.substring(0, 8) + '...',
        expiresAt
      });
    }

    // 🧹 Cleanup expired tokens ใน Supabase (run in background)
    cleanupExpiredTokensInSupabase().catch(err => 
      console.error('Background cleanup failed:', err)
    );

    console.log('✅ Download token created:', token);
    console.log('📁 File path:', filePath);
    console.log('⏰ Expires in:', expiresInMinutes, 'minutes');

    return NextResponse.json({ 
      token,
      success: true,
      expiresInMinutes
    });

  } catch (error) {
    console.error('Error in download-link API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}