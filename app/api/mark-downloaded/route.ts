// app/api/mark-downloaded/route.ts - อัปเดตแล้ว: ลบ device fingerprint + 48ชม.

import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');

    // 📝 อัพเดท downloads.json
    try {
      const raw = await fs.readFile(DB_PATH, 'utf-8');
      const entries: DownloadEntry[] = JSON.parse(raw);
      
      const entryIndex = entries.findIndex(e => e.token === token);
      if (entryIndex !== -1) {
        const entry = entries[entryIndex];
        
        // เช็คว่าโหลดเสร็จแล้วหรือยัง
        if (entry.downloadCompleted) {
          return NextResponse.json({
            success: true,
            message: 'Already marked as completed',
            completedAt: entry.completedAt
          });
        }
        
        // ✅ Mark as completed
        const completedAt = new Date().toISOString();
        entries[entryIndex] = {
          ...entry,
          downloadCompleted: true,
          completedAt
        };
        
        await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2));
        
        console.log('✅ Download completed and marked:', {
          token: token.substring(0, 8) + '...',
          completedAt,
          orderId: entry.orderId,
          filePath: entry.filePath.split('/').pop()
        });
        
        return NextResponse.json({
          success: true,
          message: 'Download marked as completed',
          completedAt
        });
      }
    } catch (err) {
      console.log('downloads.json not found, but that\'s okay for Supabase tokens');
    }

    // 🤔 ถ้าไม่เจอใน downloads.json แต่มาจาก Supabase
    // สำหรับ Supabase tokens เราไม่ track completion ใน downloads.json
    // แต่เราจะ log เอาไว้
    console.log('📋 Download completion noted for Supabase token:', {
      token: token.substring(0, 8) + '...',
      timestamp: new Date().toISOString(),
      note: 'Supabase token - no local completion tracking'
    });

    return NextResponse.json({
      success: true,
      message: 'Download completion noted (Supabase token)'
    });
    
  } catch (error) {
    console.error('Error in mark-downloaded:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}