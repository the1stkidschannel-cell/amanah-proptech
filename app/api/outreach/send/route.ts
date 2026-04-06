import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';

// Lazy-load Resend to prevent build-time crashes when API key is missing
const getResend = () => new Resend(process.env.RESEND_API_KEY || 're_123');
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'deals@amanah-proptech.com';
const CALENDLY = process.env.CALENDLY_LINK  || 'https://calendly.com/amanah-proptech/15min';

/** Send a Telegram alert when a high-value lead is contacted */
async function notifyTelegram(msg: string) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
    });
  } catch {}
}


const COMPLIANCE_DISCLAIMER = `
<br/><br/>
<span style="font-size:11px; color: #888;">
---<br/>
Amanah PropTech ist ein Technologieanbieter und vertraglich gebundener Vermittler (Tied Agent)<br/>
Allänlagevermittlungen unter Haftung unseres lizenzierten White-Label-Partners.<br/>
This message may contain confidential information intended for institutional investors only.
</span>
`;

function buildEmailHTML(lead: {
  name: string;
  company: string;
  position: string;
  region: string;
  calendlyLink: string;
}) {
  const isMENA = lead.region === 'MENA';

  const greeting = isMENA
    ? `Salam ${lead.name},`
    : `Sehr geehrte(r) ${lead.name},`;

  const body = isMENA
    ? `
      <p>Als <strong>${lead.position}</strong> bei <strong>${lead.company}</strong> wissen Sie, 
      wie wertvoll Sharia-konforme, sachwertgesicherte Allokationen in erstklassige europäische Immobilien sind.</p>
      <p>Amanah PropTech bietet Ihnen direkten, vollständig regulierten Zugang zu tokenisierten deutschen Core-Immobilien 
      mit einer Zielrendite von <strong>4–6% p.a. (Ijarah)</strong> – vollständig eWpG-konform und BaFin-reguliert.</p>
      <ul>
        <li>✅ Sharia-Zertifizierung durch unabhängigen Scholars Board</li>
        <li>✅ Tokenisierung auf Basis des deutschen eWpG-Gesetzes</li>
        <li>✅ Mindestallokation: €500.000 · Dedicated SPV-Struktur</li>
      </ul>
      <p>Für ein kurzes Briefing (15 Minuten) stehe ich Ihnen gerne zur Verfügung:</p>
    `
    : `
      <p>als <strong>${lead.position}</strong> bei <strong>${lead.company}</strong> sind Sie 
      stets auf der Suche nach liquiden, sachwertbesicherten Allokationen im regulierten Rahmen.</p>
      <p>Amanah PropTech bietet den ersten vollständig regulierten Zugang zu tokenisierten Core-Immobilien 
      in Deutschland – <strong>eWpG-konform, BaFin-strukturiert und Sharia-zertifiziert</strong>.</p>
      <ul>
        <li>✅ Zielrendite: 4,8–6,2% p.a. (Net Ijarah Yield)</li>
        <li>✅ Mindestallokation: €500.000 · Institutional SPV</li>
        <li>✅ White-Label Due-Diligence-Datenraum verfügbar</li>
      </ul>
      <p>Ich schlage ein kurzes Onboarding-Gespräch vor:</p>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 24px; background: #f8f7f4; color: #1a1a1a;">
      <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.07);">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #c5a059; padding-bottom: 20px; margin-bottom: 28px;">
          <h2 style="color: #03362a; font-size: 22px; margin: 0 0 4px 0;">Amanah PropTech</h2>
          <p style="color: #c5a059; margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
            SHARIA-COMPLIANT REAL ESTATE · TOKENIZED · BAFIN-REGULATED
          </p>
        </div>

        <!-- Greeting & Body -->
        <p style="color: #1a1a1a; font-size: 15px; line-height: 1.7;">${greeting}</p>
        <div style="color: #333; font-size: 15px; line-height: 1.75;">${body}</div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${lead.calendlyLink}" 
             style="background: linear-gradient(135deg, #c5a059, #b08d48); color: white; 
                    padding: 14px 36px; border-radius: 8px; text-decoration: none; 
                    font-weight: 700; font-size: 15px; display: inline-block;
                    box-shadow: 0 4px 15px rgba(197, 160, 89, 0.35);">
            📅 15-Min Briefing buchen
          </a>
        </div>

        <!-- Signature -->
        <div style="border-top: 1px solid #e8e4dc; padding-top: 24px; margin-top: 8px;">
          <p style="margin: 0; font-weight: 700; color: #03362a;">Amanah PropTech · Institutional Relations</p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #666;">
            deals@amanah-proptech.com · amanah-proptech.com
          </p>
        </div>
        
        ${COMPLIANCE_DISCLAIMER}
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lead, dryRun = false } = body;

    if (!lead?.email || !lead?.name) {
      return NextResponse.json({ error: 'Missing lead data (email, name required)' }, { status: 400 });
    }

    const isMENA = lead.region === 'MENA';
    const subject = isMENA
      ? `Islamic Finance: Accessing German Real Estate via eWpG Tokenization`
      : `Sharia-konforme Immobilien (DACH) – Tokenisierter Core-Zugang für ${lead.company}`;

    const htmlContent = buildEmailHTML({
      name: lead.name,
      company: lead.company || 'Ihrem Unternehmen',
      position: lead.position || 'Investment Director',
      region: lead.region || 'DACH',
      calendlyLink: process.env.CALENDLY_LINK || 'https://calendly.com/amanah-proptech/15min',
    });

    if (dryRun) {
      console.log(`[DRY-RUN] Would send to: ${lead.email} | Subject: ${subject}`);
      return NextResponse.json({ success: true, dryRun: true, to: lead.email, subject });
    }

    // Live send via Resend
    const { data, error } = await getResend().emails.send({
      from: 'Amanah PropTech <deals@amanah-proptech.com>',
      to: [lead.email],
      replyTo: REPLY_TO,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('[RESEND ERROR]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to Firestore CRM
    if (db) {
      try {
        // Check if lead exists, update it
        const q = query(collection(db, 'leads'), where('email', '==', lead.email));
        const existing = await getDocs(q);
        if (!existing.empty) {
          await updateDoc(doc(db, 'leads', existing.docs[0].id), {
            status: 'CONTACTED',
            lastContacted: new Date().toISOString(),
            resendId: data?.id,
          });
        } else {
          await addDoc(collection(db, 'leads'), {
            ...lead,
            status: 'CONTACTED',
            lastContacted: new Date().toISOString(),
            resendId: data?.id,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn('[CRM SYNC WARNING]', dbErr);
      }
    }

    // Telegram notification
    await notifyTelegram(
      `✅ *Outreach sent*\n*To:* ${lead.name} @ ${lead.company}\n*Email:* ${lead.email}\n*Region:* ${lead.region || 'DACH'}\n*Resend ID:* ${data?.id}`
    );

    return NextResponse.json({ success: true, resendId: data?.id, to: lead.email });

  } catch (error: any) {
    console.error('[OUTREACH SEND ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Returns outreach stats
export async function GET() {
  if (!db) return NextResponse.json({ contacted: 0, pending: 0, replied: 0 });
  try {
    const snap = await getDocs(collection(db, 'leads'));
    const leads = snap.docs.map(d => d.data());
    return NextResponse.json({
      total: leads.length,
      contacted: leads.filter(l => l.status === 'CONTACTED').length,
      pending: leads.filter(l => l.status === 'NEW').length,
      replied: leads.filter(l => l.status === 'REPLIED').length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
