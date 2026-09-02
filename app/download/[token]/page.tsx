// /app/download/[token]/page.tsx - ใช้ตาราง DownloadTokens แยกต่างหาก

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

  try {
    // ✅ ค้นหา token ในตาราง DownloadTokens แทน Orders
    const { data: tokenRecord, error } = await supabase
      .from('DownloadTokens')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !tokenRecord) {
      console.error('❌ Token not found:', token, error);
      notFound();
    }

    console.log('✅ Token found:', {
      token: token.substring(0, 8) + '...',
      orderId: tokenRecord.order_id,
      filePath: tokenRecord.file_path,
      isUsed: tokenRecord.is_used,
      expiresAt: tokenRecord.expires_at
    });

    // ดึงข้อมูลอีเมลจาก Orders มาแสดงประกอบ (ไม่บังคับ แต่ช่วย debug/UX)
    const { data: order } = await supabase
      .from('Orders')
      .select('email')
      .eq('id', tokenRecord.order_id)
      .single();

    // เช็ค expiration
    const now = new Date();
    const expiresAt = new Date(tokenRecord.expires_at);
    const isExpired = now > expiresAt;

    console.log('⏰ Time check:', {
      now: now.toISOString(),
      expiresAt: tokenRecord.expires_at,
      isExpired
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
            createdAt: tokenRecord.created_at,
            expiresInMinutes: 0,
            orderId: tokenRecord.order_id
          }}
          supabaseData={{
            orderId: tokenRecord.order_id,
            isExpired: true
          }}
          expiresAt={tokenRecord.expires_at}
          isCompleted={false}
        />
      );
    }

    // ✅ ถ้า token ถูกใช้งานแล้ว (downloaded completed)
    if (tokenRecord.is_used && tokenRecord.used_at) {
      console.log('🔒 Token already used:', token, 'at:', tokenRecord.used_at);
      return (
        <DownloadPageClient
          token={token}
          entry={{
            token,
            filePath: tokenRecord.file_path || 'used',
            createdAt: tokenRecord.created_at,
            expiresInMinutes: 0,
            orderId: tokenRecord.order_id,
            downloadCompleted: true
          }}
          supabaseData={{
            orderId: tokenRecord.order_id,
            isUsed: true
          }}
          expiresAt={tokenRecord.expires_at}
          isCompleted={true}
          completedAt={tokenRecord.used_at}
        />
      );
    }

    // ✅ Token ยังใช้งานได้
    console.log('💚 Token is valid and ready for download');
    return (
      <DownloadPageClient
        token={token}
        entry={{
          token,
          filePath: tokenRecord.file_path || '/default-download',
          createdAt: tokenRecord.created_at,
          expiresInMinutes: 2880,
          orderId: tokenRecord.order_id,
          downloadStarted: false,
          downloadCompleted: false
        }}
        supabaseData={{
          orderId: tokenRecord.order_id,
          email: order?.email,
          filePath: tokenRecord.file_path
        }}
        expiresAt={tokenRecord.expires_at}
        isCompleted={false}
      />
    );

  } catch (error) {
    console.error('🔥 Error in download page:', error);
    console.error('🔥 Detailed error info:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      token: token
    });

    notFound();
  }
}