// app/download/[token]/page.tsx

import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await params เพราะใน Next.js 15 params เป็น Promise
  const { token } = await params;

  try {
    // Decode token เพื่อดึง filePath
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const { filePath, createdAt } = decoded;

    // ตรวจสอบว่า token หมดอายุหรือยัง (1 ชั่วโมง)
    const created = new Date(createdAt);
    const now = new Date();
    const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreated > 1) {
      console.log('Token expired');
      return notFound();
    }

    const fileName = filePath.split('/').pop();
    const expiresAt = new Date(created.getTime() + 60 * 60 * 1000); // 1 hour from creation

    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] bg-black text-center">
        <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Download is Ready</h1>
        <p className="mb-7">Click the button below to download your file:</p>

        <a
          href={filePath}
          download={fileName}
          className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
        >
          Download {fileName}
        </a>

        <p className="text-xs mt-6 opacity-50">
          Link expires at: {expiresAt.toLocaleString()}
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
    console.error('Invalid token:', error);
    return notFound();
  }
}