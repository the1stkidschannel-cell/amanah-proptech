import { NextResponse } from "next/server";

// In production, you would use a service like Resend or SendGrid
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, template, data } = await req.json();

    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, template)" },
        { status: 400 }
      );
    }

    let htmlContent = "";

    // Simulated Template Engine
    switch (template) {
      case "welcome_kyc":
        htmlContent = `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h1 style="color: #03362a;">Willkommen bei Amanah PropTech</h1>
            <p>Ihre KYC-Verifizierung war erfolgreich. Sie können nun in Halal-Immobilien investieren.</p>
            <a href="https://amanah-proptech.com/invest" style="display: inline-block; padding: 12px 24px; background-color: #c5a059; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">Zum Primärmarkt</a>
          </div>
        `;
        break;
      case "investment_confirmation":
        htmlContent = `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h1 style="color: #03362a;">Investment Bestätigung</h1>
            <p>Alhamdulillah, Ihr Investment über ${data?.amount} € in das Projekt ${data?.project} wurde erfolgreich verarbeitet.</p>
            <p>Ihre ${data?.tokens} Token befinden sich nun in Ihrem Halal Wallet.</p>
          </div>
        `;
        break;
      case "waitlist_invite":
        htmlContent = `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h1 style="color: #03362a;">VIP Zugang freigeschaltet</h1>
            <p>Gute Neuigkeiten! Sie wurden von der Warteliste für den VIP-Zugang freigeschaltet.</p>
            <a href="https://amanah-proptech.com/onboarding" style="display: inline-block; padding: 12px 24px; background-color: #c5a059; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">Jetzt KYC abschließen & Investieren</a>
          </div>
        `;
        break;
      default:
        htmlContent = `<p>${data?.message || "Neue Benachrichtigung von Amanah PropTech."}</p>`;
    }

    // Mock sending email
    console.log("================ MOCK EMAIL SENT ================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${template}`);
    console.log(`Content length: ${htmlContent.length} bytes`);
    console.log("=================================================");

    /* Production code:
    await resend.emails.send({
      from: 'Amanah PropTech <noreply@amanah-proptech.com>',
      to,
      subject,
      html: htmlContent,
    });
    */

    return NextResponse.json({ success: true, message: "Email triggered successfully" });
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
