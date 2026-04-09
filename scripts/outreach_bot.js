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
      <p>institutionelles Kapital aus dem islamischen Raum sucht zunehmend nach Wegen in den deutschen Immobilienmarkt, scheitert jedoch oft am Fehlen Sharia-konformer Strukturen (Stichwort: Zinsansprüche in den Kapitalstrukturen) oder an hochkomplexen SPV-Gründungen.</p>
      <p>Mit <strong>Amanah PropTech</strong> bauen wir aktuell eine spezialisierte B2B-Technologieplattform auf, die genau dieses Problem technologisch löst.</p>
      <p>Wir arbeiten an einem Asset-Light Broker-Modell, das den direkten Zugang zu Off-Market Core-Immobilien (DACH) ermöglicht. Perspektivisch planen wir perspektivisch eine 100% Sharia-konforme Umsetzung (mittels Ijarah / Diminishing Musharakah Konstrukten), angebunden an das deutsche Gesetz über elektronische Wertpapiere (eWpG).</p>
      <p>Derzeit befindet sich unsere Infrastruktur in der <strong>Pilotphase / MVP-Demonstration</strong>. Das bedeutet: Wir testen die Blockchain-Abwicklung (Kryptowertpapierregister) aktuell im simulierten Umfeld, um eine lückenlose, riba-freie Tokenisierung für unsere zukünftigen regulierten White-Label Partner aufzusetzen.</p>
      <p><strong>Unsere Zielsetzung für den Marktstart:</strong></p>
      <ul style="padding-left: 20px;">
        <li>🔹 Vorbereitung zur Auflage tokenisierter, Sharia-konformer Core-Assets</li>
        <li>🔹 Vermeidung teurer SPV-Mantelstrukturen durch direkten eWpG-Bezug</li>
        <li>🔹 Bereitstellung eines institutionellen B2B SaaS-Dashboards zur simplen Portfolio-Kontrolle</li>
      </ul>
      <p>Wir befinden uns in einer frühen Aufbau- und Validierungsphase und sprechen derzeit exklusiv mit ausgewählten Family Offices über Anforderungen und zukünftige strategische Partnerschaften.</p>
      <p>Ich würde Sie sehr gerne zu einem 15-minütigen strategischen Briefing einladen, um Ihnen unser Pilot-Projekt vorzustellen:</p>
    `
    : `
      <p>institutionelles Kapital aus dem islamischen Raum sucht zunehmend nach effizienten Wegen in den deutschen Immobilienmarkt. Oft scheitert dies jedoch an fehlender Sharia-Konformität oder langwierigen SPV-Strukturen.</p>
      <p>Mit <strong>Amanah PropTech</strong> entwickeln wir aktuell eine B2B-Technologieplattform, die als Brücke fungieren soll.</p>
      <p>Unser Ziel ist der Aufbau eines Asset-Light Tech-Brokers, der perspektivisch Off-Market Core-Immobilien der DACH-Region an institutionelle Investoren vermittelt. Dabei fokussieren wir uns auf Sharia-konforme Abläufe und prüfen derzeit die Umsetzung unter dem deutschen eWpG-Rahmen (Gesetz über elektronische Wertpapiere).</p>
      <p><strong>Aktueller Status (MVP / Pilotphase):</strong></p>
      <p>Unsere Plattform und die damit verbundene Tokenisierungs-Infrastruktur befinden sich aktuell in der technologischen Evaluierung. Wir simulieren die Abwicklung von Immobilien-Anteilen, um in Zukunft gemeinsam mit regulierten BaFin-Partnern reibungslose White-Label-Transaktionen zu ermöglichen.</p>
      <ul style="padding-left: 20px;">
        <li>🔹 Konzipierung eines 100% zinsfreien (Riba-freien) Deal-Setups (Ijarah / Diminishing Musharakah)</li>
        <li>🔹 Reduzierung rechtlicher Komplexität durch geplante eWpG-Strukturierung</li>
        <li>🔹 Entwicklung eines institutionellen B2B SaaS-Dashboards (Private Beta)</li>
      </ul>
      <p>Da wir aktuell unser institutionelles Netzwerk für zukünftige Partnerschaften aufbauen, würde ich mich sehr über Ihre Einschätzung aus Perspektive Ihres Hauses freuen.</p>
      <p>Gerne stelle ich Ihnen unser Vorhaben in einem 15-minütigen Briefing kurz vor:</p>
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
  // MO-FR (1-5), 09:00 - 15:00
  if (!process.argv.includes('--force') && (day === 0 || day === 6 || hour < 9 || hour >= 15)) {
    console.log(`[PAUSE] Aktuelle Uhrzeit (${now.toLocaleTimeString()}) ist ausserhalb der Geschäftszeiten (Mo-Fr 09:00-15:00). Bot pausiert zum Schutz der B2B Reputation.`);
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
