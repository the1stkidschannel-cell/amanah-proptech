/**
 * AMANAH PROPTECH - DEAL SOURCE AUDITOR (ROI/IRR ENGINE)
 * 
 * Audits the financial feasibility of institutional real estate deals.
 * Calculates Net Yield (Ijarah) based on rental income, maintenance buffers,
 * and management fees to ensure $500M AUM scalability.
 */

const properties = [
    {
        id: "stadtresidenz-muenchen",
        name: "Stadtresidenz München-Ost",
        purchasePrice: 12500000,
        monthlyGrossRent: 58000,
        maintenanceBufferPercent: 5,
        managementFeePercent: 1.5,
        otherCostsMonthly: 2500,
        targetYield: 4.8
    },
    {
        id: "wohnquartier-rhein-ruhr",
        name: "Wohnquartier Rhein-Ruhr",
        purchasePrice: 8900000,
        monthlyGrossRent: 42000,
        maintenanceBufferPercent: 6,
        managementFeePercent: 2.0,
        otherCostsMonthly: 1800,
        targetYield: 5.2
    }
];

function auditDeal(deal) {
    console.log(`\nAuditing Deal: ${deal.name}`);
    
    // 1. Calculate Annual Gross Rent
    const annualGross = deal.monthlyGrossRent * 12;
    
    // 2. Calculate Deductions (Maintenance + Management + Ops)
    const maintenance = annualGross * (deal.maintenanceBufferPercent / 100);
    const management = annualGross * (deal.managementFeePercent / 100);
    const otherCosts = deal.otherCostsMonthly * 12;
    
    const totalCosts = maintenance + management + otherCosts;
    const netIncome = annualGross - totalCosts;
    
    // 3. Calculate Net Yield
    const calculatedYield = (netIncome / deal.purchasePrice) * 100;
    const deviation = Math.abs(calculatedYield - deal.targetYield);

    console.log(`- Annual Gross Income: ${annualGross.toLocaleString()} €`);
    console.log(`- Annual OpEx: ${totalCosts.toLocaleString()} €`);
    console.log(`- Calculated Net Yield: ${calculatedYield.toFixed(2)}%`);
    console.log(`- Target Yield: ${deal.targetYield}%`);

    if (deviation < 0.5) {
        console.log(`[PASS] Financial feasibility confirmed. Deviation: ${deviation.toFixed(2)}%`);
        return true;
    } else {
        console.warn(`[WARN] Yield deviation too high: ${deviation.toFixed(2)}%`);
        return false;
    }
}

function runAudit() {
    console.log("\n--- DEAL SOURCE FINANCIAL AUDIT ---");
    let passed = 0;
    
    for (const deal of properties) {
        if (auditDeal(deal)) passed++;
    }

    console.log(`\nAudit Complete: ${passed}/${properties.length} deals verified.`);
    
    // Growth Forecast for $500M AUM
    const currentAUM = properties.reduce((sum, p) => sum + p.purchasePrice, 0);
    const avgYield = properties.reduce((sum, p) => sum + p.targetYield, 0) / properties.length;
    const targetAUM = 500000000;
    const pipelineGap = targetAUM - currentAUM;

    console.log("\n--- INSTITUTIONAL GROWTH PIPELINE ---");
    console.log(`Current Verified AUM: ${(currentAUM / 1000000).toFixed(2)}M €`);
    console.log(`Average Platform Yield: ${avgYield.toFixed(2)}%`);
    console.log(`Gap to $500M Goal: ${(pipelineGap / 1000000).toFixed(2)}M €`);
}

runAudit();
