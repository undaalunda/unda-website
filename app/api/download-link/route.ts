// /app/api/download-link/route.ts - อัปเดตแล้ว: 48ชม. + ไม่มี device fingerprint

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';
import fs from 'fs/promises';
import path from 'path';

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
  const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');

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
        expiresAt,
        hoursValid: (expiresInMinutes / 60)
      });
    }

    // สร้าง entry ใหม่
    const newEntry: DownloadEntry = {
      token,
      filePath,
      createdAt: new Date().toISOString(),
      expiresInMinutes,
      orderId,
      downloadStarted: false,
      downloadCompleted: false
    };

    // อ่านไฟล์ downloads.json หรือสร้างใหม่ถ้าไม่มี
    let entries: DownloadEntry[] = [];
    try {
      // สร้างโฟลเดอร์ data ถ้าไม่มี
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      
      const raw = await fs.readFile(DB_PATH, 'utf-8');
      entries = JSON.parse(raw);
    } catch (err) {
      // ถ้าไฟล์ไม่มี ให้สร้างใหม่
      console.log('Creating new downloads.json file');
      entries = [];
    }

    // เพิ่ม entry ใหม่
    entries.push(newEntry);

    // ลบ entries ที่หมดอายุหรือโหลดเสร็จแล้ว
    const now = new Date();
    const expiredEntries = entries.filter(entry => {
      // ถ้าดาวน์โหลดเสร็จแล้ว = ลบทิ้ง (cleanup)
      if (entry.downloadCompleted) return true;
      
      // ถ้ายังไม่ได้ดาวน์โหลด = เช็คเวลาปกติ
      const expiresAt = new Date(entry.createdAt);
      expiresAt.setMinutes(expiresAt.getMinutes() + entry.expiresInMinutes);
      return now >= expiresAt;
    });

    // Log stats ของ entries ที่จะลบ
    if (expiredEntries.length > 0) {
      console.log('📊 Cleaning up entries:');
      expiredEntries.forEach(entry => {
        const status = entry.downloadCompleted ? 'COMPLETED' : 'EXPIRED';
        console.log(`  - Token ${entry.token.substring(0, 8)}... [${status}]`);
        if (entry.completedAt) {
          console.log(`    Completed: ${entry.completedAt}`);
        }
      });
    }

    // กรอง entries ที่ยังใช้งานได้
    entries = entries.filter(entry => {
      // ถ้าดาวน์โหลดเสร็จแล้ว = ลบออก (cleanup)
      if (entry.downloadCompleted) return false;
      
      // ถ้ายังไม่ได้ดาวน์โหลด = เช็คเวลาปกติ
      const expiresAt = new Date(entry.createdAt);
      expiresAt.setMinutes(expiresAt.getMinutes() + entry.expiresInMinutes);
      return now < expiresAt;
    });

    // เขียนกลับไปยังไฟล์
    await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2));

    // 🧹 Cleanup expired tokens ใน Supabase (run in background)
    cleanupExpiredTokensInSupabase().catch(err => 
      console.error('Background cleanup failed:', err)
    );

    console.log('✅ Download token created:', token);
    console.log('📁 File path:', filePath);
    console.log('⏰ Expires in:', expiresInMinutes, 'minutes (', (expiresInMinutes / 60), 'hours )');
    console.log('📊 Total active tokens:', entries.length);

    return NextResponse.json({ 
      token,
      success: true,
      expiresInMinutes,
      expiresInHours: expiresInMinutes / 60,
      stats: {
        activeTokens: entries.length,
        cleanedExpired: expiredEntries.length
      }
    });

  } catch (error) {
    console.error('Error in download-link API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET method สำหรับดู stats
export async function GET() {
  const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');
  
  try {
    let entries: DownloadEntry[] = [];
    try {
      const raw = await fs.readFile(DB_PATH, 'utf-8');
      entries = JSON.parse(raw);
    } catch (err) {
      entries = [];
    }

    const now = new Date();
    const activeEntries = entries.filter(entry => {
      // ไม่นับที่โหลดเสร็จแล้ว
      if (entry.downloadCompleted) return false;
      
      const expiresAt = new Date(entry.createdAt);
      expiresAt.setMinutes(expiresAt.getMinutes() + entry.expiresInMinutes);
      return now < expiresAt;
    });

    const startedButNotCompleted = activeEntries.filter(entry => entry.downloadStarted && !entry.downloadCompleted);

    // 🆕 ดู stats จาก Supabase ด้วย
    let supabaseStats = null;
    try {
      const { data, error } = await supabase
        .from('Orders')
        .select('download_token, download_expires')
        .not('download_token', 'is', null);

      if (!error && data) {
        const activeSupabaseTokens = data.filter(order => 
          order.download_expires && new Date(order.download_expires) > now
        );
        
        supabaseStats = {
          totalOrdersWithTokens: data.length,
          activeOrdersWithTokens: activeSupabaseTokens.length
        };
      }
    } catch (err) {
      console.error('Failed to get Supabase stats:', err);
    }

    return NextResponse.json({
      stats: {
        activeTokens: activeEntries.length,
        startedDownloads: startedButNotCompleted.length,
        pendingDownloads: activeEntries.filter(entry => !entry.downloadStarted).length
      },
      supabaseStats,
      recentTokens: activeEntries.slice(-5).map(entry => ({
        token: entry.token.substring(0, 8) + '...',
        createdAt: entry.createdAt,
        downloadStarted: entry.downloadStarted || false,
        downloadCompleted: entry.downloadCompleted || false,
        startedAt: entry.startedAt,
        orderId: entry.orderId,
        hoursRemaining: entry.expiresInMinutes ? Math.max(0, 
          Math.round(((new Date(entry.createdAt).getTime() + entry.expiresInMinutes * 60000) - now.getTime()) / (1000 * 60 * 60) * 10) / 10
        ) : 0
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}