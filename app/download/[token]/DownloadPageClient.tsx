// app/download/[token]/DownloadPageClient.tsx - เพิ่ม redsky background

'use client';

import { useState, useEffect } from 'react';
import DownloadButton from '@/components/DownloadButton';

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

interface DownloadPageClientProps {
  token: string;
  entry: DownloadEntry;
  supabaseData: any;
  expiresAt: string;
  isCompleted?: boolean;
  completedAt?: string;
}

export default function DownloadPageClient({ 
  token, 
  entry, 
  supabaseData, 
  expiresAt,
  isCompleted = false,
  completedAt
}: DownloadPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    setMounted(true);
    // Format dates only on client side
    if (completedAt) {
      setFormattedDate(new Date(completedAt).toLocaleString());
    }
  }, [completedAt]);

  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] bg-black text-center">
        <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Loading...</h1>
      </main>
    );
  }

  // ถ้าดาวน์โหลดเสร็จแล้ว
  if (isCompleted && completedAt) {
    return (
      <main 
        className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] text-center relative"
        style={{
          backgroundImage: "url('/redsky-bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Download Complete</h1>
          <p className="mb-7">Your file has been successfully downloaded!</p>
          {formattedDate && (
            <p className="text-sm opacity-70 mb-4">
              Downloaded on: {formattedDate}
            </p>
          )}
          <p className="text-xs opacity-50">
            For security reasons, this download link has expired.
          </p>
          <a 
            href="https://unda-website.vercel.app"
            className="mt-6 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block"
          >
            Back to Store
          </a>
        </div>
      </main>
    );
  }

  // ถ้ามาจาก Supabase และมีหลายไฟล์
  if (supabaseData && supabaseData.filePaths?.length > 1) {
    return (
      <main 
        className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] text-center relative"
        style={{
          backgroundImage: "url('/redsky-bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Downloads are Ready</h1>
          <p className="mb-7">Click the links below to download your files:</p>

          <div className="space-y-4 mb-8">
            {supabaseData.filePaths.map((fileData: any, index: number) => {
              const fileName = fileData.filePath.split('/').pop() || `download-${index + 1}`;
              return (
                <DownloadButton
                  key={index}
                  href={fileData.filePath}
                  fileName={fileName}
                  token={token}
                  className="block bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
                >
                  Download {fileData.displayName}
                </DownloadButton>
              );
            })}
          </div>

          <p className="text-xs mt-6 opacity-50">
            These download links will expire after use
          </p>
          
          <p className="text-xs mt-2 opacity-30">
            Order ID: {supabaseData.orderId}
          </p>
                 
          <a 
            href="https://unda-website.vercel.app"
            className="mt-4 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block"
          >
            Back to Store
          </a>
        </div>
      </main>
    );
  }

  // ถ้ามีไฟล์เดียว (จาก downloads.json หรือ Supabase)
  const fileName = entry.filePath.split('/').pop() || 'download';

  return (
    <main 
      className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] text-center relative"
      style={{
        backgroundImage: "url('/redsky-bg.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Download is Ready</h1>
        <p className="mb-7">Click the button below to download your file:</p>

        <DownloadButton
          href={entry.filePath}
          fileName={fileName}
          token={token}
          className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
        >
          Download {fileName}
        </DownloadButton>

        <p className="text-xs mt-6 opacity-50">
          This download link will expire after use
        </p>

        {supabaseData && (
          <p className="text-xs mt-2 opacity-30">
            Order ID: {supabaseData.orderId}
          </p>
        )}
               
        <a 
          href="https://unda-website.vercel.app"
          className="mt-4 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block"
        >
          Back to Store
        </a>
      </div>
    </main>
  );
}