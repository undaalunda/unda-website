// app/components/DownloadButton.tsx
'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  href: string;
  fileName: string;
  token: string;
  children: React.ReactNode;
  className?: string;
}

// 🕵️‍♂️ สร้าง Device Fingerprint
const createDeviceFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.fillText('Device fingerprint check', 2, 2);
    }
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency || 0
    };
    
    // สร้าง hash จาก fingerprint
    return btoa(JSON.stringify(fingerprint)).substring(0, 16);
  } catch (error) {
    console.error('Failed to create fingerprint:', error);
    return 'fallback-' + Date.now();
  }
};

export default function DownloadButton({
  href,
  fileName,
  token,
  children,
  className = ""
}: DownloadButtonProps) {
  const [downloadStatus, setDownloadStatus] = useState<'ready' | 'downloading' | 'completed'>('ready');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloadStatus('downloading');
    
    try {
      // 🕵️‍♂️ สร้าง device fingerprint
      const deviceFingerprint = createDeviceFingerprint();
      
      // 📡 บันทึก fingerprint และเริ่ม download
      await fetch('/api/start-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          deviceFingerprint,
          userAgent: navigator.userAgent 
        })
      });

      // 🎯 เริ่ม download จริงๆ
      const downloadLink = document.createElement('a');
      downloadLink.href = href + `?token=${token}&fp=${deviceFingerprint}`;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // ⏰ รอ 3 วินาที แล้วถือว่าโหลดเสร็จ (สำหรับไฟล์เล็กๆ)
      setTimeout(async () => {
        try {
          await fetch('/api/mark-downloaded', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, deviceFingerprint })
          });
          
          setDownloadStatus('completed');
          setShowSuccess(true);
          
          // ซ่อนข้อความ success หลัง 3 วินาที
          setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
          console.error('Failed to mark as downloaded:', error);
        }
      }, 3000);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('ready');
    }
  };

  if (downloadStatus === 'completed') {
    return (
      <div className={`${className} opacity-50 cursor-not-allowed relative`}>
        <span>Downloaded Successfully</span>
        {showSuccess && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-700 text-[#f8fcdc] px-3 py-1 rounded text-sm border border-emerald-600">
            Download Complete
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloadStatus === 'downloading'}
      className={`${className} cursor-pointer ${downloadStatus === 'downloading' ? 'opacity-75 cursor-wait' : ''}`}
    >
      {downloadStatus === 'downloading' ? (
        <>
          <span className="animate-spin mr-2">Loading</span>
          Downloading...
        </>
      ) : (
        children
      )}
    </button>
  );
}