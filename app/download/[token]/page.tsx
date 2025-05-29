// app/download/[token]/page.tsx

import { notFound } from 'next/navigation';
import supabase from '../../../lib/supabase';

export default async function Page({ params }: { params: { token: string } }) {
  try {
    // ✅ ดึงข้อมูลจาก Supabase แทน JSON file
    const { data: order, error } = await supabase
      .from('Orders')
      .select('*')
      .eq('download_token', params.token)
      .single();

    if (error || !order) {
      console.error('❌ Order not found:', error?.message);
      return notFound();
    }

    // ✅ เช็คว่า link หมดอายุหรือยัง
    const now = new Date();
    const expiresAt = new Date(order.download_expires);
    
    if (now > expiresAt) {
      console.log('⏰ Download link expired');
      return (
        <main className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] bg-black text-center">
          <h1 className="text-4xl font-bold mb-8 text-red-500">Download Link Expired</h1>
          <p className="mb-7">This download link has expired. Please contact support.</p>
          <a 
            href="mailto:support@undaalunda.com"
            className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
          >
            Contact Support
          </a>
        </main>
      );
    }

    // ✅ สร้างรายการไฟล์ download
    const downloadItems = order.items
      .filter((item: any) => item.type === 'digital' || item.category === 'Backing Track')
      .map((item: any) => ({
        title: item.title,
        subtitle: item.subtitle,
        fileName: `${item.id}.wav`, // หรือ extension ที่ถูกต้อง
        downloadUrl: `/api/download-file/${item.id}?token=${params.token}`
      }));

    if (downloadItems.length === 0) {
      return notFound();
    }

    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] bg-black text-center">
        <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Downloads are Ready</h1>
        <p className="mb-7">Click the buttons below to download your files:</p>

        <div className="space-y-4 mb-8">
          {downloadItems.map((item: any, index: number) => (
            <a
              key={index}
              href={item.downloadUrl}
              download={item.fileName}
              className="block bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition max-w-md"
            >
              Download {item.title} - {item.subtitle}
            </a>
          ))}
        </div>

        <p className="text-xs mt-6 opacity-50">
          Links expire at: {expiresAt.toLocaleString()}
        </p>
        
        <a 
          href="https://unda-website.vercel.app"
          className="mt-4 text-[#dc9e63] hover:text-[#f8cfa3] underline"
        >
          ← Back to Store
        </a>
      </main>
    );

  } catch (error) {
    console.error('💥 Download page error:', error);
    return notFound();
  }
}