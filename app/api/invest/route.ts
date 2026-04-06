import { NextResponse } from "next/server";
import crypto from "crypto";
import { CashlinkProvider } from "@/lib/cashlink";
import { executeInvestmentACID } from "@/lib/firebase/transactions";

interface InvestRequest {
  userId: string;
  userEmail: string;  
  userName: string;
  spvId: string;
  amount: number; // in EUR
}

const SPV_REGISTRY: Record<string, {
  name: string;
  isin: string;
  pricePerToken: number;
}> = {
  "spv-rhein-ruhr-001": {
    name: "Wohnpark Rhein-Ruhr SPV GmbH & Co. KG",
    isin: "DE000A3G2X11",
    pricePerToken: 100, 
  },
  "spv-muenchen-ost-002": {
    name: "Stadtresidenz München-Ost SPV GmbH & Co. KG",
    isin: "DE000A3G2X22",
    pricePerToken: 100,
  },
};

export async function POST(req: Request) {
  try {
    const body: InvestRequest = await req.json();

    if (!body.userId || !body.spvId || !body.amount) {
      return NextResponse.json(
        { error: "Fehlende Pflichtfelder: userId, spvId, amount." },
        { status: 400 }
      );
    }

    if (body.amount < 1000) {
      return NextResponse.json(
        { error: "Mindestinvestition: 1.000 EUR." },
        { status: 400 }
      );
    }

    const spv = SPV_REGISTRY[body.spvId];
    if (!spv) {
      return NextResponse.json({ error: "SPV nicht gefunden." }, { status: 404 });
    }

    // ── STEP 1: Internal ACID Transaction Ledger (Task 059) ──
    // Ensures internal balance and property cap consistency
    const internalTx = await executeInvestmentACID(body.userId, body.spvId, body.amount);

    // ── STEP 2: Tied Agent API (Partner Sync) ──
    const partnerReg = await CashlinkProvider.registerInvestor({
      email: body.userEmail || "investor@amanah.com",
      name: body.userName || "Amanah Investor",
      kycStatus: "VERIFIED"
    });

    if (!partnerReg.success) {
      return NextResponse.json({ error: "Partner Sync Failed" }, { status: 502 });
    }

    // ── STEP 3: Execute Investment through Partner (eWpG) ──
    const investmentResponse = await CashlinkProvider.executeInvestment({
      investorId: partnerReg.partnerInvestorId,
      isin: spv.isin,
      fiatAmount: body.amount
    });

    if (!investmentResponse.success) {
      return NextResponse.json({ error: "Investment Execution Failed at Partner" }, { status: 502 });
    }

    const masterTransactionId = `TX-${crypto.randomUUID().slice(0, 12).toUpperCase()}`;

    // Regulatory Disclaimer is implicitly attached to the transaction summary
    return NextResponse.json({
      success: true,
      transactionId: masterTransactionId,
      disclaimer: "Amanah PropTech acts exclusively as a Tied Agent (Vertraglich gebundener Vermittler) pursuant to § 2 (10) KWG.",
      summary: {
        investor: partnerReg.partnerInvestorId,
        spv: spv.name,
        isin: spv.isin,
        investedAmount: `${new Intl.NumberFormat("de-DE").format(body.amount)} EUR`,
        tokensReceived: body.amount / spv.pricePerToken,
        onChainHash: investmentResponse.transactionHash
      }
    }, { status: 201 });

  } catch (error) {
    console.error("[INVEST API] Unhandled error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
