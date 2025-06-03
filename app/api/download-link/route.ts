// /app/api/download-link/route.ts

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
  deviceFingerprint?: string;
  userAgent?: string;
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
  const { filePath, orderId, expiresInMinutes = 60 } = body;

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
        expiresAt
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

    // ลบ entries ที่หมดอายุแล้ว (เฉพาะที่ไม่ได้ดาวน์โหลด)
    const now = new Date();
    const expiredCount = entries.filter(entry => {
      // ถ้าดาวน์โหลดเสร็จแล้ว = ไม่หมดอายุ แต่ลบออกเพื่อ cleanup
      if (entry.downloadCompleted) return true;
      
      // ถ้ายังไม่ได้ดาวน์โหลด = เช็คเวลาปกติ
      const expiresAt = new Date(entry.createdAt);
      expiresAt.setMinutes(expiresAt.getMinutes() + entry.expiresInMinutes);
      return now >= expiresAt;
    }).length;

    // กรอง entries ที่ยังไม่หมดอายุ
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
    console.log('⏰ Expires in:', expiresInMinutes, 'minutes');
    console.log('📊 Total active tokens:', entries.length);

    return NextResponse.json({ 
      token,
      success: true,
      expiresInMinutes,
      stats: {
        activeTokens: entries.length,
        cleanedExpired: expiredCount
      }
    });

  } catch (error) {
    console.error('Error in download-link API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}