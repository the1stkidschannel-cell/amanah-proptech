const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const GmailUser = process.env.GMAIL_USER || 'amanah.proptech@gmail.com';
const GmailPass = process.env.GMAIL_PASS || 'Antigravity2026!';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GmailUser, pass: GmailPass }
});

const SUPPLY_LEADS = path.join(__dirname, '../data/supply_leads.csv');

function loadLeads() {
  if (!fs.existsSync(SUPPLY_LEADS)) return [];
  const content = fs.readFileSync(SUPPLY_LEADS, 'utf8');
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

function updateStatus(email) {
  if (!fs.existsSync(SUPPLY_LEADS)) return;
  let content = fs.readFileSync(SUPPLY_LEADS, 'utf8');
  const updated = content.split('\n').map(line => line.includes(email) ? line.replace('"NEW"', '"CONTACTED"') : line);
  fs.writeFileSync(SUPPLY_LEADS, updated.join('\n'), 'utf8');
}

async function runSupplyOutreach() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   AMANAH PROPTECH - SUPPLY AI ENGINE     ║');
  console.log('║   Targeting: DACH Real Estate Developers ║');
  console.log('╚══════════════════════════════════════════╝\n');

  function getGermanGreeting(fullName) {
    if (!fullName) return "Sehr geehrte Damen und Herren,";
    const parts = fullName.trim().split(' ');
    if (parts.length < 2) return `Sehr geehrte(r) Herr/Frau ${fullName},`;
    const firstName = parts[0].toLowerCase();
    const lastName = parts.slice(1).join(' ');
    
    // Semantic gender detection heuristics
    const femaleNames = ['anna','maria','susanne','petra','sabine','katharina','julia','steffi','christina','laura','sarah','martina','andrea','silke','claudia','karin','nicole','stephanie','anja','barbara'];
    const maleNames = ['luca', 'sascha', 'mika', 'andrea', 'ilya', 'noa', 'bela']; // exceptions that end in 'a' but are male
    
    const isFemale = femaleNames.includes(firstName) || (firstName.endsWith('a') && !maleNames.includes(firstName)) || firstName.endsWith('ie');
    
    return isFemale ? `Sehr geehrte Frau ${lastName},` : `Sehr geehrter Herr ${lastName},`;
  }


  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  // MO-FR (1-5), 08:00 - 18:00
  if (!process.argv.includes('--force') && (day === 0 || day === 6 || hour < 8 || hour >= 18)) {
    console.log(`[PAUSE] Aktuelle Uhrzeit (${now.toLocaleTimeString()}) ist ausserhalb der Geschäftszeiten (Mo-Fr 08:00-18:00). Bot pausiert zum Schutz der DACH B2B Reputation.`);
    return;
  }

  const leads = loadLeads().filter(l => l.Status === 'NEW');
  if (leads.length === 0) {
    console.log('[SUPPLY] Alle Entwickler wurden bereits kontaktiert.');
    return;
  }

  for (const lead of leads) {
    console.log(`[→] Akquise: ${lead.Company} · ${lead.Name}`);
    try {
      await transporter.sendMail({
        from: `"Amanah PropTech" <${GmailUser}>`,
        to: lead.Email,
        replyTo: 'deals@amanah-proptech.com',
        subject: `Alternative Refinanzierung via MENA-Kapital für ${lead.Company}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; line-height: 1.6;">
            <p>${getGermanGreeting(lead.Name)}</p>
            <p>als Führungskraft bei der <strong>${lead.Company}</strong> wissen Sie, dass die Refinanzierung von Core-Objekten in der DACH-Region aktuell neue Wege erfordert.</p>
            <p>Mit <strong>Amanah PropTech</strong> bauen wir aktuell eine eWpG-basierte Tokenisierungs-Plattform auf (geplantes BaFin-Haftungsdach als Tied Agent). Unser Ziel ist es, europäische Projektentwickler mit institutionellem Kapital aus dem Nahen Osten (Sovereign Wealth Funds & Family Offices in Dubai/Katar) zu verbinden.</p>
            <p><strong>Wie wir arbeiten (eWpG & Blockchain):</strong><br>
            Wir strukturieren Ihre illiquiden Immobilien in "Krypto-Wertpapiere" gemäß dem neuen deutschen Recht (eWpG). Die Anteile werden auf der Polygon-Blockchain emittiert und über einen Smart Contract (Sharia-zertifiziertes Ijarah-Modell) abgewickelt, um sie für arabisches Milliarden-Kapital attraktiv und investierbar zu machen.</p>
            <ul>
              <li>✅ Kein operativer Aufwand: Wir übernehmen die komplette technische Blockchain-Emission und das rechtliche Setup.</li>
              <li>✅ Schnelle Liquidität: Zugriff auf zinsunabhängige Institutionelle Märkte.</li>
              <li>✅ Setup-Fee: Einmalig 3% des Emissionsvolumens.</li>
            </ul>
            <p>Lassen Sie uns in einem kurzen 15-Minuten-Call abgleichen, ob Ihre aktuellen Projektentwicklungen in unsere Pipeline passen.</p>
            <br/>
            <p>Mit freundlichen Grüßen</p>
            <p><strong>Khoder Chaabou</strong><br/>Founder & CEO<br/>Amanah PropTech<br/>amanah-proptech.com</p>
          </div>
        `
      });
      console.log(`   [✓] SENT → ${lead.Email}`);
      updateStatus(lead.Email);
      await new Promise(r => setTimeout(r, 2000)); // Rate limiting
    } catch (err) {
      console.error(`   [✗] Error: ${err.message}`);
    }
  }
}

runSupplyOutreach();
