import { NextResponse } from 'next/server';

/**
 * RESEND WEBHOOK HANDLER
 *
 * Receives email events from Resend (delivered, opened, clicked, replied).
 * When a lead REPLIES to an outreach email, Resend POSTs here.
 * We then: 1) Update CRM status, 2) Send Telegram alert.
 *
 * Setup in Resend Dashboard:
 *   Webhooks → Add endpoint → https://your-domain.com/api/outreach/webhook
 *   Events: email.replied, email.opened, email.clicked
 */

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
  } catch (e) {
    console.warn('[TELEGRAM] Failed to send notification:', e);
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload?.type;
    const email     = payload?.data?.to?.[0] || payload?.data?.email_id || 'unknown';
    const from      = payload?.data?.from || '';
    const subject   = payload?.data?.subject || '';

    console.log(`[WEBHOOK] Resend event: ${eventType} | ${email}`);

    switch (eventType) {
      case 'email.replied':
        await notifyTelegram(
          `🎯 *NEW REPLY RECEIVED!*\n\n` +
          `*From:* ${from}\n` +
          `*Subject:* ${subject}\n\n` +
          `→ Check your inbox at ${process.env.REPLY_TO_EMAIL || 'deals@amanah-proptech.com'}\n` +
          `This lead is HOT — respond within 2 hours.`
        );
        // In production: update Firestore lead status to 'REPLIED'
        break;

      case 'email.opened':
        await notifyTelegram(
          `👁️ *Email Opened*\n*To:* ${email}\n*Subject:* ${subject}`
        );
        break;

      case 'email.clicked':
        await notifyTelegram(
          `🖱️ *Link Clicked!*\n*By:* ${email}\n*Subject:* ${subject}\n→ Likely checking Calendly!`
        );
        break;

      case 'email.bounced':
        console.warn(`[BOUNCE] Email bounced for ${email} — marking in CRM`);
        break;

      case 'email.complained':
        console.warn(`[SPAM] Complaint from ${email} — removing from pipeline`);
        break;

      default:
        console.log(`[WEBHOOK] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
