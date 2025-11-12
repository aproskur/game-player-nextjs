// app/api/submit/route.js
import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const action = body?.action ?? 'StartGame';

  // Example: serve a JSON file for StartGame, compute updates for Clicked
  if (action === 'StartGame') {
    const file = path.join(process.cwd(), 'src', 'app', 'data', 'screen_s1.json');
    const raw = await fs.readFile(file, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  }

  if (action === 'Clicked') {

    return NextResponse.json({
      updates: {
        score: { value: 42 } 
      }
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
