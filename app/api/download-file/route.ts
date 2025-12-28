// /app/api/download-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const R2_URL = process.env.R2_PUBLIC_URL || '';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    const filename = request.nextUrl.searchParams.get('file');
    
    if (!token || !filename) {
      return new Response('Missing parameters', { status: 400 });
    }
    
    console.log('📥 Download request:', { token, filename });
    
    // ตรวจสอบ token ใน Supabase
    const { data: tokenData, error } = await supabase
      .from('download_tokens')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error || !tokenData) {
      console.error('❌ Invalid token:', token);
      return new Response('Invalid token', { status: 403 });
    }
    
    // เช็คว่า token หมดอายุหรือใช้แล้วหรือยัง
    if (tokenData.download_completed) {
      console.error('❌ Token already used:', token);
      return new Response('Token already used', { status: 403 });
    }
    
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      console.error('❌ Token expired:', token);
      return new Response('Token expired', { status: 403 });
    }
    
    console.log('✅ Token valid, fetching file from R2:', filename);
    
    // ดึงไฟล์จาก R2
    const fileUrl = `${R2_URL}/${filename}`;
    const fileResponse = await fetch(fileUrl);
    
    if (!fileResponse.ok) {
      console.error('❌ File not found in R2:', filename);
      return new Response('File not found', { status: 404 });
    }
    
    console.log('✅ File found, streaming to client');
    
    // ส่งไฟล์กลับไปให้ client
    const headers = new Headers();
    headers.set('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Cache-Control', 'no-cache');
    
    return new Response(fileResponse.body, { headers });
    
  } catch (error) {
    console.error('🔥 Download error:', error);
    return new Response('Server error', { status: 500 });
  }
}
