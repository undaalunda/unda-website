// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const WINDOW = 60 * 1000; // 1 นาที
const LIMIT = 10; // 10 requests ต่อ window

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const key = ip.toString();

  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (entry) {
    if (now - entry.timestamp < WINDOW) {
      if (entry.count >= LIMIT) {
        return new NextResponse('Too many requests', { status: 429 });
      }
      entry.count++;
    } else {
      rateLimitMap.set(key, { count: 1, timestamp: now });
    }
  } else {
    rateLimitMap.set(key, { count: 1, timestamp: now });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/create-payment-intent'],
};