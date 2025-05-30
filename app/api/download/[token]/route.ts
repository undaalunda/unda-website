// app/download/[token]/page.tsx

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../../lib/supabase';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Input validation schemas
interface DownloadLinkRequest {
  filePath: string;
  orderId?: string;
  expiresIn?: number; // minutes, default 60
}

// Enhanced error responses
const createErrorResponse = (message: string, status: number = 400) => {
  return NextResponse.json(
    { 
      error: message, 
      timestamp: new Date().toISOString(),
      success: false 
    }, 
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    }
  );
};

// Rate limiting function
const checkRateLimit = (clientIP: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per 15 minutes

  const clientData = rateLimitMap.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
};

// Input validation
const validateRequest = (body: any): DownloadLinkRequest | null => {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const { filePath, orderId, expiresIn } = body;

  // Validate filePath
  if (!filePath || typeof filePath !== 'string' || filePath.trim().length === 0) {
    return null;
  }

  // Basic path traversal protection
  if (filePath.includes('..') || filePath.includes('//') || filePath.startsWith('/')) {
    return null;
  }

  // Validate orderId if provided
  if (orderId !== undefined && (typeof orderId !== 'string' || orderId.trim().length === 0)) {
    return null;
  }

  // Validate expiresIn if provided
  const validExpiresIn = expiresIn && typeof expiresIn === 'number' && expiresIn > 0 && expiresIn <= 1440 
    ? expiresIn 
    : 60; // Default 60 minutes

  return {
    filePath: filePath.trim(),
    orderId: orderId?.trim(),
    expiresIn: validExpiresIn
  };
};

// Database operations with better error handling
const updateDownloadToken = async (orderId: string, token: string) => {
  try {
    const { data, error } = await supabase
      .from('Orders')
      .update({ 
        download_token: token,
        download_token_created_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('id, email')
      .single();

    if (error) {
      console.error('Supabase error updating download token:', error);
      throw new Error('Database update failed');
    }

    if (!data) {
      throw new Error('Order not found');
    }

    return data;
  } catch (error) {
    console.error('Error in updateDownloadToken:', error);
    throw error;
  }
};

// Enhanced token creation with security
const createSecureToken = (filePath: string, expiresIn: number) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000).toISOString();
  
  const tokenData = {
    token,
    filePath,
    createdAt: new Date().toISOString(),
    expiresAt,
    version: '1.0'
  };

  // Create a more secure encoded token
  const encodedToken = Buffer.from(JSON.stringify(tokenData)).toString('base64url');
  
  return {
    token: encodedToken,
    expiresAt
  };
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const clientIP = forwardedFor?.split(',')[0]?.trim() || 
      realIP || 
      req.headers.get('cf-connecting-ip') || // Cloudflare
      req.headers.get('x-client-ip') || 
      'unknown';

    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse('Too many requests. Please try again later.', 429);
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const validatedRequest = validateRequest(body);
    if (!validatedRequest) {
      return createErrorResponse('Invalid request parameters. filePath is required and must be a valid path.', 400);
    }

    const { filePath, orderId, expiresIn } = validatedRequest;

    // Create secure token
    const { token: encodedToken, expiresAt } = createSecureToken(filePath, expiresIn!);

    // Update database if orderId is provided
    let orderData = null;
    if (orderId) {
      try {
        orderData = await updateDownloadToken(orderId, encodedToken);
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        return createErrorResponse('Failed to process order. Please check your order ID.', 500);
      }
    }

    // Performance metrics
    const processingTime = Date.now() - startTime;

    // Success response with enhanced data
    return NextResponse.json(
      {
        success: true,
        token: encodedToken,
        expiresAt,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        ...(orderData && { 
          order: { 
            id: orderData.id, 
            email: orderData.email 
          } 
        })
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Processing-Time': `${processingTime}ms`,
        }
      }
    );

  } catch (error) {
    console.error('Unexpected error in download-link API:', error);
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        error: 'Internal server error. Please try again later.',
        success: false,
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Processing-Time': `${processingTime}ms`,
        }
      }
    );
  }
}

// GET method for health check and API documentation
export async function GET() {
  return NextResponse.json(
    {
      name: 'Download Link API',
      version: '1.0.0',
      description: 'Generates secure download tokens for files',
      endpoints: {
        POST: {
          description: 'Create a new download token',
          parameters: {
            filePath: 'string (required) - Path to the file',
            orderId: 'string (optional) - Order ID to associate with token',
            expiresIn: 'number (optional) - Token expiration in minutes (default: 60, max: 1440)'
          }
        }
      },
      rateLimit: '100 requests per 15 minutes per IP',
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    }
  );
}

// OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}