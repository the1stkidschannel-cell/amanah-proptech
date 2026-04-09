/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  AMANAH PROPTECH – PROPRIETARY SHARIA AI ENGINE (Real LLM Mode)    ║
 * ║  POST /api/compliance                                              ║
 * ║                                                                    ║
 * ║  Liest PDF/TXT Dateien via FormData aus, extrahiert den Text       ║
 * ║  und führt einen echten OpenAI API-Call durch, um Dokumente nach   ║
 * ║  AAOIFI Riba/Gharar Standards zu prüfen.                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from "next/server";
import OpenAI from "openai";

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

type AuditStatus = "COMPLIANT" | "NON_COMPLIANT";

interface Finding {
  paragraph: string;
  classification: "RIBA" | "GHARAR" | "MAYSIR" | "COMPLIANT";
  severity: "critical" | "warning" | "ok";
  explanation: string;
  aaoifiReference: string;
}

interface AuditReport {
  status: AuditStatus;
  engineVersion: string;
  standard: string;
  executiveSummary: string;
  findings: Finding[];
  remediation: string[] | null;
  timestamp: string;
  fileName?: string;
  fileSize?: number;
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

// Initialize OpenAI client
// It will look for process.env.OPENAI_API_KEY automatically, or use LOCAL_LLM_URL
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.LOCAL_LLM_URL || undefined 
    })
  : (process.env.LOCAL_LLM_URL ? new OpenAI({ apiKey: "local", baseURL: process.env.LOCAL_LLM_URL }) : null);

/**
 * Extracts text from the uploaded file buffer.
 */
async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return data.text;
    } catch (err) {
      console.error("PDF parsing failed", err);
      throw new Error("PDF Dokument konnte nicht gelesen werden.");
    }
  }

  // Fallback to basic text decoding (e.g. for .txt, .md, .sol)
  return buffer.toString("utf-8");
}

/**
 * Real LLM call with strict JSON schema instructions.
 */
async function performAIAudit(text: string, fileInfo: { name: string, size: number }): Promise<AuditReport> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not defined.");
  }

  // Pre-process text to save tokens (limit to reasonable size for MVP)
  const truncatedText = text.substring(0, 15000); 

  const systemPrompt = `You are a strict, BaFin-certified Islamic Finance auditor specialized in the AAOIFI Sharia Standards.
You are given a financial contract, real estate document, or smart contract code.
Your task is to analyze it clause by clause and identify ANY elements of:
1. RIBA: interest, late fees (e.g., Verzugszins § 288 BGB), guaranteed principal returns, compound interest.
2. GHARAR: hidden costs, ambiguous terms, unilateral changes without consent.
3. MAYSIR: pure speculation elements.

Output the result strictly as valid JSON matching this exact structure:
{
  "status": "COMPLIANT" or "NON_COMPLIANT",
  "executiveSummary": "A German short summary (max 3 sentences) of the audit result.",
  "findings": [
    {
       "paragraph": "Quote the exact critical text snippet from the document.",
       "classification": "RIBA" | "GHARAR" | "MAYSIR" | "COMPLIANT",
       "severity": "critical" | "warning" | "ok",
       "explanation": "German explanation of why this is haram/halal.",
       "aaoifiReference": "e.g., AAOIFI Sharia Standard Nr. 3"
    }
  ],
  "remediation": ["Remediation step 1 in German", "Remediation step 2 in German"] (or null if compliant)
}

If the document lacks Riba, Gharar, and Maysir, mark it as COMPLIANT and list the Halal mechanisms (Ijarah, Musharakah) you found under findings.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // using highly capable model for logic
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: truncatedText }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1, // low temp for deterministic auditing
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty response from AI.");

  const parsed = JSON.parse(content);

  // Safely construct the final AuditReport
  return {
    status: parsed.status === "NON_COMPLIANT" ? "NON_COMPLIANT" : "COMPLIANT",
    engineVersion: "2.0.0-openai",
    standard: "AAOIFI Sharia Standards (GPT-4o)",
    executiveSummary: parsed.executiveSummary || "No summary provided.",
    findings: parsed.findings || [],
    remediation: parsed.remediation && parsed.remediation.length > 0 ? parsed.remediation : null,
    timestamp: new Date().toISOString(),
    fileName: fileInfo.name,
    fileSize: fileInfo.size,
  };
}

/**
 * Fallback Mock if OPENAI_API_KEY is missing (so the pitch doesn't crash).
 */
function getFallbackReport(fileInfo: { name: string, size: number }): AuditReport {
  return {
    status: "NON_COMPLIANT",
    engineVersion: "1.0.0-mock-fallback",
    standard: "AAOIFI (SIMULATED)",
    executiveSummary: "Achtung: Kein OpenAI API-Key gefunden. Dies ist eine Fallback-Simulation. Eine Verzugszins-Klausel wurde simuliert gefunden.",
    findings: [
      {
        paragraph: "Simulierter §8: Bei Zahlungsverzug werden 5% Zinsen fällig.",
        classification: "RIBA",
        severity: "critical",
        explanation: "Dies stellt Riba dar. Fehlt der echte API-Key, springt dieser Mock ein.",
        aaoifiReference: "AAOIFI Sharia Standard Nr. 3",
      }
    ],
    remediation: ["Bitte tragen Sie den OPENAI_API_KEY in die .env.local ein, um echte Scans durchzuführen."],
    timestamp: new Date().toISOString(),
    fileName: fileInfo.name,
    fileSize: fileInfo.size,
  };
}

// ─────────────────────────────────────────────────────────────────────
// POST /api/compliance
// ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei gefunden. Bitte laden Sie ein Dokument hoch." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Die Datei ist zu groß (Maximal 10 MB erlaubt)." },
        { status: 400 }
      );
    }

    // 1. Text extrahieren (PDF / TXT)
    const text = await extractText(file);

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: "Die Datei scheint leer oder der text nicht lesbar zu sein." },
        { status: 400 }
      );
    }

    // 2. Echtes KI-Audit durchführen
    let report: AuditReport;
    const fileInfo = { name: file.name, size: file.size };

    if (openai) {
      report = await performAIAudit(text, fileInfo);
    } else {
      console.warn("OPENAI_API_KEY missing - using fallback mock.");
      report = getFallbackReport(fileInfo);
    }

    // HITL (Human-in-the-Loop) logic
    if (report.status === "NON_COMPLIANT") {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, setDoc } = await import("firebase/firestore");
        const { sendApprovalEmail } = await import("@/lib/email");

        // Create a unique report ID
        const docId = `audit_${Date.now()}`;
        if (db) {
          await setDoc(doc(db, "audits", docId), report);
        }

        const findingsSummary = report.findings.map(f => f.classification).join(', ');
        await sendApprovalEmail("compliance", docId, {
          fileName: report.fileName,
          findingsSummary
        });

      } catch (e) {
         console.error("Failed to trigger Sharia HITL", e);
      }
    }

    return NextResponse.json(report, { status: 200 });

  } catch (error: any) {
    console.error("[COMPLIANCE API] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Interner Serverfehler bei der Scharia-Prüfung." },
      { status: 500 }
    );
  }
}

