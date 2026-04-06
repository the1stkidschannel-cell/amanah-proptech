const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const GmailUser = process.env.GMAIL_USER;
const GmailPass = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GmailUser, pass: GmailPass }
});

const DRY_RUN = process.argv.includes('--dry-run');
const DAILY_SEND_LIMIT = parseInt(process.env.DAILY_SEND_LIMIT || '50', 10);
const DELAY_BETWEEN_MS = parseInt(process.env.DELAY_BETWEEN_MS || '3000', 10);
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'chaakhod@proton.me';

const LEADS_FILE = path.join(__dirname, '../data/leads.csv');
const SENT_LOG  = path.join(__dirname, '../data/sent_log.json');

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getGermanGreeting(fullName) {
  if (!fullName) return "Sehr geehrte Damen und Herren,";
  const parts = fullName.trim().split(' ');
  if (parts.length < 2) return `Sehr geehrte(r) Herr/Frau ${fullName},`;
  const firstName = parts[0].toLowerCase();
  const lastName = parts.slice(1).join(' ');
  const femaleNames = ['anna','maria','susanne','petra','sabine','katharina','julia','steffi','christina','laura','sarah','martina','andrea','silke','claudia','karin','nicole','stephanie','anja','barbara'];
  const maleNames = ['luca', 'sascha', 'mika', 'andrea', 'ilya', 'noa', 'bela'];
  const isFemale = femaleNames.includes(firstName) || (firstName.endsWith('a') && !maleNames.includes(firstName)) || firstName.endsWith('ie');
  return isFemale ? `Sehr geehrte Frau ${lastName},` : `Sehr geehrter Herr ${lastName},`;
}

function loadLeads() {
  if (!fs.existsSync(LEADS_FILE)) {
    console.log('[CRM] No leads.csv found.');
    return [];
  }
  const content = fs.readFileSync(LEADS_FILE, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)/g) || [];
    const lead = {};
    headers.forEach((h, i) => {
      lead[h] = values[i] ? values[i].replace(/"/g, '').trim() : '';
    });
    return lead;
  });
}

