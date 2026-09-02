// /app/api/download-link/route.ts - ใช้ตาราง DownloadTokens แยกต่างหาก รองรับหลายไฟล์ต่อ 1 ออเดอร์

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';

// 🧹 ฟังก์ชัน cleanup expired tokens ในตาราง DownloadTokens
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('DownloadTokens')
      .delete()
      .lt('expires_at', now)
      .eq('is_used', false)
      .select('id');

    if (error) {
      console.error('❌ Error cleaning up expired tokens:', error);
    } else {
      console.log('🧹 Cleaned up expired tokens:', data?.length || 0, 'records');
    }
  } catch (err) {
    console.error('❌ Unexpected error during cleanup:', err);
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filePath, orderId, expiresInMinutes = 2880 } = body; // Default 48 ชั่วโมง

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  const token = uuidv4();

  try {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();

    // ✅ สร้างแถวใหม่ในตาราง DownloadTokens แทนการเขียนทับคอลัมน์เดียวใน Orders
    // แต่ละไฟล์ในออเดอร์เดียวกันจะได้แถว/token ของตัวเอง ไม่ทับกัน
    const { data, error } = await supabase
      .from('DownloadTokens')
      .insert({
        token,
        order_id: orderId,
        file_path: filePath,
        expires_at: expiresAt,
        is_used: false,
      })
      .select('id, token')
      .single();

    if (error) {
      console.error('❌ Error creating download token:', error);
      return NextResponse.json({ error: 'Failed to create download token' }, { status: 500 });
    }

    console.log('✅ Created download token:', {
      orderId,
      token: token.substring(0, 8) + '...',
      filePath,
      expiresAt,
      hoursValid: (expiresInMinutes / 60)
    });

    // 🧹 Cleanup expired tokens (run in background)
    cleanupExpiredTokens().catch(err =>
      console.error('Background cleanup failed:', err)
    );

    return NextResponse.json({
      token,
      success: true,
      expiresInMinutes,
      expiresInHours: expiresInMinutes / 60,
      message: 'Download token created successfully'
    });

  } catch (error) {
    console.error('Error in download-link API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET method สำหรับดู stats
export async function GET() {
  try {
    const now = new Date();

    const { data, error } = await supabase
      .from('DownloadTokens')
      .select('token, order_id, expires_at, is_used, file_path');

    if (error) {
      console.error('Failed to get stats:', error);
      return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
    }

    const activeTokens = data.filter(t =>
      t.expires_at && new Date(t.expires_at) > now && !t.is_used
    );
    const usedTokens = data.filter(t => t.is_used);
    const expiredTokens = data.filter(t =>
      t.expires_at && new Date(t.expires_at) <= now && !t.is_used
    );

    return NextResponse.json({
      stats: {
        totalTokens: data.length,
        activeTokens: activeTokens.length,
        usedTokens: usedTokens.length,
        expiredTokens: expiredTokens.length
      },
      recentTokens: activeTokens.slice(-5).map(t => ({
        token: t.token.substring(0, 8) + '...',
        filePath: t.file_path,
        isUsed: t.is_used,
        hoursRemaining: t.expires_at ? Math.max(0,
          Math.round(((new Date(t.expires_at).getTime()) - now.getTime()) / (1000 * 60 * 60) * 10) / 10
        ) : 0
      }))
    });
  } catch (error) {
    console.error('Error in stats API:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}