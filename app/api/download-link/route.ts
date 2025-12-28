// /app/api/download-link/route.ts - แก้ EROFS: ใช้ Supabase อย่างเดียว

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';

interface DownloadEntry {
  token: string;
  filePath: string;
  createdAt: string;
  expiresInMinutes: number;
  orderId?: string;
  downloadStarted?: boolean;
  downloadCompleted?: boolean;
  startedAt?: string;
  completedAt?: string;
}

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
  const { filePath, orderId, expiresInMinutes = 2880 } = body; // 🆕 Default 48 ชั่วโมง

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  const token = uuidv4();

  try {
    // ถ้ามี orderId ให้อัพเดท download_token, download_expires, file_path, is_used ในตาราง Orders
    if (orderId) {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('Orders')
        .update({ 
          download_token: token,
          download_expires: expiresAt,
          file_path: filePath,
          is_used: false
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
        expiresAt,
        hoursValid: (expiresInMinutes / 60)
      });

      // 🧹 Cleanup expired tokens ใน Supabase (run in background)
      cleanupExpiredTokensInSupabase().catch(err => 
        console.error('Background cleanup failed:', err)
      );

      console.log('✅ Download token created:', token);
      console.log('📁 File path:', filePath);
      console.log('⏰ Expires in:', expiresInMinutes, 'minutes (', (expiresInMinutes / 60), 'hours )');

      return NextResponse.json({ 
        token,
        success: true,
        expiresInMinutes,
        expiresInHours: expiresInMinutes / 60,
        message: 'Download token created successfully'
      });
    } else {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in download-link API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET method สำหรับดู stats
export async function GET() {
  try {
    const now = new Date();
    
    // 🆕 ดู stats จาก Supabase
    const { data, error } = await supabase
      .from('Orders')
      .select('download_token, download_expires, is_used, file_path')
      .not('download_token', 'is', null);

    if (error) {
      console.error('Failed to get Supabase stats:', error);
      return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
    }

    const activeTokens = data.filter(order => 
      order.download_expires && new Date(order.download_expires) > now && !order.is_used
    );

    const usedTokens = data.filter(order => order.is_used);
    const expiredTokens = data.filter(order => 
      order.download_expires && new Date(order.download_expires) <= now && !order.is_used
    );

    return NextResponse.json({
      stats: {
        totalOrdersWithTokens: data.length,
        activeTokens: activeTokens.length,
        usedTokens: usedTokens.length,
        expiredTokens: expiredTokens.length
      },
      recentTokens: activeTokens.slice(-5).map(order => ({
        token: order.download_token.substring(0, 8) + '...',
        filePath: order.file_path,
        isUsed: order.is_used,
        hoursRemaining: order.download_expires ? Math.max(0, 
          Math.round(((new Date(order.download_expires).getTime()) - now.getTime()) / (1000 * 60 * 60) * 10) / 10
        ) : 0
      }))
    });
  } catch (error) {
    console.error('Error in stats API:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}