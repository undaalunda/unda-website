// /app/download/[token]/page.tsx

import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

interface DownloadEntry {
  token: string;
  filePath: string;
  createdAt: string;
  expiresInMinutes: number;
}

export default async function DownloadPage({ params }: { params: { token: string } }) {
  const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');

  let entries: DownloadEntry[] = [];
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    entries = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read downloads.json', err);
    return notFound();
  }

  const entry = entries.find(e => e.token === params.token);

  if (!entry) return notFound();

  const createdAt = new Date(entry.createdAt);
  const expiresAt = new Date(createdAt.getTime() + entry.expiresInMinutes * 60000);
  const now = new Date();

  if (now > expiresAt) return notFound();

  const fileName = entry.filePath.split('/').pop();

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 text-[#f8fcdc] font-[Cinzel] bg-black text-center">
      <h1 className="text-4xl font-bold mb-8 text-[#dc9e63]">Your Download is Ready</h1>
      <p className="mb-7">Click the button below to download your file:</p>

      <a
        href={entry.filePath}
        download={fileName}
        className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black px-6 py-3 rounded-xl text-lg transition"
      >
        Download {fileName}
      </a>

      <p className="text-xs mt-6 opacity-50">Link expires at: {expiresAt.toLocaleString()}</p>
    </main>
  );
}
