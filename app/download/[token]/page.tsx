// /app/download/[token]/page.tsx - ใช้ Supabase อย่างเดียว

import { notFound } from 'next/navigation';
import supabase from '../../../lib/supabase';
import DownloadPageClient from './DownloadPageClient';

interface PageProps {
  params: {
    token: string;
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { token } = params;

  console.log('🔍 Looking up download token:', token);

  try {
    // ค้นหา token ใน Supabase
    const { data: order, error } = await supabase
      .from('Orders')
      .select('*')
      .eq('download_token', token)
      .single();

    if (error || !order) {
      console.error('❌ Token not found:', token, error);
      notFound();
    }

    console.log('✅ Token found in Supabase:', {
      token: token.substring(0, 8) + '...',
      orderId: order.id,
      filePath: order.file_path,
      isUsed: order.is_used,
      expiresAt: order.download_expires
    });

    // เช็ค expiration
    const now = new Date();
    const expiresAt = new Date(order.download_expires);
    const isExpired = now > expiresAt;

    if (isExpired) {
      console.error('⏰ Token expired:', token);
      return (
        <DownloadPageClient
          token={token}
          entry={{
            token,
            filePath: 'expired',
            createdAt: order.created_at,
            expiresInMinutes: 0,
            orderId: order.id
          }}
          supabaseData={{
            orderId: order.id,
            isExpired: true
          }}
          expiresAt={order.download_expires}
          isCompleted={false}
        />
      );
    }

    // เช็คว่าใช้งานแล้วหรือยัง
    if (order.is_used) {
      console.error('🔒 Token already used:', token);
      return (
        <DownloadPageClient
          token={token}
          entry={{
            token,
            filePath: order.file_path || 'used',
            createdAt: order.created_at,
            expiresInMinutes: 0,
            orderId: order.id,
            downloadCompleted: true
          }}
          supabaseData={{
            orderId: order.id,
            isUsed: true
          }}
          expiresAt={order.download_expires}
          isCompleted={true}
          completedAt={order.used_at}
        />
      );
    }

    // Token ยังใช้งานได้
    return (
      <DownloadPageClient
        token={token}
        entry={{
          token,
          filePath: order.file_path || '/default-download',
          createdAt: order.created_at,
          expiresInMinutes: 2880, // 48 hours
          orderId: order.id,
          downloadStarted: false,
          downloadCompleted: false
        }}
        supabaseData={{
          orderId: order.id,
          email: order.email,
          filePath: order.file_path
        }}
        expiresAt={order.download_expires}
        isCompleted={false}
      />
    );

  } catch (error) {
    console.error('🔥 Error in download page:', error);
    notFound();
  }
}