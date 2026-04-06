const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Destructure from outreach_bot to reuse the exact same template logic
const { buildEmailHTML } = require('./outreach_bot');

async function sendTestEmail(targetEmail) {
  const GmailUser = process.env.GMAIL_USER;
  const GmailPass = process.env.GMAIL_PASS;

  if (!GmailUser || !GmailPass) {
    console.error('❌ GMAIL_USER or GMAIL_PASS missing in .env.local');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GmailUser, pass: GmailPass }
  });

  // Mock a MENA Tier-1 Lead
  const mockLead = {
    Name: 'Tariq Al-Test',
    Company: 'Qatar Investment Authority (Simulation)',
    Position: 'Head of Alternatives',
    Region: 'MENA',
    Email: targetEmail
  };

  const subject = `Institutional Private Beta: Strategic Partnership with ${mockLead.Company}`;

  // We need to temporarily extract buildEmailHTML or duplicate it here if it's not exported.
  // Since we didn't export buildEmailHTML in outreach_bot.js, we'll duplicate the logic for the test
  // to ensure 100% fidelity. Actually, I'll require it if I export it. Let's just define a mock HTML string or redefine it to be safe.
  
  const isMENA = mockLead.Region === 'MENA';
  const greeting = isMENA ? `Dear ${mockLead.Name},` : `Sehr geehrte(r) ${mockLead.Name},`;
  const calLink = process.env.CALENDLY_LINK || 'https://calendly.com/amanah-proptech/strategic-partnership';

  const body = `
      <p>As the <strong>${mockLead.Position}</strong> at <strong>${mockLead.Company}</strong>, you recognize the critical need for 
      secure, Sharia-compliant diversification into European Core Real Estate.</p>
      <p>Amanah PropTech is currently developing an institutional-grade digital bridge (targeting BaFin Tied-Agent setup). We utilize the German Electronic Securities Act (eWpG) 
      to tokenize Tier-1 commercial real estate (managed by global partners like CBRE and JLL) using an AAOIFI-certified Ijarah structure.</p>
      <p>We are currently onboarding strategic Institutional Partners for our Private Beta as we scale toward our €2.5B AUM target. 
      Partners receive access to our proprietary White-Label SaaS Portal for seamless allocation management.</p>
      <ul>
        <li>✅ Planned 100% BaFin Tied-Agent Compliance & Sharia-Certification</li>
        <li>✅ Access to Euro-DACH Core Assets via dedicated SPVs</li>
        <li>✅ Real-time API reporting from Tier-1 Property Managers</li>
      </ul>
      <p>I would like to invite you for a 15-minute strategic briefing to discuss potential synergies:</p>
  `;

  const finalHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1a1a1a; max-width: 600px; line-height: 1.6;">
      <h2 style="color: #03362a; margin-bottom: 5px;">Amanah PropTech</h2>
      <p style="font-size: 12px; color: #c5a059; font-weight: bold; letter-spacing: 1px; margin-top: 0;">INSTITUTIONAL PRIVATE BETA</p>
      <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;" />
      <p>${greeting}</p>
      ${body}
      <div style="margin: 35px 0;">
        <a href="${calLink}" style="background: #111; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          📅 Schedule 15-Min Briefing
        </a>
      </div>
      <p style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
        Amanah PropTech Institutional Relations<br/>
        amanah.proptech@gmail.com<br/>
        <em>For professional investors/partners only.</em>
      </p>
    </div>
  `;

  console.log(`\n🚀 Sending Simulation Email to: ${targetEmail}`);
  console.log(`📬 Subject: ${subject}\n`);

  try {
    await transporter.sendMail({
      from: `"Amanah PropTech" <${GmailUser}>`,
      to: targetEmail,
      replyTo: process.env.REPLY_TO_EMAIL || 'deals@amanah-proptech.com',
      subject,
      html: finalHtml,
    });
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY. Please check your inbox.');
    console.log('👉 Verify the Calendly Link and the new "Strategic Partner" messaging.');
  } catch (err) {
    console.error('❌ Failed to send:', err.message);
  }
}

const target = process.argv[2];
if (!target) {
  console.error('Usage: node test_outreach.js <your-email@example.com>');
  process.exit(1);
}

sendTestEmail(target);
