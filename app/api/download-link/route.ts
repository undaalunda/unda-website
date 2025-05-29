// /api/download-link/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filePath, orderId } = body;

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  const token = uuidv4();
  
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

    // เก็บ mapping ของ token กับ filePath ไว้ใน memory หรือ cache
    // หรือสร้างตารางแยกสำหรับเก็บ token-to-file mapping
    // แต่ตอนนี้ใช้วิธีง่ายๆ คือ encode filePath ใน token
    const encodedToken = Buffer.from(JSON.stringify({ 
      token, 
      filePath,
      createdAt: new Date().toISOString()
    })).toString('base64');

    return NextResponse.json({ token: encodedToken });
  } catch (error) {
    console.error('Error in download-link API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}