/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  AMANAH PROPTECH – BaaS & eWpG INVESTMENT FLOW                    ║
 * ║  POST /api/invest                                                  ║
 * ║                                                                    ║
 * ║  Orchestriert den kompletten Anlageprozess:                        ║
 * ║  KYC → Fiat-Deposit (Baader Bank BaaS) → eWpG-Tokenisierung       ║
 * ║  (Tangany) → Double-Entry Bookkeeping → Wallet-Transfer.          ║
 * ║                                                                    ║
 * ║  PRODUCTION NOTES:                                                 ║
 * ║  - Ersetze Mocks durch echte API-Calls:                            ║
 * ║    • Baader Bank / Solaris BaaS: v-IBAN Generierung + SEPA         ║
 * ║    • Tangany / Finoa: Kryptowertpapierregister (eWpG §4)          ║
 * ║    • Prisma/PostgreSQL: Double-Entry Bookkeeping                   ║
 * ║  - Implementiere idempotente Transaktions-IDs                      ║
 * ║  - Ergänze Saga-Pattern für Rollback bei Step-Failure              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from "next/server";
import crypto from "crypto";

/* ─────────────────────────────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────────────────────────────── */

interface InvestRequest {
  userId: string;
  spvId: string;
  amount: number;   // in EUR
  currency?: string; // default "EUR"
}

interface KYCResult {
  passed: boolean;
  level: "BASIC" | "ENHANCED" | "REJECTED";
  amlFlag: boolean;
  checkTimestamp: string;
}

interface VirtualIBAN {
  vIBAN: string;
  bic: string;
  bankName: string;
  referenceId: string;
}

interface SEPADeposit {
  transactionId: string;
  status: "RECEIVED" | "PENDING" | "FAILED";
  amount: number;
  currency: string;
  valueDate: string;
}

interface TokenEmission {
  tokenId: string;
  tokenType: string;
  legalBasis: string;
  registrar: string;
  totalEmitted: number;
  pricePerToken: number;
  tokensAssigned: number;
  walletAddress: string;
}

interface BookkeepingEntry {
  entryId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
  timestamp: string;
}

interface InvestResponse {
  success: boolean;
  transactionId: string;
  summary: {
    investor: string;
    spv: string;
    investedAmount: string;
    tokensReceived: number;
    tokenType: string;
  };
  steps: {
    kyc: KYCResult;
    fiatDeposit: { vIBAN: VirtualIBAN; sepa: SEPADeposit };
    tokenization: TokenEmission;
    bookkeeping: BookkeepingEntry[];
  };
}

/* ─────────────────────────────────────────────────────────────────────
 * SPV Registry (Mock Database)
 *
 * PRODUCTION: Ersetze durch Prisma-Query auf PostgreSQL/Supabase.
 * ───────────────────────────────────────────────────────────────────── */

