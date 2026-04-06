import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'data/engine_log.json');

export async function GET() {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return NextResponse.json({ entries: [], stats: { total: 0 } });
    }

    const entries: Array<{ ts: string; phase: string; status: string; msg: string }> =
      JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));

    // Compute stats
    const phaseCounts: Record<string, number> = {};
    const errors = entries.filter(e => e.status === 'ERROR').length;
    entries.forEach(e => {
      phaseCounts[e.phase] = (phaseCounts[e.phase] || 0) + 1;
    });

    // Last 50 entries for dashboard (most recent first)
    const recent = [...entries].reverse().slice(0, 50);

    return NextResponse.json({
      entries: recent,
      stats: {
        total: entries.length,
        errors,
        phaseCounts,
        lastRun: entries[entries.length - 1]?.ts || null,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, '[]', 'utf8');
    }
    return NextResponse.json({ success: true, message: 'Engine log cleared.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
