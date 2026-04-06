import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc, addDoc, query, where } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'data/leads.csv');

export async function GET() {
  try {
    if (db) {
      const q = query(collection(db, "leads"));
      const snapshot = await getDocs(q);
      const dbLeads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbLeads.length > 0) return NextResponse.json(dbLeads);
    }

    // Fallback to leads.csv
    if (fs.existsSync(CSV_PATH)) {
      const content = fs.readFileSync(CSV_PATH, 'utf8');
      const lines = content.split('\n').filter(l => l.trim() !== '');
      const headers = lines[0].split(',').map(h => h.trim());
      const csvLeads = lines.slice(1).map((line, idx) => {
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const lead: any = { id: `csv-${idx}` };
        headers.forEach((h, i) => {
          lead[h] = values[i] ? values[i].replace(/"/g, '') : '';
        });
        return lead;
      });
      return NextResponse.json(csvLeads);
    }

    return NextResponse.json([]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, leadId, status, data } = await request.json();
    if (!db || !action) return NextResponse.json({ error: "Missing config" }, { status: 400 });

    if (action === 'update_status' && leadId) {
      await updateDoc(doc(db, "leads", leadId), { status, lastContacted: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    if (action === 'add_lead') {
      const newRef = await addDoc(collection(db, "leads"), { ...data, createdAt: new Date().toISOString() });
      return NextResponse.json({ success: true, id: newRef.id });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
