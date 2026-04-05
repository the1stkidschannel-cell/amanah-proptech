import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const { txId, type, user, amount, asset, date } = await request.json();

    if (!txId) return NextResponse.json({ error: "Missing TxID" }, { status: 400 });

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed the Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add a page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    
    // Colors
    const primaryColor = rgb(0.01, 0.17, 0.13); // #022c22
    const goldColor = rgb(0.77, 0.63, 0.35);    // #c5a059
    
    // Header
    page.drawText('AMANAH PROPTECH', { x: 50, y: 780, size: 24, font: fontBold, color: primaryColor });
    page.drawText('eWpG Kryptowertpapier-Bestätigung', { x: 50, y: 755, size: 14, font, color: goldColor });
    page.drawLine({ start: { x: 50, y: 740 }, end: { x: 545, y: 740 }, thickness: 2, color: goldColor });

    // Client Info
    page.drawText('Ausgestellt für:', { x: 50, y: 700, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(user || 'Halal Investor', { x: 50, y: 685, size: 12, font: fontBold });
    
    // Transaction Details
    page.drawText('Transaktionsdetails', { x: 50, y: 630, size: 14, font: fontBold, color: primaryColor });
    
    const details = [
      { label: 'Transaktions-ID:', value: txId },
      { label: 'Datum:', value: date || new Date().toLocaleDateString('de-DE') },
      { label: 'Asset (Zweckgesellschaft):', value: asset || 'Immobilien Token' },
      { label: 'Typ:', value: type === 'buy' ? 'Kauf (Token-Schöpfung)' : 'Ijarah (Miet-Ausschüttung)' },
      { label: 'Betrag:', value: amount || '0,00' }
    ];

    let yOffset = 590;
    for (const d of details) {
      page.drawText(d.label, { x: 50, y: yOffset, size: 12, font });
      page.drawText(d.value, { x: 250, y: yOffset, size: 12, font: fontBold });
      yOffset -= 25;
    }

    // eWpG Compliance Block
    page.drawRectangle({ x: 50, y: yOffset - 80, width: 495, height: 100, color: rgb(0.96, 0.98, 0.96) });
    page.drawText('Rechtlicher Hinweis (BaFin & eWpG)', { x: 60, y: yOffset - 15, size: 12, font: fontBold, color: primaryColor });
    page.drawText(
      'Dieses Dokument bestätigt die rechtmaessige Eintragung im Kryptowertpapierregister\n' +
      'gemaess Gesetz ueber elektronische Wertpapiere (eWpG). Vorbehaltlich der AAOIFI\n' +
      'Compliance Standards ist das Eigentum kryptografisch auf der Blockchain\n' + 
      '(Polygon Netzwerk) gesichert.',
      { x: 60, y: yOffset - 35, size: 10, font, color: rgb(0.3, 0.3, 0.3), lineHeight: 14 }
    );

    // Footer
    page.drawText('Amanah PropTech GmbH - BaFin lizenziertes Institut i.G. - Sharia Compliant', { x: 50, y: 50, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert bytes to base64
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    
    return NextResponse.json({ 
      success: true, 
      pdfBase64: base64Pdf,
      filename: `Amanah_eWpG_Zertifikat_${txId.substring(0, 8)}.pdf`
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'PDF Generation failed: ' + error.message }, { status: 500 });
  }
}
