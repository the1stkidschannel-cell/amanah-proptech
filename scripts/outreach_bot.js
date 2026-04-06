/**
 * AMANAH PROPTECH - UPGRADED OUTREACH BOT (Resend API)
 *
 * FULLY AUTONOMOUS. No browser. No manual login.
 * Sends personalized institutional emails via the Resend API endpoint.
 *
 * Run: node scripts/outreach_bot.js
 * Dry-Run: node scripts/outreach_bot.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const DAILY_SEND_LIMIT = parseInt(process.env.DAILY_SEND_LIMIT || '20', 10);
const DELAY_BETWEEN_MS = parseInt(process.env.DELAY_BETWEEN_MS || '3000', 10);

const LEADS_FILE = path.join(__dirname, '../data/leads.csv');
const SENT_LOG  = path.join(__dirname, '../data/sent_log.json');

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function loadLeads() {
  if (!fs.existsSync(LEADS_FILE)) {
    console.log('[CRM] No leads.csv found. Run lead_scraper_engine.js first.');
    return [];
  }
  const content = fs.readFileSync(LEADS_FILE, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  return lines.slice(1).map(line => {
    const values = line.match(/(\"[^\"]*\"|[^,]+)/g) || [];
    const lead = {};
    headers.forEach((h, i) => {
      lead[h] = values[i] ? values[i].replace(/"/g, '').trim() : '';
    });
    return lead;
  });
}

function loadSentLog() {
  if (!fs.existsSync(SENT_LOG)) return { sentEmails: [], lastRun: null };
  try { return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')); }
  catch { return { sentEmails: [], lastRun: null }; }
}

function saveSentLog(log) {
  const dir = path.dirname(SENT_LOG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SENT_LOG, JSON.stringify(log, null, 2), 'utf8');
}

function updateLeadStatus(email, status) {
  if (!fs.existsSync(LEADS_FILE)) return;
  let content = fs.readFileSync(LEADS_FILE, 'utf8');
  // Replace status in CSV for this email
  const lines = content.split('\n');
  const updated = lines.map(line => {
    if (line.includes(email) && line.includes('"NEW"')) {
      return line.replace('"NEW"', `"${status}"`);
    }
    return line;
  });
  fs.writeFileSync(LEADS_FILE, updated.join('\n'), 'utf8');
}

// ──────────────────────────────────────
// Main Outreach Loop
// ──────────────────────────────────────

async function runOutreach() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   AMANAH PROPTECH - OUTREACH ENGINE      ║');
  console.log(`║   Mode: ${DRY_RUN ? 'DRY-RUN (No emails sent)  ' : 'LIVE (Resend API active)   '}║`);
  console.log('╚══════════════════════════════════════════╝\n');

  const allLeads = loadLeads();
  const sentLog  = loadSentLog();
  const alreadySent = new Set(sentLog.sentEmails);

  // Filter: only NEW leads not already sent
  const queue = allLeads.filter(l => l.Email && !alreadySent.has(l.Email) && (l.Status || '').toUpperCase() === 'NEW');

  console.log(`[CRM] Total leads in DB: ${allLeads.length}`);
  console.log(`[CRM] Already contacted: ${alreadySent.size}`);
  console.log(`[CRM] Queue for this run: ${Math.min(queue.length, DAILY_SEND_LIMIT)} (limit: ${DAILY_SEND_LIMIT}/day)\n`);

  if (queue.length === 0) {
    console.log('[INFO] No new leads to contact. Run lead_scraper_engine.js to refresh pipeline.');
    return { sent: 0, skipped: 0 };
  }

  let sent = 0;
  let failed = 0;
  const runQueue = queue.slice(0, DAILY_SEND_LIMIT);

  for (const lead of runQueue) {
    console.log(`\n[→] Targeting: ${lead.Company} · ${lead.Name} · ${lead.Email}`);

    try {
      const response = await fetch(`${API_BASE}/api/outreach/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            name:     lead.Name,
            email:    lead.Email,
            company:  lead.Company,
            position: lead.Position,
            region:   lead.Region || lead.region || 'DACH',
          },
          dryRun: DRY_RUN,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`   [✓] ${DRY_RUN ? 'DRY-RUN OK' : 'SENT'} → ${lead.Email}${result.resendId ? ` (ID: ${result.resendId})` : ''}`);
        alreadySent.add(lead.Email);
        if (!DRY_RUN) updateLeadStatus(lead.Email, 'CONTACTED');
        sent++;
      } else {
        console.error(`   [✗] Failed → ${lead.Email}: ${result.error}`);
        failed++;
      }
    } catch (err) {
      console.error(`   [✗] Network error for ${lead.Email}: ${err.message}`);
      console.error(`       → Is the Next.js app running? (npm run dev)`);
      failed++;
    }

    if (sent < runQueue.length) await sleep(DELAY_BETWEEN_MS);
  }

  // Save log
  sentLog.sentEmails = [...alreadySent];
  sentLog.lastRun = new Date().toISOString();
  sentLog.totalSent = (sentLog.totalSent || 0) + sent;
  saveSentLog(sentLog);

  console.log('\n╔══════════════════════════════════════════╗');
  console.log(`║  CYCLE COMPLETE                          ║`);
  console.log(`║  Sent: ${String(sent).padEnd(8)} Failed: ${String(failed).padEnd(8)} Total: ${String(sentLog.totalSent).padEnd(6)}║`);
  console.log('╚══════════════════════════════════════════╝\n');

  return { sent, failed };
}

// Allow calling as module or standalone
if (require.main === module) {
  runOutreach().catch(console.error);
}

module.exports = { runOutreach };