function loadSentLog() {
  if (!fs.existsSync(SENT_LOG)) return { sentEmails: [], lastRun: null, totalSent: 0 };
  try { return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')); }
  catch { return { sentEmails: [], lastRun: null, totalSent: 0 }; }
}

function saveSentLog(log) {
  const dir = path.dirname(SENT_LOG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SENT_LOG, JSON.stringify(log, null, 2), 'utf8');
}

function updateLeadStatus(email, status) {
  if (!fs.existsSync(LEADS_FILE)) return;
  let content = fs.readFileSync(LEADS_FILE, 'utf8');
  const lines = content.split('\n');
  const updated = lines.map(line => {
    if (line.includes(email)) return line.replace('"NEW"', `"${status}"`);
    return line;
  });
  fs.writeFileSync(LEADS_FILE, updated.join('\n'), 'utf8');
}

function buildEmailHTML(lead) {
  const isMENA = lead.Region === 'MENA';
  const greeting = isMENA ? `Dear ${lead.Name},` : getGermanGreeting(lead.Name);
  // Using a placeholder; please provide the exact Calendly link when ready
  const calLink = process.env.CALENDLY_LINK || 'https://calendly.com/amanah-proptech/strategic-partnership';

  const body = isMENA
    ? `
      <p>As the <strong>${lead.Position}</strong> at <strong>${lead.Company}</strong>, you recognize the critical need for 
      secure, Sharia-compliant diversification into European Core Real Estate.</p>
      <p>Amanah PropTech is currently developing an institutional-grade digital bridge (targeting a BaFin Tied-Agent setup). We utilize the German Electronic Securities Act (eWpG) 
      to tokenize Tier-1 commercial real estate into digital shares on the Polygon blockchain. 
      The physical objects will be managed by global partners like CBRE and JLL, while the Smart Contract executes an AAOIFI-certified Ijarah structure.</p>
      <p>We are currently onboarding strategic Institutional Partners for our Private Beta as we scale toward our €2.5B AUM target. 
      Partners receive early access to our proprietary White-Label SaaS Portal for seamless global allocation management.</p>
      <ul>
        <li>✅ Planned 100% BaFin Tied-Agent Compliance & Sharia-Certification</li>
        <li>✅ Access to Euro-DACH Core Assets via Polygon eWpG Tokens</li>
        <li>✅ Real-time API reporting from Tier-1 Property Managers</li>
      </ul>
      <p>I would like to invite you for a 15-minute strategic briefing to discuss potential synergies:</p>
    `
    : `
      <p>als <strong>${lead.Position}</strong> bei <strong>${lead.Company}</strong> suchen Sie nach 
      innovativen, regulierten Wegen zur Diversifikation von institutionellem Kapital.</p>
      <p>Amanah PropTech ist eine im Aufbau befindliche Tokenisierungs-Plattform, die gezielt europäische Core-Immobilien 
      für hochvolumiges, islamisches Kapital (MENA-Region) strukturiert – ein BaFin-Konzept als Tied Agent ist in Vorbereitung.</p>
      <p>Wir nutzen das Gesetz über elektronische Wertpapiere (eWpG), um die Asset-Klasse via Smart Contracts auf der Polygon-Blockchain in regulierte Krypto-Wertpapiere umzuwandeln.
      Zusammen mit Tier-1 Verwaltern (wie CBRE, JLL) bauen wir jetzt in unserer Private-Beta-Phase strategische Partnerschaften auf, um unser €2,5 Milliarden AUM-Ziel zu erreichen.</p>
      <ul>
        <li>✅ Geplante 100% BaFin-Regulation & eWpG-Konformität (Polygon Emission)</li>
        <li>✅ Zugang zu institutionellem Kapital aus dem Nahen Osten</li>
        <li>✅ Digitale Strukturierung in dedizierte SPVs</li>
      </ul>
      <p>Ich schlage ein kurzes 15-minütiges Onboarding-Gespräch vor, um eine mögliche Partnerschaft zu beleuchten:</p>
    `;

  return `
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
        <strong>Khoder Chaabou</strong><br/>
        Founder & CEO<br/>
        Amanah PropTech<br/>
        <em>For professional investors/partners only.</em>
      </p>
    </div>
  `;
}

async function runOutreach() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   AMANAH PROPTECH - GMAIL ENGINE         ║');
  console.log(`║   Mode: ${DRY_RUN ? 'DRY-RUN (Preview)      ' : 'LIVE (Gmail Active)        '}║`);
  console.log('╚══════════════════════════════════════════╝\n');

  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  // MO-FR (1-5), 08:00 - 18:00
  if (!process.argv.includes('--force') && (day === 0 || day === 6 || hour < 8 || hour >= 18)) {
    console.log(`[PAUSE] Aktuelle Uhrzeit (${now.toLocaleTimeString()}) ist ausserhalb der Geschäftszeiten (Mo-Fr 08:00-18:00). Bot pausiert zum Schutz der B2B Reputation.`);
    return { sent: 0, failed: 0 };
  }

  if (!GmailUser || !GmailPass) {
    console.error('[FATAL] GMAIL_USER or GMAIL_PASS is missing in .env.local');
    return;
  }

  const allLeads = loadLeads();
  const sentLog  = loadSentLog();
  const alreadySent = new Set(sentLog.sentEmails);

  const queue = allLeads.filter(l => l.Email && !alreadySent.has(l.Email) && (l.Status || '').toUpperCase() === 'NEW');

  console.log(`[CRM] DB: ${allLeads.length} | Contacted: ${alreadySent.size} | Queue: ${queue.length}\n`);

  if (queue.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  const runQueue = queue.slice(0, DAILY_SEND_LIMIT);

  for (const lead of runQueue) {
    console.log(`[→] Targeting: ${lead.Company} · ${lead.Name}`);
    
    if (DRY_RUN) {
      console.log(`   [✓] DRY-RUN OK → ${lead.Email}`);
      sent++;
    } else {
      try {
        const subject = lead.Region === 'MENA' 
          ? `Islamic Finance: Accessing German Real Estate via eWpG Tokenization` 
          : `Institutional Real Estate Tokenization (DACH) – Core Access for ${lead.Company}`;

        await transporter.sendMail({
          from: `"Amanah PropTech" <${GmailUser}>`,
          to: lead.Email,
          replyTo: REPLY_TO,
          subject,
          html: buildEmailHTML(lead),
        });

        console.log(`   [✓] SENT → ${lead.Email}`);
        alreadySent.add(lead.Email);
        updateLeadStatus(lead.Email, 'CONTACTED');
        sent++;
      } catch (err) {
        console.error(`   [✗] Error for ${lead.Email}: ${err.message}`);
        failed++;
      }
    }
    if (sent < runQueue.length) await sleep(DELAY_BETWEEN_MS);
  }

  sentLog.sentEmails = [...alreadySent];
  sentLog.lastRun = new Date().toISOString();
  sentLog.totalSent = (sentLog.totalSent || 0) + (DRY_RUN ? 0 : sent);
  saveSentLog(sentLog);

  console.log(`\n[COMPLETE] Sent: ${sent} | Failed: ${failed} | Total Managed: ${sentLog.totalSent}\n`);
}

if (require.main === module) {
  runOutreach().catch(console.error);
}

module.exports = { runOutreach };
