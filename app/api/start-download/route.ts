// app/api/start-download/route.ts

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
  deviceFingerprint?: string;
  userAgent?: string;
  startedAt?: string;
  completedAt?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { token, deviceFingerprint, userAgent } = await req.json();
    
    if (!token || !deviceFingerprint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
        
        if (new Date() > expiresAt && !entry.downloadCompleted) {
          return NextResponse.json({ error: 'Token expired' }, { status: 410 });
        }
        
        // 🕵️‍♂️ เช็ค device fingerprint
        if (entry.deviceFingerprint && entry.deviceFingerprint !== deviceFingerprint) {
          console.log('⚠️ Different device detected:', {
            original: entry.deviceFingerprint.substring(0, 8),
            new: deviceFingerprint.substring(0, 8)
          });
          
          // ถ้าเป็นคนละเครื่อง แต่ยังไม่โหลด = ให้ผ่าน (อาจเปลี่ยนเครื่อง)
          // ถ้าโหลดแล้ว = block
          if (entry.downloadCompleted) {
            return NextResponse.json({ 
              error: 'File already downloaded on another device',
              code: 'ALREADY_DOWNLOADED'
            }, { status: 403 });
          }
        }
        
        // 📝 อัพเดท entry
        entries[entryIndex] = {
          ...entry,
          downloadStarted: true,
          deviceFingerprint,
          userAgent,
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
        return NextResponse.json({ error: 'Token not found' }, { status: 404 });
      }
      
      // เช็คว่าหมดอายุหรือยัง
      if (orderData.download_expires && new Date() > new Date(orderData.download_expires)) {
        return NextResponse.json({ error: 'Token expired' }, { status: 410 });
      }
      
      console.log('✅ Token found in Supabase, starting download tracking');
    }
    
    // 💾 บันทึกกลับไฟล์
    if (tokenFound) {
      await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2));
    }
    
    console.log('🚀 Download started:', {
      token: token.substring(0, 8) + '...',
      device: deviceFingerprint.substring(0, 8) + '...',
      userAgent: userAgent?.substring(0, 50) + '...'
    });
    
    return NextResponse.json({ success: true, message: 'Download started' });
    
  } catch (error) {
    console.error('Error in start-download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}