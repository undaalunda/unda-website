// app/components/DownloadButton.tsx - อัปเดตแล้ว: ลบ device fingerprint + 48ชม.

'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  href: string;
  fileName: string;
  token: string;
  children: React.ReactNode;
  className?: string;
}

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
      // 📡 บันทึกการเริ่ม download (ไม่ต้อง fingerprint แล้ว)
      const startResponse = await fetch('/api/start-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const startResult = await startResponse.json();
      
      if (!startResponse.ok) {
        // Handle specific error cases
        if (startResult.code === 'ALREADY_DOWNLOADED') {
          setDownloadStatus('completed');
          alert('This file has already been downloaded!');
          return;
        } else if (startResult.code === 'EXPIRED') {
          alert('Download link has expired (48 hours limit)');
          setDownloadStatus('ready');
          return;
        } else {
          throw new Error(startResult.error || 'Failed to start download');
        }
      }

      // 🎯 เริ่ม download จริงๆ
      const downloadLink = document.createElement('a');
      downloadLink.href = href + `?token=${token}`;
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
            body: JSON.stringify({ token })
          });
          
          setDownloadStatus('completed');
          setShowSuccess(true);
          
          // ซ่อนข้อความ success หลัง 3 วินาที
          setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
          console.error('Failed to mark as downloaded:', error);
          // ถึงแม้ mark failed แต่ไฟล์ก็โหลดไปแล้ว
          setDownloadStatus('completed');
        }
      }, 3000);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('ready');
      alert('Download failed. Please try again.');
    }
  };

  if (downloadStatus === 'completed') {
    return (
      <div className={`${className} font-[Cinzel] opacity-50 cursor-not-allowed relative`}>
        <span>Downloaded Successfully</span>
        {showSuccess && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-700 text-[#f8fcdc] font-[Cinzel] px-3 py-1 rounded text-sm border border-emerald-600">
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
      className={`${className} font-[Cinzel] cursor-pointer ${downloadStatus === 'downloading' ? 'opacity-75 cursor-wait' : ''}`}
    >
      {downloadStatus === 'downloading' ? (
        <>
          <span className="animate-spin mr-2"></span>
          Downloading...
        </>
      ) : (
        children
      )}
    </button>
  );
}