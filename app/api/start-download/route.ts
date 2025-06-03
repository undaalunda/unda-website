// app/api/start-download/route.ts - อัปเดตแล้ว: ลบ device fingerprint + 48ชม.

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
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

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');

    // 🔍 หา token ใน downloads.json หรือ Supabase
    let entries: DownloadEntry[] = [];
    let tokenFound = false;

    try {
      const raw = await fs.readFile(DB_PATH, 'utf-8');
      entries = JSON.parse(raw);
      
      const entryIndex = entries.findIndex(e => e.token === token);
      if (entryIndex !== -1) {
        const entry = entries[entryIndex];
        
        // ✅ เช็คว่าหมดอายุหรือยัง
        const createdAt = new Date(entry.createdAt);
        const expiresAt = new Date(createdAt.getTime() + entry.expiresInMinutes * 60000);
        
        if (new Date() > expiresAt) {
          return NextResponse.json({ 
            error: 'Download link has expired',
            code: 'EXPIRED' 
          }, { status: 410 });
        }
        
        // 🚫 เช็คว่าโหลดเสร็จแล้วหรือยัง
        if (entry.downloadCompleted) {
          return NextResponse.json({
            error: 'File has already been downloaded',
            code: 'ALREADY_DOWNLOADED',
            completedAt: entry.completedAt
          }, { status: 403 });
        }
        
        // 📝 อัพเดท entry - mark เป็น started
        entries[entryIndex] = {
          ...entry,
          downloadStarted: true,
          startedAt: new Date().toISOString()
        };
        
        tokenFound = true;
      }
    } catch (err) {
      console.log('downloads.json not found, checking Supabase...');
    }

    // 🔍 ถ้าไม่เจอใน downloads.json ให้หาใน Supabase
    if (!tokenFound) {
      const { data: orderData, error } = await supabase
        .from('Orders')
        .select('id, download_token, download_expires, items')
        .eq('download_token', token)
        .single();
        
      if (error || !orderData) {
        return NextResponse.json({ 
          error: 'Download link not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }
      
      // เช็คว่าหมดอายุหรือยัง
      if (orderData.download_expires && new Date() > new Date(orderData.download_expires)) {
        return NextResponse.json({ 
          error: 'Download link has expired',
          code: 'EXPIRED' 
        }, { status: 410 });
      }
      
      console.log('✅ Token found in Supabase, download allowed');
    }

    // 💾 บันทึกกลับไฟล์ (ถ้ามีการเปลี่ยนแปลง)
    if (tokenFound) {
      await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2));
    }

    console.log('🚀 Download started:', {
      token: token.substring(0, 8) + '...',
      timestamp: new Date().toISOString(),
      source: tokenFound ? 'downloads.json' : 'Supabase'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Download started',
      source: tokenFound ? 'downloads.json' : 'Supabase'
    });
    
  } catch (error) {
    console.error('Error in start-download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}