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
const SENT_LOG = path.join(__dirname, '../data/sent_log.json');
const CORRECTION_LOG = path.join(__dirname, '../data/correction_sent_log.json');

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
  if (!fs.existsSync(LEADS_FILE)) return [];
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
  if (!fs.existsSync(SENT_LOG)) return { sentEmails: [] };
  try { return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')); }
  catch { return { sentEmails: [] }; }
}

function loadCorrectionLog() {
  if (!fs.existsSync(CORRECTION_LOG)) return { sentEmails: [], lastRun: null, totalSent: 0 };
  try { return JSON.parse(fs.readFileSync(CORRECTION_LOG, 'utf8')); }
  catch { return { sentEmails: [], lastRun: null, totalSent: 0 }; }
}

function saveCorrectionLog(log) {
  fs.writeFileSync(CORRECTION_LOG, JSON.stringify(log, null, 2), 'utf8');
}

function buildCorrectionHTML(lead) {
  const isMENA = lead.Region === 'MENA';
  const greeting = isMENA ? `Dear ${lead.Name},` : getGermanGreeting(lead.Name);
  const calLink = process.env.CALENDLY_LINK || 'https://calendly.com/amanah-proptech/30min';

  const body = isMENA
    ? `
      <p>I am reaching out to provide a transparent clarification regarding our recent correspondence regarding Amanah PropTech.</p>
      <p>In a previous technological test sequence, our automated system dispatched an email that incorrectly stated our platform was "100% BaFin Regulated" and possessed an active Tied-Agent status. <strong>This was a factual error.</strong></p>
      <p>Amanah PropTech is currently in an <strong>early MVP (Minimum Viable Product) phase</strong>. We possess no BaFin license and are providing no financial services at this time. Our status as a BaFin Tied-Agent is strictly in the planning and development stage.</p>
      <p>As the ${lead.Position} at ${lead.Company}, we value absolute transparency and compliance when addressing prospective institutional partners. The previously mentioned eWpG asset tokenization and Ijarah dashboards represent our <strong>technological demonstration</strong> capabilities and intended future state.</p>
      <p>I would like to personally apologize for any confusion this automated error may have caused.</p>
      <p>If you remain interested in exploring our technological framework and future roadmap for institutional Real Estate digitization, I would be pleased to schedule a brief call.</p>
    `
    : `
      <p>ich wende mich an Sie, um eine Richtigstellung bezüglich unserer vorherigen Nachricht zu Amanah PropTech vorzunehmen.</p>
      <p>In einem technologischen Testlauf hat unser automatisiertes System Ihnen eine E-Mail zugestellt, in der fälschlicherweise behauptet wurde, wir seien eine "BaFin-regulierte Plattform" oder besäßen eine Haftungsdachstruktur (Tied-Agent). <strong>Diese Aussage war faktisch inkorrekt.</strong></p>
      <p>Amanah PropTech befindet sich derzeit in einer <strong>frühen MVP-Phase (Minimum Viable Product).</strong> Wir verfügen aktuell über keine BaFin-Lizenz und erbringen keine lizenzpflichtigen Finanzdienstleistungen. Eine Struktur als vertraglich gebundener Vermittler (Tied Agent) ist lediglich in Planung.</p>
      <p>Gerade als ${lead.Position} bei ${lead.Company} schätzen Sie Transparenz und strikte Compliance. Die zuvor erwähnten eWpG-Assets und Dashboards dienen als technologische Demonstration und illustrieren unseren geplanten Zielzustand.</p>
      <p>Ich möchte mich für die Irritation entschuldigen, die durch diesen Fehler im automatisierten System entstanden ist.</p>
      <p>Falls Sie dennoch Interesse haben, unseren technologischen Ansatz und unsere Roadmap für die digitale Strukturierung von Core-Immobilien kennenzulernen, stehe ich Ihnen gerne für ein Gespräch zur Verfügung.</p>
    `;

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1a1a1a; max-width: 600px; line-height: 1.6;">
      <h2 style="color: #03362a; margin-bottom: 5px;">Amanah PropTech</h2>
      <p style="font-size: 12px; color: #c5a059; font-weight: bold; letter-spacing: 1px; margin-top: 0;">CLARIFICATION & UPDATE</p>
      <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;" />
      <p>${greeting}</p>
      ${body}
      <div style="margin: 35px 0;">
        <a href="${calLink}" style="background: #111; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          📅 Schedule 15-Min Talk
        </a>
      </div>
      <p style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
        <strong>Khoder Chaabou</strong><br/>
        Founder & CEO<br/>
        Amanah PropTech<br/>
        <em>MVP Status - No BaFin license. Technological demonstration only.</em>
      </p>
    </div>
  `;
}

async function runCorrectionOutreach() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   AMANAH PROPTECH - CORRECTION ENGINE    ║');
  console.log(`║   Mode: ${DRY_RUN ? 'DRY-RUN (Preview)      ' : 'LIVE (Gmail Active)        '}║`);
  console.log('╚══════════════════════════════════════════╝\n');

  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  // MO-FR (1-5), 09:00 - 15:00
  if (!process.argv.includes('--force') && (day === 0 || day === 6 || hour < 9 || hour >= 15)) {
    console.log(`[PAUSE] Aktuelle Uhrzeit (${now.toLocaleTimeString()}) ist ausserhalb der Geschäftszeiten. Bot pausiert.`);
    console.log('Zum Übersteuern die Flag --force anhängen.');
    return { sent: 0, failed: 0 };
  }

  if (!GmailUser || !GmailPass) {
    console.error('[FATAL] GMAIL_USER or GMAIL_PASS is missing in .env.local');
    return;
  }

  const allLeads = loadLeads();
  const sentLog = loadSentLog();
  const correctionLog = loadCorrectionLog();
  const alreadySentCorrection = new Set(correctionLog.sentEmails);

  // Target those who were previously contacted but not yet corrected
  const previouslyContactedEmails = new Set(sentLog.sentEmails);
  const queue = allLeads.filter(l => l.Email && previouslyContactedEmails.has(l.Email) && !alreadySentCorrection.has(l.Email));

  console.log(`[CRM] Contacted Leads: ${previouslyContactedEmails.size} | Corrected: ${alreadySentCorrection.size} | Queue: ${queue.length}\n`);

  if (queue.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  for (const lead of queue) {
    console.log(`[→] Sending correction to: ${lead.Company} · ${lead.Name}`);
    
    if (DRY_RUN) {
      console.log(`   [✓] DRY-RUN OK → ${lead.Email}`);
      sent++;
    } else {
      try {
        const subject = lead.Region === 'MENA' 
          ? `Important Clarification: Amanah PropTech Status` 
          : `Wichtige Richtigstellung: Amanah PropTech Compliance-Status`;

        await transporter.sendMail({
          from: `"Khoder Chaabou" <${GmailUser}>`,
          to: lead.Email,
          replyTo: REPLY_TO,
          subject,
          html: buildCorrectionHTML(lead),
        });

        console.log(`   [✓] CORRECTED → ${lead.Email}`);
        alreadySentCorrection.add(lead.Email);
        sent++;
      } catch (err) {
        console.error(`   [✗] Error for ${lead.Email}: ${err.message}`);
        failed++;
      }
    }
    if (sent < queue.length) await sleep(DELAY_BETWEEN_MS);
  }

  correctionLog.sentEmails = [...alreadySentCorrection];
  correctionLog.lastRun = new Date().toISOString();
  correctionLog.totalSent = (correctionLog.totalSent || 0) + (DRY_RUN ? 0 : sent);
  saveCorrectionLog(correctionLog);

  console.log(`\n[COMPLETE] Sent: ${sent} | Failed: ${failed} | Total Managed: ${correctionLog.totalSent}\n`);
}

if (require.main === module) {
  runCorrectionOutreach().catch(console.error);
}

module.exports = { runCorrectionOutreach };
