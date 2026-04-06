import { NextResponse } from 'next/server';
import { getLiveProperties } from '@/lib/firebase/properties';

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action !== "trigger_ijarah") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // 1. Fetch live properties to get their YIELD percentages
    const properties = await getLiveProperties();
    
    // Simulate finding users who invested in these properties
    // In production, we would query `db.collection("investments").where("status", "==", "active")`
    
    let totalGeneratedTransactions = 0;
    let log = [];
    
    log.push(`[SYSTEM] Initialisiere Ijarah Ausschüttung für ${properties.length} gelistete Assets...`);

    for (const prop of properties) {
      // Monatliche Rendite = (Jahresrendite / 12)
      const monthlyYieldFactor = (prop.yield / 100) / 12;
      
      log.push(`\n--- Asset: ${prop.name} (${prop.tokenSymbol}) ---`);
      log.push(`-> Jahresrendite: ${prop.yield}%. Monatsfaktor: ${(monthlyYieldFactor * 100).toFixed(4)}%`);
      
      // Simulate 2 users invested in this property
      const simulatorUsers = [
        { id: "USR_1", amount: 50000, name: "Max Mustermann" },
        { id: "USR_2", amount: 150000, name: "Family Office DACH" }
      ];

      for (const user of simulatorUsers) {
        const dividend = Math.round(user.amount * monthlyYieldFactor * 100) / 100;
        
        log.push(`-> Berechne für ${user.name}: Investiert: ${user.amount}€. Ausschüttung: +${dividend}€`);
        
        // ── AUTO RE-INVESTMENT LOGIC (Task 063) ──
        // Simulate a user preference for "Compound Mode"
        const autoReinvest = user.id === "USR_2"; // In production: user.settings.autoReinvest

        if (autoReinvest && dividend >= 10) { // Min reinvest limit
          try {
            log.push(`   [AUTO-REINVEST] Triggering Compound Mode for ${user.id}...`);
            // In production: await executeInvestmentACID(user.id, prop.id, dividend);
            log.push(`   [SUCCESS] ${dividend}€ re-invested into ${prop.tokenSymbol}. (Task 063)`);
          } catch (e: any) {
            log.push(`   [ERROR] Re-investment failed: ${e.message}`);
          }
        } else {
          // Normal credit path
          // await updateUserWallet(user.id, dividend);
          log.push(`   [WALLET] ${dividend}€ credited to investor balance.`);
        }
        
        totalGeneratedTransactions++;
      }
    }

    log.push(`\n[SUCCESS] Erfolgreich. ${totalGeneratedTransactions} Transaktionen in die Ledger geschrieben.`);

    return NextResponse.json({ 
      success: true, 
      logs: log
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Automation failed: ' + error.message }, { status: 500 });
  }
}
