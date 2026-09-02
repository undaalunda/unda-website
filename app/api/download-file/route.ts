// /app/api/download-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const R2_URL = process.env.R2_PUBLIC_URL || '';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    const filename = request.nextUrl.searchParams.get('file');
    
    if (!token || !filename) {
      return new Response('Missing parameters', { status: 400 });
    }
    
    console.log('📥 Download request:', { token, filename });
    
    // ✅ ตรวจสอบ token ในตาราง DownloadTokens แทน Orders
    const { data: tokenData, error } = await supabase
      .from('DownloadTokens')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error || !tokenData) {
      console.error('❌ Invalid token:', token, error);
      return new Response('Invalid token', { status: 403 });
    }
    
    console.log('✅ Token found in DownloadTokens table:', {
      orderId: tokenData.order_id,
      isUsed: tokenData.is_used,
      expiresAt: tokenData.expires_at
    });
    
    // เช็คว่า token หมดอายุหรือใช้แล้วหรือยัง
    if (tokenData.is_used) {
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
    console.log('🔗 Fetching from:', fileUrl);
    
    const fileResponse = await fetch(fileUrl);
    
    if (!fileResponse.ok) {
      console.error('❌ File not found in R2:', filename, fileResponse.status);
      return new Response('File not found', { status: 404 });
    }
    
    console.log('✅ File found, streaming to client');
    
    const headers = new Headers();
    headers.set('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Cache-Control', 'no-cache');
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new Response(fileResponse.body, { headers });
    
  } catch (error) {
    console.error('🔥 Download error:', error);
    return new Response('Server error: ' + (error instanceof Error ? error.message : 'Unknown'), { status: 500 });
  }
}