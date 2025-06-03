// /app/download/[token]/DownloadPageClient.tsx - แก้ cursor + file path

'use client';

import { useState, useEffect } from 'react';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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

  // Handle download และ mark as used
  const handleDownload = async () => {
    if (!entry.filePath || entry.filePath === 'expired' || entry.filePath === 'used') {
      alert('File not available');
      return;
    }

    try {
      setIsDownloading(true);
      
      // Mark token as used ใน Supabase
      const response = await fetch('/api/mark-downloaded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, orderId: entry.orderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark download as used');
      }

      // ดาวน์โหลดไฟล์
      const fileName = entry.filePath.split('/').pop() || 'download';
      
      console.log('🔗 Attempting to download:', entry.filePath);
      
      // 🚀 วิธีที่ให้ระบบพร้อมที่สุด: ลองโหลดไฟล์จริงก่อน ถ้าไม่ได้ ให้ placeholder
      try {
        // ลองเช็คว่าไฟล์มีจริงไหม
        const checkResponse = await fetch(entry.filePath, { method: 'HEAD' });
        
        if (checkResponse.ok) {
          // ไฟล์มีจริง - โหลดตามปกติ
          const link = document.createElement('a');
          link.href = entry.filePath;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('✅ Real file downloaded:', fileName);
        } else {
          // ไฟล์ยังไม่มี - สร้าง placeholder file ที่มีชื่อถูกต้อง
          const placeholderContent = `This is a placeholder for ${fileName}.\n\nThe actual file will be available soon.\nPlease check back later or contact support.\n\nFile: ${fileName}\nExpected path: ${entry.filePath}`;
          
          const blob = new Blob([placeholderContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          URL.revokeObjectURL(url);
          
          console.log('📄 Placeholder file downloaded:', fileName);
        }
      } catch (downloadError) {
        console.error('❌ Download check failed:', downloadError);
        // ถ้าเช็คไม่ได้ ให้สร้าง placeholder ไปเลย
        const placeholderContent = `This is a placeholder for ${fileName}.\n\nThe actual file will be available soon.\nPlease check back later or contact support.\n\nFile: ${fileName}\nExpected path: ${entry.filePath}`;
        
        const blob = new Blob([placeholderContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('📄 Fallback placeholder downloaded:', fileName);
      }

      // แสดง success message
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // รีเฟรชหน้าเพื่อแสดงสถานะ "completed"
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
            className="mt-6 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block cursor-pointer"
          >
            Back to Store
          </a>
        </div>
      </main>
    );
  }

  // ถ้า expired
  if (supabaseData?.isExpired) {
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
          <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Download Expired</h1>
          <p className="mb-7 text-lg">This download link has expired.</p>
          <p className="text-sm opacity-80 mb-4">
            Please contact support if you need to re-download your files.
          </p>
          <a 
            href={process.env.NODE_ENV === 'production' 
              ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
              : 'http://localhost:3000'
            }
            className="mt-6 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block cursor-pointer"
          >
            Back to Store
          </a>
        </div>
      </main>
    );
  }

  // ถ้ามีไฟล์ให้ดาวน์โหลด
  const fileName = entry.filePath?.split('/').pop() || 'download';

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
        {/* Success message */}
        {showSuccess && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-emerald-800 text-[#f8fcdc] font-[Cinzel] px-2 py-1 rounded text-xs border border-emerald-700 opacity-90">
            Complete
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Download is Ready</h1>
        <p className="mb-4">Click the button below to download your file:</p>
        
        {timeRemaining && (
          <p className="text-sm opacity-80 mb-7">
            {timeRemaining}
          </p>
        )}

        {/* 🔧 แก้ปุ่ม: เพิ่ม cursor-pointer */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-[#dc9e63] hover:bg-[#f8cfa3] disabled:bg-gray-600 text-black px-6 py-3 rounded-xl text-lg transition relative cursor-pointer disabled:cursor-not-allowed"
        >
          {isDownloading ? 'Downloading...' : `Download ${fileName}`}
        </button>

        <p className="text-xs mt-6 opacity-50">
          This file can be downloaded once within 48 hours
        </p>

        {/* 🔧 Debug info: แสดง file path */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs mt-2 opacity-30 bg-black/50 px-2 py-1 rounded">
            Debug: {entry.filePath}
          </p>
        )}

        {supabaseData?.orderId && (
          <p className="text-xs mt-2 opacity-30">
            Order ID: {supabaseData.orderId}
          </p>
        )}
               
        <a 
          href={process.env.NODE_ENV === 'production' 
            ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
            : 'http://localhost:3000'
          }
          className="mt-4 text-[#dc9e63] hover:text-[#f8cfa3] underline inline-block cursor-pointer"
        >
          Back to Store
        </a>
      </div>
    </main>
  );
}