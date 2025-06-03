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
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filePath, orderId, expiresInMinutes = 60 } = body;

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  const token = uuidv4();
  const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');

  try {
    // ถ้ามี orderId ให้อัพเดท download_token ในตาราง Orders
    if (orderId) {
      const { data, error } = await supabase
        .from('Orders')
        .update({ download_token: token })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating download token:', error);
        return NextResponse.json({ error: 'Failed to update download token' }, { status: 500 });
      }
    }

    // สร้าง entry ใหม่
    const newEntry: DownloadEntry = {
      token,
      filePath,
      createdAt: new Date().toISOString(),
      expiresInMinutes,
      orderId
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

    // ลบ entries ที่หมดอายุแล้ว (optional cleanup)
    const now = new Date();
    entries = entries.filter(entry => {
      const expiresAt = new Date(entry.createdAt);
      expiresAt.setMinutes(expiresAt.getMinutes() + entry.expiresInMinutes);
      return now < expiresAt;
    });

    // เขียนกลับไปยังไฟล์
    await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2));

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