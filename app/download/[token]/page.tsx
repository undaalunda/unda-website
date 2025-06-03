// app/download/[token]/page.tsx

import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import supabase from '../../../lib/supabase';
import DownloadPageClient from './DownloadPageClient';

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

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type?: string;
}

// 🆕 ฟังก์ชันเดียวกับ send-confirmation สำหรับหา filePath
const getDownloadFileForItem = (item: CartItem): string | null => {
  if (item.category === 'Backing Track' || item.type === 'digital') {
    const titleSlug = item.title.toLowerCase().replace(/\s+/g, '-');
    const subtitleSlug = item.subtitle.toLowerCase();
    
    const possibleIds = [
      item.id,
      `${titleSlug}-${subtitleSlug}`,
      `${titleSlug}`,
    ];
    
    const downloadMap: Record<string, string> = {
      'anomic-drums': '/files/anomic-drums.wav',
      'jyy-guitars': '/files/jyy-guitars.wav', 
      'atlantic-guitar': '/files/atlantic-guitar.wav',
      'out-dark-drums': '/files/out-dark-drums.wav',
      'feign-guitars': '/files/feign-guitars.wav',
      'dark-keys': '/files/dark-keys.wav',
      'reddown-bass': '/files/reddown-bass.wav',
      'quietness-bass': '/files/quietness-bass.wav',
    };
    
    for (const id of possibleIds) {
      if (downloadMap[id]) {
        console.log('✅ Found file for ID:', id);
        return downloadMap[id];
      }
    }
    
    const defaultFile = `/download/${titleSlug}-${subtitleSlug}.wav`;
    console.log('⚠️ No mapping found, using default:', defaultFile);
    return defaultFile;
  }
  
  return null;
};

// 🆕 ฟังก์ชันหา token ใน Supabase และดึง order items
const findTokenInSupabase = async (token: string) => {
  try {
    // หา order ที่มี token นี้
    const { data: orderData, error: orderError } = await supabase
      .from('Orders')
      .select(`
        id, 
        download_token, 
        download_expires, 
        email, 
        items
      `)
      .eq('download_token', token)
      .single();

    if (orderError || !orderData) {
      console.log('Token not found in Supabase:', token.substring(0, 8) + '...');
      return null;
    }

    // ตรวจสอบว่าหมดอายุหรือยัง
    if (orderData.download_expires) {
      const expiresAt = new Date(orderData.download_expires);
      const now = new Date();
      
      if (now > expiresAt) {
        console.log('Token expired in Supabase:', token.substring(0, 8) + '...');
        return null;
      }
    }

    // หา digital items ใน order
    let digitalItems: CartItem[] = [];
    let filePaths: Array<{item: CartItem, filePath: string, displayName: string}> = [];
    
    if (orderData.items && Array.isArray(orderData.items)) {
      digitalItems = orderData.items.filter((item: CartItem) => 
        item.type === 'digital' || item.category === 'Backing Track'
      );
      
      // หา filePath สำหรับแต่ละ item
      filePaths = digitalItems.map((item: CartItem) => {
        const filePath = getDownloadFileForItem(item);
        return {
          item,
          filePath: filePath || '',
          displayName: `${item.title} – ${item.subtitle}`
        };
      }).filter(fp => fp.filePath);
    }

    console.log('✅ Token found in Supabase:', {
      orderId: orderData.id,
      expires: orderData.download_expires,
      digitalItemsCount: digitalItems.length
    });

    return {
      orderId: orderData.id,
      expiresAt: new Date(orderData.download_expires),
      email: orderData.email,
      filePaths,
      digitalItems
    };

  } catch (err) {
    console.error('Error checking Supabase:', err);
    return null;
  }
};

export default async function Page({ params }: any) {
  // ✅ await params ใน Next.js 15
  const resolvedParams = await params;
  const token = resolvedParams.token;
  const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');
  let entry: DownloadEntry | null = null;
  let supabaseData: any = null;

  // 🔍 ลองหาใน downloads.json ก่อน
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const entries: DownloadEntry[] = JSON.parse(raw);
    entry = entries.find((e) => e.token === token) || null;
    
    if (entry) {
      const createdAt = new Date(entry.createdAt);
      const expiresAt = new Date(createdAt.getTime() + entry.expiresInMinutes * 60000);
      const now = new Date();
      
      // 🎯 ถ้าดาวน์โหลดเสร็จแล้ว = หมดอายุเลย
      if (entry.downloadCompleted) {
        console.log('✅ File already downloaded - link expired');
        return (
          <DownloadPageClient 
            token={token}
            entry={entry}
            supabaseData={null}
            expiresAt={new Date().toISOString()}
            isCompleted={true}
            completedAt={entry.completedAt}
          />
        );
      }
      
      // ⏰ เช็คว่าหมดอายุปกติหรือยัง (สำหรับคนที่ยังไม่ได้โหลด)
      if (now > expiresAt) {
        console.log('Token expired in downloads.json');
        entry = null;
      } else {
        console.log('✅ Token found in downloads.json');
      }
    }
  } catch (err) {
    console.log('downloads.json not found or invalid');
  }

  // 🔍 ถ้าไม่เจอใน downloads.json ให้ลองหาใน Supabase
  if (!entry) {
    console.log('🔍 Searching in Supabase...');
    supabaseData = await findTokenInSupabase(token);
    
    if (!supabaseData || !supabaseData.filePaths?.length) {
      console.log('❌ Token not found anywhere or no digital files');
      return notFound();
    }

    // สร้าง entry จาก Supabase data
    const firstFile = supabaseData.filePaths[0];
    entry = {
      token: token,
      filePath: firstFile.filePath,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      expiresInMinutes: 60,
      orderId: supabaseData.orderId
    };
    
    console.log('✅ Using token from Supabase, orderId:', supabaseData.orderId);
  }

  if (!entry) return notFound();

  const expiresAt = supabaseData?.expiresAt || new Date(
    new Date(entry.createdAt).getTime() + entry.expiresInMinutes * 60000
  );

  // 🎯 ส่งข้อมูลไปให้ Client Component
  return (
    <DownloadPageClient 
      token={token}
      entry={entry}
      supabaseData={supabaseData}
      expiresAt={expiresAt.toISOString()}
    />
  );
}