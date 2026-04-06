/**
 * AMANAH PROPTECH - MASTER AUTONOMOUS LOOP
 * The 500M Engine Orchestrator
 *
 * Run: node scripts/autonomous_loop.js
 * Options:
 *   --dry-run    No emails sent, no data written (safe test)
 *   --once       Run one cycle and exit (default: loops indefinitely)
 *
 * This script runs 4 phases in sequence, then waits and restarts.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

// ── Config ──────────────────────────────────────────────────────────
const DRY_RUN        = process.argv.includes('--dry-run');
const RUN_ONCE       = process.argv.includes('--once');
const LOOP_INTERVAL_HOURS = parseFloat(process.env.LOOP_INTERVAL_HOURS || '4');
const LOG_FILE       = path.join(__dirname, '../data/engine_log.json');
const API_BASE       = process.env.API_BASE || 'http://localhost:3000';

// ── Helpers ──────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function log(phase, msg, status = 'INFO') {
  const entry = {
    ts: new Date().toISOString(),
    phase,
    status,
    msg,
  };
  console.log(`[${entry.ts}] [${phase}] [${status}] ${msg}`);

  // Append to engine log for dashboard
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  let existing = [];
  try { existing = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch {}
  existing.push(entry);
  // Keep last 500 entries
  if (existing.length > 500) existing = existing.slice(-500);
  fs.writeFileSync(LOG_FILE, JSON.stringify(existing, null, 2), 'utf8');

  return entry;
}

function runScript(name, args = '') {
  const scriptPath = path.join(__dirname, name);
  try {
    const output = execSync(`node "${scriptPath}" ${args}`, {
      encoding: 'utf8',
      timeout: 120000,
      env: { ...process.env, API_BASE },
    });
    return { success: true, output };
  } catch (err) {
    return { success: false, output: err.stdout || '', error: err.message };
  }
}

async function fetchAUMStats() {
  try {
    const resp = await fetch(`${API_BASE}/api/outreach/send`);
    if (resp.ok) return await resp.json();
  } catch {}
  return null;
}

// ── Phases ───────────────────────────────────────────────────────────

async function phase1_harvest() {
  log('HARVEST', 'Starting institutional lead scraping (DACH/MENA)...');
  const result = runScript('lead_scraper_engine.js');
  if (result.success) {
    log('HARVEST', result.output.trim().split('\n').pop(), 'OK');
  } else {
    log('HARVEST', `Lead scraper failed: ${result.error}`, 'ERROR');
  }
  return result.success;
}

async function phase2_audit() {
  log('AUDIT', 'Running financial feasibility audit on deal pipeline...');
  const result = runScript('deal_source_auditor.js');
  if (result.success) {
    // Extract the summary line
    const lines = result.output.trim().split('\n');
    const summary = lines.find(l => l.includes('Gap to')) || lines[lines.length - 1];
    log('AUDIT', summary.trim(), 'OK');
  } else {
    log('AUDIT', `Deal audit failed: ${result.error}`, 'ERROR');
  }
  return result.success;
}

async function phase3_outreach() {
  log('OUTREACH', `Initiating B2B email outreach via Resend API${DRY_RUN ? ' [DRY-RUN]' : ''}...`);
  const args = DRY_RUN ? '--dry-run' : '';
  const result = runScript('outreach_bot.js', args);
  if (result.success) {
    const lines = result.output.trim().split('\n');
    const summary = lines.find(l => l.includes('Sent:')) || 'Outreach cycle complete.';
    log('OUTREACH', summary.trim(), 'OK');
  } else {
    log('OUTREACH', `Outreach failed: ${result.error}`, 'ERROR');
  }
  return result.success;
}

async function phase4_analytics() {
  log('ANALYTICS', 'Fetching pipeline KPIs from CRM...');
  const stats = await fetchAUMStats();

  if (stats) {
    const potentialAUM = (stats.total || 0) * 500000; // avg €500k min. allocation
    log('ANALYTICS', `Pipeline: ${stats.total} leads | Contacted: ${stats.contacted} | Replied: ${stats.replied || 0} | Est. AUM Potential: €${(potentialAUM / 1000000).toFixed(1)}M`, 'OK');
  } else {
    log('ANALYTICS', 'Next.js app offline – skipping live KPI fetch. Start with: npm run dev', 'WARN');
    // Offline fallback: read from CSV
    const csvPath = path.join(__dirname, '../data/leads.csv');
    if (fs.existsSync(csvPath)) {
      const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim());
      log('ANALYTICS', `Offline CSV: ${lines.length - 1} total leads in pipeline.`, 'INFO');
    }
  }
}

// ── Main Loop ────────────────────────────────────────────────────────

async function runCycle(cycleNumber) {
  const banner = `
╔═══════════════════════════════════════════════════════╗
║   AMANAH PROPTECH · 500M SCALING ENGINE               ║
║   Cycle #${String(cycleNumber).padEnd(4)}  ${DRY_RUN ? '[DRY-RUN MODE]          ' : '[LIVE MODE - aktiv!]          '} ║
║   ${new Date().toLocaleString('de-DE')}                          ║
╚═══════════════════════════════════════════════════════╝`;
  console.log(banner);

  await phase1_harvest();
  await sleep(1000);

  await phase2_audit();
  await sleep(1000);

  await phase3_outreach();
  await sleep(1000);

  await phase4_analytics();

  console.log('\n[ENGINE] Cycle complete. Nächster Zyklus in', LOOP_INTERVAL_HOURS, 'Stunden.\n');
}

async function main() {
  log('SYSTEM', `500M Engine gestartet. Dry-Run: ${DRY_RUN} | Interval: ${LOOP_INTERVAL_HOURS}h`, 'BOOT');

  let cycle = 1;
  while (true) {
    await runCycle(cycle++);
    if (RUN_ONCE) {
      log('SYSTEM', 'Run-once Mode: Engine beendet.', 'DONE');
      break;
    }
    await sleep(LOOP_INTERVAL_HOURS * 60 * 60 * 1000);
  }
}

main().catch(err => {
  log('SYSTEM', `Fatal error: ${err.message}`, 'FATAL');
  process.exit(1);
});
