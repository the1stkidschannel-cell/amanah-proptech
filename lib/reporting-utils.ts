import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateAmanahPDF(data: any) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([595.28, 841.89]);

  const primaryColor = rgb(0.01, 0.17, 0.13); // #022c22
  const goldColor = rgb(0.77, 0.63, 0.35);    // #c5a059

  page.drawText('AMANAH PROPTECH', { x: 50, y: 780, size: 24, font: fontBold, color: primaryColor });
  page.drawText(data.title || 'Reporting', { x: 50, y: 755, size: 14, font, color: goldColor });
  page.drawLine({ start: { x: 50, y: 740 }, end: { x: 545, y: 740 }, thickness: 2, color: goldColor });

  let yOffset = 700;
  for (const item of data.items || []) {
    page.drawText(item.label, { x: 50, y: yOffset, size: 11, font });
    page.drawText(String(item.value), { x: 250, y: yOffset, size: 11, font: fontBold });
    yOffset -= 20;
  }

  return await pdfDoc.save();
}
