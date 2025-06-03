// app/api/mark-downloaded/route.ts

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
  deviceFingerprint?: string;
  userAgent?: string;
  startedAt?: string;
  completedAt?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { token, deviceFingerprint } = await req.json();
    
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
        // ✅ Mark as completed
        entries[entryIndex] = {
          ...entries[entryIndex],
          downloadCompleted: true,
          completedAt: new Date().toISOString()
        };
        
        await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2));
        
        console.log('✅ Download completed and marked:', {
          token: token.substring(0, 8) + '...',
          device: deviceFingerprint?.substring(0, 8) + '...',
          completedAt: entries[entryIndex].completedAt
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Download marked as completed',
          completedAt: entries[entryIndex].completedAt
        });
      }
    } catch (err) {
      console.log('downloads.json not found, but that\'s okay');
    }
    
    // 🤔 ถ้าไม่เจอใน downloads.json แต่มาจาก Supabase
    // ไม่ต้องทำอะไร เพราะ Supabase tokens ไม่มี completion tracking
    console.log('📋 Token from Supabase - no completion tracking needed');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Download noted (Supabase token)' 
    });
    
  } catch (error) {
    console.error('Error in mark-downloaded:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}