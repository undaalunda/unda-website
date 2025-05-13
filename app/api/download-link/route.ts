// /api/download-link/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'downloads.json');

interface DownloadEntry {
  token: string;
  filePath: string;
  createdAt: string;
  expiresInMinutes: number;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filePath } = body;

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  const token = uuidv4();
  const entry: DownloadEntry = {
    token,
    filePath,
    createdAt: new Date().toISOString(),
    expiresInMinutes: 60,
  };

  let existing: DownloadEntry[] = [];
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }

  existing.push(entry);
  await fs.writeFile(DB_PATH, JSON.stringify(existing, null, 2));

  return NextResponse.json({ token });
}
