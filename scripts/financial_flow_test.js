/**
 * AMANAH PROPTECH - FINANCIAL FLOW STRESS TEST (ACID VERIFICATION)
 * 
 * Simulated stress test for the Ijarah distribution engine and Auto-Reinvestment.
 * Verifies that total capital is conserved and balances match dividends distributed.
 */

const fs = require('fs');
const path = require('path');

// Simulated Wallet State
let wallets = {
    "user_001": { fiat: 5000, tokens: { "MUC1": 10 }, compoundMode: true },
    "user_002": { fiat: 12000, tokens: { "MUC1": 50 }, compoundMode: false }
};

const DISTRIBUTION_POOL = 25000; // 25,000 € to distribute
const TOKEN_PRICE = 1000;
const TOTAL_TOKENS_MUC1 = 1000;

function distributeDividends() {
    console.log("\n--- INITIATING IJARAH DISTRIBUTION ---");
    console.log(`Pool: ${DISTRIBUTION_POOL} € | Total Supply: ${TOTAL_TOKENS_MUC1} Tokens`);

    const dividendPerToken = DISTRIBUTION_POOL / TOTAL_TOKENS_MUC1;
    console.log(`Dividend per Token: ${dividendPerToken} €`);

    let totalDisbursed = 0;
    
    for (const [userId, wallet] of Object.entries(wallets)) {
        const share = wallet.tokens["MUC1"] * dividendPerToken;
        console.log(`\nProcessing User: ${userId}`);
        console.log(`- Share: ${share.toFixed(2)} €`);

        if (wallet.compoundMode) {
            console.log("[ACTION] Compound Mode Detected. Reinvesting...");
            const newTokens = Math.floor(share / TOKEN_PRICE);
            const remainingFiat = share % TOKEN_PRICE;
            
            wallet.tokens["MUC1"] += newTokens;
            wallet.fiat += remainingFiat;
            
            console.log(`- Reinvested: ${newTokens} Tokens`);
            console.log(`- Added to Fiat: ${remainingFiat.toFixed(2)} €`);
        } else {
            console.log("[ACTION] Payout Mode. Adding to Fiat...");
            wallet.fiat += share;
        }
        
        totalDisbursed += share;
    }

    console.log("\n--- DISTRIBUTION COMPLETE ---");
    console.log(`Total Disbursed: ${totalDisbursed.toFixed(2)} €`);
}

function verifyConsistency() {
    console.log("\n--- CONSISTENCY CHECK ---");
    let initialTotalValue = 5000 + 12000 + (60 * TOKEN_PRICE);
    let finalTotalValue = Object.values(wallets).reduce((sum, w) => {
        const tokenValue = Object.values(w.tokens).reduce((s, count) => s + (count * TOKEN_PRICE), 0);
        return sum + w.fiat + tokenValue;
    }, 0);

    const growth = finalTotalValue - initialTotalValue;
    console.log(`Initial Value: ${initialTotalValue} €`);
    console.log(`Final Value: ${finalTotalValue.toFixed(2)} €`);
    console.log(`System Value Growth: ${growth.toFixed(2)} € (Should match Total Disbursed)`);

    if (Math.abs(growth - DISTRIBUTION_POOL) < 0.01) {
        console.log("[PASS] ACID Consistency Verified. Capital is conserved.");
        return true;
    } else {
        console.error("[FAIL] Capital mismatch detected!");
        return false;
    }
}

distributeDividends();
if (verifyConsistency()) {
    process.exit(0);
} else {
    process.exit(1);
}