const SPV_REGISTRY: Record<string, {
  name: string;
  totalTokens: number;
  availableTokens: number;
  pricePerToken: number;
  yieldPercent: number;
}> = {
  "spv-rhein-ruhr-001": {
    name: "Wohnpark Rhein-Ruhr SPV GmbH & Co. KG",
    totalTokens: 25000,
    availableTokens: 13000,
    pricePerToken: 100, // 100 EUR pro Token
    yieldPercent: 4.8,
  },
  "spv-muenchen-ost-002": {
    name: "Stadtresidenz München-Ost SPV GmbH & Co. KG",
    totalTokens: 42000,
    availableTokens: 32760,
    pricePerToken: 100,
    yieldPercent: 4.2,
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * STEP 1: KYC / AML VERIFICATION
 *
 * PRODUCTION: Ersetze durch echten KYC-Provider-Call:
 *   - IDnow / Onfido / Sumsub für Video-Ident
 *   - Risikoprüfung gegen EU-Sanktionsliste (OFAC/EU)
 *   - PEP-Screening (Politisch exponierte Personen)
 *   - Speichere KYC-Status in Firestore/PostgreSQL
 * ───────────────────────────────────────────────────────────────────── */

function verifyKYC(userId: string): KYCResult {
  // Simuliertes KYC-Ergebnis
  // PRODUCTION: Abfrage des KYC-Status aus der Datenbank
  return {
    passed: true,
    level: "ENHANCED",
    amlFlag: false,
    checkTimestamp: new Date().toISOString(),
  };
}

/* ─────────────────────────────────────────────────────────────────────
 * STEP 2: FIAT DEPOSIT via BaaS (Baader Bank / Solaris Mock)
 *
 * PRODUCTION: Ersetze durch echten BaaS-API-Call:
 *   - POST https://api.baaderbank.de/v1/accounts/virtual-iban
 *   - API-Key: process.env.BAADER_API_KEY
 *   - Webhook für SEPA-Eingangsbestätigung registrieren
 *   - v-IBAN wird pro User + SPV generiert (eindeutige Zuordnung)
 * ───────────────────────────────────────────────────────────────────── */

function generateVirtualIBAN(userId: string, spvId: string): VirtualIBAN {
  // Generiere eine deterministische, aber einzigartige v-IBAN
  const hash = crypto.createHash("sha256").update(`${userId}-${spvId}`).digest("hex").slice(0, 16).toUpperCase();
  const checkDigit = (parseInt(hash.slice(0, 2), 16) % 90 + 10).toString();

  return {
    vIBAN: `DE${checkDigit}BDKR0000${hash.slice(0, 10)}`,
    bic: "BDKRDE71XXX",
    bankName: "Baader Bank AG (BaaS Sandbox)",
    referenceId: `REF-${hash.slice(0, 8)}`,
  };
}

function simulateSEPADeposit(amount: number, vIBAN: VirtualIBAN): SEPADeposit {
  return {
    transactionId: `SEPA-${crypto.randomUUID().slice(0, 12).toUpperCase()}`,
    status: "RECEIVED",
    amount,
    currency: "EUR",
    valueDate: new Date().toISOString().split("T")[0], // T+0 Simulation
  };
}

/* ─────────────────────────────────────────────────────────────────────
 * STEP 3: eWpG TOKENISIERUNG (Kryptowertpapierregister Mock)
 *
 * PRODUCTION: Ersetze durch echten Tangany/Finoa API-Call:
 *   - POST https://api.tangany.com/v1/tokens/emit
 *   - Header: Authorization: Bearer ${process.env.TANGANY_API_KEY}
 *   - Registrierung im Kryptowertpapierregister gem. § 4 eWpG
 *   - Token-Typ: ERC-1400 (Security Token Standard)
 *
 * RECHTLICHER HINWEIS:
 *   Die Token repräsentieren "schuldrechtliche Genussrechte" –
 *   KEINE GmbH-Anteile nach § 15 GmbHG. Dies erfordert kein
 *   notarielles Beurkundungsverfahren und ermöglicht den
 *   digitalen Sekundärhandel über die ECSP-regulierte Plattform.
 * ───────────────────────────────────────────────────────────────────── */

function emitTokens(
  userId: string,
  spvId: string,
  amount: number,
  pricePerToken: number
): TokenEmission {
  const tokensAssigned = Math.floor(amount / pricePerToken);

  // Generiere eine deterministische Wallet-Adresse (Mock)
  const walletHash = crypto.createHash("sha256").update(`wallet-${userId}`).digest("hex");

  return {
    tokenId: `eWpG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    tokenType: "Schuldrechtliches Genussrecht (eWpG §2 Abs. 1)",
    legalBasis: "Elektronisches Wertpapiergesetz (eWpG) – KEINE GmbH-Anteile nach §15 GmbHG",
    registrar: "Tangany GmbH (Kryptowertpapierregisterführer, BaFin-lizenziert)",
    totalEmitted: tokensAssigned,
    pricePerToken,
    tokensAssigned,
    walletAddress: `0x${walletHash.slice(0, 40)}`,
  };
}

/* ─────────────────────────────────────────────────────────────────────
 * STEP 4: DOUBLE-ENTRY BOOKKEEPING
 *
 * PRODUCTION: Ersetze durch echte Prisma-Transaktion:
 *   await prisma.$transaction([
 *     prisma.spvAccount.update({ where: { id: spvId },
 *       data: { availableTokens: { decrement: tokensAssigned } } }),
 *     prisma.userAccount.update({ where: { id: userId },
 *       data: { tokenBalance: { increment: tokensAssigned } } }),
 *     prisma.ledgerEntry.createMany({ data: entries }),
 *   ]);
 * ───────────────────────────────────────────────────────────────────── */

function recordBookkeeping(
  userId: string,
  spvId: string,
  amount: number,
  tokensAssigned: number,
  spvName: string
): BookkeepingEntry[] {
  const now = new Date().toISOString();

  return [
    {
      // Debit: User's Cash → SPV Escrow (Fiat eingeht)
      entryId: `LE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      debitAccount: `USER:${userId}:CASH`,
      creditAccount: `SPV:${spvId}:ESCROW`,
      amount,
      description: `SEPA-Eingang: ${amount} EUR für Genussrechtserwerb an ${spvName}`,
      timestamp: now,
    },
    {
      // Debit: SPV Token Reserve → User Token Balance
      entryId: `LE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      debitAccount: `SPV:${spvId}:TOKEN_RESERVE`,
      creditAccount: `USER:${userId}:TOKEN_BALANCE`,
      amount: tokensAssigned,
      description: `Token-Transfer: ${tokensAssigned} eWpG-Genussrechte an User-Wallet übertragen`,
      timestamp: now,
    },
  ];
}

/* ─────────────────────────────────────────────────────────────────────
 * POST /api/invest
 * ───────────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  try {
    const body: InvestRequest = await req.json();

    // ── Input Validation ──
    if (!body.userId || !body.spvId || !body.amount) {
      return NextResponse.json(
        { error: "Fehlende Pflichtfelder: userId, spvId, amount." },
        { status: 400 }
      );
    }

    if (body.amount < 1000) {
      return NextResponse.json(
        { error: "Mindestinvestition: 1.000 EUR (gem. Prospektausnahmeverordnung)." },
        { status: 400 }
      );
    }

    if (body.amount > 25000) {
      return NextResponse.json(
        { error: "Maximale Zeichnung ohne vollständige Anlageberatung: 25.000 EUR (ECSP-Verordnung Art. 21)." },
        { status: 400 }
      );
    }

    // ── SPV Lookup ──
    const spv = SPV_REGISTRY[body.spvId];
    if (!spv) {
      return NextResponse.json(
        { error: `SPV '${body.spvId}' nicht gefunden. Verfügbar: ${Object.keys(SPV_REGISTRY).join(", ")}` },
        { status: 404 }
      );
    }

    const tokensRequested = Math.floor(body.amount / spv.pricePerToken);
    if (tokensRequested > spv.availableTokens) {
      return NextResponse.json(
        { error: `Nicht genügend Token verfügbar. Angefordert: ${tokensRequested}, Verfügbar: ${spv.availableTokens}` },
        { status: 409 }
      );
    }

    // ══════════════════════════════════════════════════════════════
    // TRANSAKTIONS-PIPELINE (Saga-Pattern in Produktion)
    // ══════════════════════════════════════════════════════════════

    // ── STEP 1: KYC/AML Check ──
    const kycResult = verifyKYC(body.userId);
    if (!kycResult.passed) {
      return NextResponse.json(
        { error: "KYC/AML-Prüfung nicht bestanden. Bitte führen Sie zuerst die Identitätsprüfung durch." },
        { status: 403 }
      );
    }

    // ── STEP 2: Fiat Deposit via BaaS ──
    const vIBAN = generateVirtualIBAN(body.userId, body.spvId);
    const sepaDeposit = simulateSEPADeposit(body.amount, vIBAN);

    if (sepaDeposit.status !== "RECEIVED") {
      // PRODUCTION: Implementiere Retry-Logik oder Webhook-Listener
      return NextResponse.json(
        { error: "SEPA-Eingang konnte nicht bestätigt werden. Bitte versuchen Sie es später erneut." },
        { status: 502 }
      );
    }

    // ── STEP 3: eWpG-Tokenisierung ──
    const tokenEmission = emitTokens(body.userId, body.spvId, body.amount, spv.pricePerToken);

    // ── STEP 4: Double-Entry Bookkeeping ──
    const bookkeepingEntries = recordBookkeeping(
      body.userId,
      body.spvId,
      body.amount,
      tokenEmission.tokensAssigned,
      spv.name
    );

    // ── STEP 5: Update SPV Token Reserve (in-memory für MVP) ──
    // PRODUCTION: Dies geschieht in der Prisma-Transaktion (s.o.)
    spv.availableTokens -= tokenEmission.tokensAssigned;

    // ══════════════════════════════════════════════════════════════
    // RESPONSE
    // ══════════════════════════════════════════════════════════════

    const masterTransactionId = `TX-${crypto.randomUUID().slice(0, 12).toUpperCase()}`;

    const response: InvestResponse = {
      success: true,
      transactionId: masterTransactionId,
      summary: {
        investor: body.userId,
        spv: spv.name,
        investedAmount: `${new Intl.NumberFormat("de-DE").format(body.amount)} EUR`,
        tokensReceived: tokenEmission.tokensAssigned,
        tokenType: "Schuldrechtliches Genussrecht (eWpG)",
      },
      steps: {
        kyc: kycResult,
        fiatDeposit: { vIBAN, sepa: sepaDeposit },
        tokenization: tokenEmission,
        bookkeeping: bookkeepingEntries,
      },
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("[INVEST API] Unhandled error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler bei der Investment-Verarbeitung." },
      { status: 500 }
    );
  }
}
