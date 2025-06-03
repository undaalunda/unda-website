// app/download/[token]/DownloadPageClient.tsx - อัปเดตแล้ว: ลบ device fingerprint + 48ชม.

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
  const [timeRemaining, setTimeRemaining] = useState('');
  
  useEffect(() => {
    setMounted(true);
    
    // Format completion date
    if (completedAt) {
      setFormattedDate(new Date(completedAt).toLocaleString());
    }
    
    // Calculate time remaining
    const updateTimeRemaining = () => {
      const now = new Date();
      const expires = new Date(expiresAt);
      const diff = expires.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [completedAt, expiresAt]);

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
          <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Download Complete!</h1>
          <p className="mb-7 text-lg">Your file has been successfully downloaded.</p>
          {formattedDate && (
            <p className="text-sm opacity-70 mb-4">
              Downloaded on: {formattedDate}
            </p>
          )}
          <p className="text-xs opacity-50 mb-6">
            This download link has expired for security reasons.
          </p>
          <p className="text-sm opacity-80 mb-4">
            Thank you for your purchase.
          </p>
          <a 
            href={process.env.NODE_ENV === 'production' 
              ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
              : 'http://localhost:3000'
            }
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
          <p className="mb-4">Click the links below to download your files:</p>
          
          {timeRemaining && (
            <p className="text-sm opacity-80 mb-7">
              {timeRemaining}
            </p>
          )}

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
            Each file can be downloaded once within 48 hours
          </p>
          
          <p className="text-xs mt-2 opacity-30">
            Order ID: {supabaseData.orderId}
          </p>
                 
          <a 
            href={process.env.NODE_ENV === 'production' 
              ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
              : 'http://localhost:3000'
            }
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
      className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] text-center"
      style={{
        backgroundImage: "url('/redsky-bg.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Download is Ready</h1>
        <p className="mb-4">Click the button below to download your file:</p>
        
        {timeRemaining && (
          <p className="text-sm opacity-80 mb-7">
            {timeRemaining}
          </p>
        )}

        <DownloadButton
          href={entry.filePath}
          fileName={fileName}
          token={token}
          className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
        >
          Download {fileName}
        </DownloadButton>

        <p className="text-xs mt-6 opacity-50">
          This file can be downloaded once within 48 hours
        </p>

        {supabaseData && (
          <p className="text-xs mt-2 opacity-30">
            Order ID: {supabaseData.orderId}
          </p>
        )}
               
        <a 
          href={process.env.NODE_ENV === 'production' 
            ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
            : 'http://localhost:3000'
          }
          className="mt-4 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block"
        >
          Back to Store
        </a>
      </div>
    </main>
  );
}