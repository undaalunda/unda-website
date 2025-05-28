// app/download/[token]/page.tsx

import { notFound } from 'next/navigation';
import supabase from '../../../lib/supabase';

interface PageProps {
  params: {
    token: string;
  };
}

interface DownloadEntry {
  id: string;
  file_path: string;
  created_at: string;
  expires_in_minutes: number;
}

export default async function Page({ params }: PageProps) {
  const token = params.token;

  const { data: entry, error } = await supabase
    .from('DownloadTokens')
    .select('*')
    .eq('id', token)
    .single();

  if (error || !entry) {
    console.error('❌ Supabase error or token not found:', error ?? 'Not found');
    return notFound();
  }

  const createdAt = new Date(entry.created_at);
  const expiresAt = new Date(createdAt.getTime() + entry.expires_in_minutes * 60000);
  const now = new Date();

  if (now > expiresAt) {
    console.warn(`⚠️ Token expired at ${expiresAt.toISOString()}`);
    return notFound();
  }

  const fileName = entry.file_path.split('/').pop() || 'download';

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] bg-black text-center">
      <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Download is Ready</h1>
      <p className="mb-7">Click the button below to download your file:</p>

      <a
        href={entry.file_path}
        download={fileName}
        className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
      >
        Download {fileName}
      </a>

      <p className="text-xs mt-6 opacity-50">
        Link expires at: {expiresAt.toLocaleString()}
      </p>
    </main>
  );
}