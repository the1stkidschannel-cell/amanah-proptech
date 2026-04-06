const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * AMANAH PROPTECH - AUTONOMOUS B2B OUTREACH BOT (Node.js/Playwright)
 * 
 * Replaces the Python bot to ensure compatibility in environments without Python.
 * Goal: $500M AUM via aggressive institutional outreach.
 */

const COMPLIANCE_DISCLAIMER = `
--
Amanah PropTech is a technology provider and Tied Agent (vertraglich gebundener Vermittler) 
pursuant to § 2 (10) KWG. All investment brokerage and eWpG tokenization is 
conducted under the liability of our licensed White-Label partner. We do not provide 
independent investment advice or hold client funds.
`;

const WEBHOOK_URL = "http://localhost:3000/api/outreach/leads";

async function loadLeads() {
    const csvPath = path.join(__dirname, '../data/leads.csv');
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i].trim();
            return obj;
        }, {});
    });
}

async function runOutreach(dryRun = true) {
    console.log("\n[TURBO] Initializing Node.js Playwright Outreach Bot...");
    
    const browser = await chromium.launch({ headless: false }); // Show browser for visual verification
    const context = await browser.newContext();
    const page = await context.newPage();

    let leads = [];
    try {
        leads = await loadLeads();
        console.log(`[SYSTEM] Loaded ${leads.length} B2B Institutional Leads.`);
    } catch (e) {
        console.error("[ERROR] Failed to load leads:", e.message);
        await browser.close();
        return;
    }

    // Navigating to ProtonMail
    console.log("[TURBO] Navigating to ProtonMail...");
    await page.goto('https://mail.proton.me/u/0/inbox');
    
    console.log("[TURBO] Waiting for manual login or cached session (15s)...");
    await page.waitForTimeout(15000); 

    for (const lead of leads) {
        console.log(`\n[ACTION] Preparing Pitch for ${lead.Company} (${lead.Email})`);

        try {
            // Click Compose
            await page.click('button[data-testid="sidebar:compose"]');
            await page.waitForTimeout(2000);

            // Fill recipient
            await page.fill('input[id="to-tokens-input"]', lead.Email);
            await page.keyboard.press('Enter');

            // Fill Subject
            await page.fill('input[data-testid="composer:subject"]', `Sharia-Compliant Real Estate (DACH) via eWpG Tokenization - ${lead.Company}`);

            // Fill Body using "Type" for human-like speed
            const body = `Salam ${lead.Name},

As the ${lead.Position} at ${lead.Company}, you are actively seeking illiquidity-premium free, Sharia-compliant asset allocations in the EU. We have solved the regulatory bottleneck in Germany.

With Amanah PropTech, we have built the first eWpG-compliant tokenization platform for Core Real Estate (Ijarah/Diminishing Musharakah structures) - fully operated under BaFin regulations and pre-screened against AAOIFI standards.

We reduce the overhead of SPV structures by 80% and offer you direct access to European Core Assets with yields of 4-6% p.a. via our B2B Dashboard.

I would love to show you our live environment in a 15-minute call. When works for you next week?
${COMPLIANCE_DISCLAIMER}
`;

            // Using keyboard.type for human-like simulation
            await page.focus('div[contenteditable="true"]');
            await page.keyboard.type(body, { delay: 10 });

            console.log("[SUCCESS] Email injected.");

            if (dryRun) {
                console.log(`[DRY-RUN] Closing composer for ${lead.Email} (Draft saved)`);
                await page.keyboard.press('Escape');
                await page.waitForTimeout(2000);
            } else {
                console.log(`[SENT] Sending to ${lead.Email}...`);
                await page.keyboard.press('Control+Enter');
                await page.waitForTimeout(5000);
            }

            // Sync with CRM Webhook
            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: "BOT_CONTACTED_LEAD",
                        company: lead.Company
                    })
                });
                if (response.ok) {
                    console.log(`[CRM SYNC] Updated pipeline for ${lead.Company}`);
                }
            } catch (e) {
                console.log(`[CRM SYNC ERROR] Backend unavailable: ${e.message}`);
            }

        } catch (e) {
            console.error(`[ERROR] Failed lead ${lead.Email}:`, e.message);
            continue;
        }
    }

    console.log("\n[TURBO] Node.js Outreach Cycle Complete.");
    await browser.close();
}

runOutreach(true);
