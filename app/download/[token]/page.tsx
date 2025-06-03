// /app/download/[token]/page.tsx - แก้ไข + เพิ่ม debug

import { notFound } from 'next/navigation';
import supabase from '../../../lib/supabase';
import DownloadPageClient from './DownloadPageClient';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { token } = await params;

  console.log('🔍 Looking up download token:', token);
  console.log('🔍 Token length:', token.length);

  try {
    // 🆕 แสดงข้อมูล token ที่กำลังหา
    console.log('🔎 Searching for token in Supabase:', {
      token: token,
      tokenLength: token.length,
      tokenType: typeof token
    });

    // ค้นหา token ใน Supabase - ใช้ debug แบบละเอียด
    const { data: order, error, count } = await supabase
      .from('Orders')
      .select('*', { count: 'exact' })
      .eq('download_token', token);

    console.log('📊 Supabase query result:', {
      data: order,
      error: error,
      count: count,
      dataLength: order?.length || 0
    });

    // 🆕 ถ้าไม่เจอ token ให้ลองหาแบบอื่น
    if (!order || order.length === 0) {
      console.log('❌ Token not found with exact match, trying alternative search...');
      
      // ลองหาโดยใช้ LIKE หรือ contains
      const { data: altOrder, error: altError } = await supabase
        .from('Orders')
        .select('*')
        .ilike('download_token', `%${token}%`);

      console.log('🔍 Alternative search result:', {
        data: altOrder,
        error: altError
      });

      // ลองดู Orders ล่าสุด 5 รายการเพื่อ debug
      const { data: recentOrders } = await supabase
        .from('Orders')
        .select('id, download_token, created_at, is_used')
        .order('created_at', { ascending: false })
        .limit(5);

      console.log('📋 Recent 5 orders for debugging:', recentOrders?.map(o => ({
        id: o.id,
        token: o.download_token ? o.download_token.substring(0, 8) + '...' : 'null',
        tokenFull: o.download_token,
        created: o.created_at,
        isUsed: o.is_used
      })));

      notFound();
    }

    // ใช้ record แรกถ้าเจอ
    const orderRecord = order[0];
    
    console.log('✅ Token found in Supabase:', {
      token: token.substring(0, 8) + '...',
      orderId: orderRecord.id,
      filePath: orderRecord.file_path,
      isUsed: orderRecord.is_used,
      expiresAt: orderRecord.download_expires,
      usedAt: orderRecord.used_at,
      fullTokenInDB: orderRecord.download_token
    });

    // 🆕 เปรียบเทียบ token ที่เข้ามากับที่อยู่ใน DB
    if (orderRecord.download_token !== token) {
      console.log('⚠️ Token mismatch:', {
        requestToken: token,
        dbToken: orderRecord.download_token,
        areEqual: orderRecord.download_token === token
      });
    }

    // เช็ค expiration
    const now = new Date();
    const expiresAt = new Date(orderRecord.download_expires);
    const isExpired = now > expiresAt;

    console.log('⏰ Time check:', {
      now: now.toISOString(),
      expiresAt: orderRecord.download_expires,
      isExpired,
      timeDiff: expiresAt.getTime() - now.getTime()
    });

    // ✅ ถ้า token หมดอายุแล้ว
    if (isExpired) {
      console.log('⏰ Token expired:', token);
      return (
        <DownloadPageClient
          token={token}
          entry={{
            token,
            filePath: 'expired',
            createdAt: orderRecord.created_at,
            expiresInMinutes: 0,
            orderId: orderRecord.id
          }}
          supabaseData={{
            orderId: orderRecord.id,
            isExpired: true
          }}
          expiresAt={orderRecord.download_expires}
          isCompleted={false}
        />
      );
    }

    // ✅ ถ้า token ถูกใช้งานแล้ว (downloaded completed)
    if (orderRecord.is_used && orderRecord.used_at) {
      console.log('🔒 Token already used:', token, 'at:', orderRecord.used_at);
      return (
        <DownloadPageClient
          token={token}
          entry={{
            token,
            filePath: orderRecord.file_path || 'used',
            createdAt: orderRecord.created_at,
            expiresInMinutes: 0,
            orderId: orderRecord.id,
            downloadCompleted: true
          }}
          supabaseData={{
            orderId: orderRecord.id,
            isUsed: true
          }}
          expiresAt={orderRecord.download_expires}
          isCompleted={true}
          completedAt={orderRecord.used_at}
        />
      );
    }

    // ✅ Token ยังใช้งานได้ (ยังไม่ได้ download หรือ is_used = false)
    console.log('💚 Token is valid and ready for download');
    return (
      <DownloadPageClient
        token={token}
        entry={{
          token,
          filePath: orderRecord.file_path || '/default-download',
          createdAt: orderRecord.created_at,
          expiresInMinutes: 2880, // 48 hours
          orderId: orderRecord.id,
          downloadStarted: false,
          downloadCompleted: false
        }}
        supabaseData={{
          orderId: orderRecord.id,
          email: orderRecord.email,
          filePath: orderRecord.file_path
        }}
        expiresAt={orderRecord.download_expires}
        isCompleted={false}
      />
    );

  } catch (error) {
    console.error('🔥 Error in download page:', error);
    
    // 🆕 แสดง error ที่ละเอียดขึ้น
    console.error('🔥 Detailed error info:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      token: token,
      tokenLength: token.length
    });
    
    notFound();
  }
}