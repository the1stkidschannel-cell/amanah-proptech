import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getPropertyById } from '@/lib/firebase/properties';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed the Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Page 1: HERO & SUMMARY
    const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
    const primaryColor = rgb(0.01, 0.17, 0.13); // #022c22
    const goldColor = rgb(0.77, 0.63, 0.35);    // #c5a059
    const secondaryColor = rgb(0.96, 0.98, 0.96); // light mint

    // Design Elements (Bar)
    page1.drawRectangle({ x: 0, y: 800, width: 595, height: 41.89, color: primaryColor });
    page1.drawText('AMANAH PROPTECH | INVESTMENT EXPOSÉ', { x: 50, y: 815, size: 10, font: fontBold, color: goldColor });

    // Property Title
    page1.drawText(property.name.toUpperCase(), { x: 50, y: 740, size: 28, font: fontBold, color: primaryColor });
    page1.drawText(property.location, { x: 50, y: 715, size: 14, font, color: rgb(0.4, 0.4, 0.4) });
    
    // Summary Box
    page1.drawRectangle({ x: 50, y: 580, width: 495, height: 100, color: secondaryColor });
    page1.drawText('INVESTMENT SUMMARY', { x: 65, y: 655, size: 12, font: fontBold, color: primaryColor });
    
    const summaryItems = [
      { l: 'Asset-Typ:', v: property.type },
      { l: 'Ziel-Volumen:', v: `${property.targetVolume.toLocaleString('de-DE')} €` },
      { l: 'Rendite (Yield) p.a.:', v: `${property.yield.toFixed(2)}%` },
      { l: 'Sharia-Struktur:', v: property.shariaStructure || 'Ijarah' }
    ];

    let yLoc = 635;
    for (const item of summaryItems) {
      page1.drawText(item.l, { x: 65, y: yLoc, size: 10, font });
      page1.drawText(item.v, { x: 250, y: yLoc, size: 10, font: fontBold, color: primaryColor });
      yLoc -= 20;
    }

    // Page 2: ASSET DETAILS
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    page2.drawText('OBJEKTDATEN & ANALYSE', { x: 50, y: 780, size: 18, font: fontBold, color: primaryColor });
    page2.drawLine({ start: { x: 50, y: 770 }, end: { x: 545, y: 770 }, thickness: 1, color: goldColor });

    const assetDetails = [
      { l: 'Baujahr:', v: property.yearBuilt.toString() },
      { l: 'Wohnfläche:', v: `${property.livingArea} m²` },
      { l: 'Energieklasse:', v: property.energyRating || 'A+' },
      { l: 'Wohneinheiten:', v: property.units?.toString() || '1' },
      { l: 'Belegungsrate:', v: `${property.occupancyRate || 100}%` },
      { l: 'Holding Period:', v: property.holdingPeriod || '10 Jahre' }
    ];

    yLoc = 730;
    for (const d of assetDetails) {
      page2.drawText(d.l, { x: 50, y: yLoc, size: 11, font });
      page2.drawText(d.v, { x: 250, y: yLoc, size: 11, font: fontBold });
      yLoc -= 30;
    }

    // Legal / eWpG Footer
    const footerText = 'Dies ist ein unverbindliches Exposé. Investitionen unterliegen dem Risiko des Totalverlusts. Amanah PropTech ist vertraglich gebundener Vermittler.';
    page1.drawText(footerText, { x: 50, y: 30, size: 7, font, color: rgb(0.5, 0.5, 0.5) });
    page2.drawText(footerText, { x: 50, y: 30, size: 7, font, color: rgb(0.5, 0.5, 0.5) });

    // Finalize
    const pdfBytes = await pdfDoc.save();
    
    return new Response(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Amanah_Pitch_Deck_${property.name.replace(/\s+/g, '_')}.pdf"`
      },
    });

  } catch (error: any) {
    console.error('Pitch Deck PDF Error:', error);
    return NextResponse.json({ error: 'PDF generation failed: ' + error.message }, { status: 500 });
  }
}
