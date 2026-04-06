const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

const EMAILS_FILE = path.join(__dirname, '../../emails_to_send.txt');
const LOG_FILE = path.join(__dirname, '../data/priority_sent_log.json');

async function sendEmail({ to, subject, html, from, reply_to }) {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] To: ${to} | Subject: ${subject}`);
    return { success: true, id: 'dry-run-id' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'Amanah PropTech <outreach@amanah-proptech.com>', // Default institutional sender
        to,
        reply_to: reply_to || 'chaakhod@proton.me',
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (response.ok) return { success: true, id: data.id };
    return { success: false, error: data.message || 'Unknown error' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function parseEmails() {
  const content = fs.readFileSync(EMAILS_FILE, 'utf8');
  const sections = content.split('---').map(s => s.trim()).filter(s => s);
  
  return sections.map(section => {
    const lines = section.split('\n');
    const to = lines.find(l => l.startsWith('**An:**'))?.replace('**An:**', '').trim();
    const subject = lines.find(l => l.startsWith('**Betreff:**'))?.replace('**Betreff:**', '').trim();
    
    // Find body (everything after the subject line)
    const bodyStartIndex = lines.findIndex(l => l.startsWith('**Betreff:**')) + 1;
    const body = lines.slice(bodyStartIndex).join('\n').trim()
      .replace(/\*\*/g, '') // remove bold markers for email
      .replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>'); // simple HTML formatting
      
    // Determine sender based on signature
    let fromName = 'Khoder Chaabou';
    if (section.includes('Sarah Chaabou')) fromName = 'Sarah Chaabou';
    
    return { to, subject, body, fromName };
  });
}

async function run() {
  console.log('🚀 Starting Priority Outreach...');
  if (!RESEND_API_KEY && !DRY_RUN) {
    console.error('❌ Error: RESEND_API_KEY missing in .env.local');
    process.exit(1);
  }

  const emails = parseEmails();
  console.log(`Parsed ${emails.length} priority emails.\n`);

  const results = [];

  for (const email of emails) {
    console.log(`Sending to ${email.to}...`);
    const res = await sendEmail({
      to: email.to,
      subject: email.subject,
      html: `<div>${email.body}</div>`,
      from: `${email.fromName} | Amanah PropTech <outreach@amanah-proptech.com>`
    });

    if (res.success) {
      console.log(`✅ Success: ${email.to}`);
      results.push({ to: email.to, status: 'SENT', id: res.id, date: new Date().toISOString() });
    } else {
      console.error(`❌ Failed: ${email.to} - ${res.error}`);
      results.push({ to: email.to, status: 'FAILED', error: res.error, date: new Date().toISOString() });
    }
    
    // Tiny delay
    await new Promise(r => setTimeout(r, 1000));
  }

  // Log results
  if (!fs.existsSync(path.dirname(LOG_FILE))) fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  const existingLogs = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')) : [];
  fs.writeFileSync(LOG_FILE, JSON.stringify([...existingLogs, ...results], null, 2));

  console.log(`\nDone. ${results.filter(r => r.status === 'SENT').length} sent, ${results.filter(r => r.status === 'FAILED').length} failed.`);
}

run().catch(console.error);
