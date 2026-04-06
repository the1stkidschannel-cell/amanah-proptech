import { NextResponse } from 'next/server';
import { generateAmanahPDF } from '@/lib/reporting-utils';

export async function GET() {
  // Simulate historical reports for BaFin audits
  return NextResponse.json([
    { id: "REP-001", date: "2026-03-01", type: "Quarterly Audit", status: "Certified" },
    { id: "REP-002", date: "2026-04-05", type: "Sharia Compliance Trace", status: "Signed" }
  ]);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.txId) return NextResponse.json({ error: "Missing TxID" }, { status: 400 });

    const pdfBytes = await generateAmanahPDF({
      title: "eWpG Token Certification",
      items: [
        { label: "Transaction ID:", value: data.txId },
        { label: "Asset:", value: data.asset || "Amanah Token" },
        { label: "Yield (Ijarah):", value: data.yield || "0%" },
        { label: "Status:", value: "BLOCKCHAIN_VERIFIED" }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      pdfBase64: Buffer.from(pdfBytes).toString('base64')
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Reporting failed: ' + error.message }, { status: 500 });
  }
}
