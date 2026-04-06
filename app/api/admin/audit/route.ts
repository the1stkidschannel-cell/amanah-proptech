import { NextResponse } from "next/server";

// In-Memory Database for Admin Audit Logs
// In production, this should write to append-only storage (e.g. Firestore, AWS QLDB)
const auditLogs = [
  { id: "AL_001", action: "PROPERTY_CREATED", entityId: "spv-rhein-ruhr-001", admin: "Tariq_Admin", timestamp: "2026-04-05T10:00:00Z", details: "Initial onboarding of Wohnpark Rhein-Ruhr" },
  { id: "AL_002", action: "YIELD_UPDATED", entityId: "spv-rhein-ruhr-001", admin: "Aisha_Finance", timestamp: "2026-04-05T14:30:00Z", details: "Adjusted yield from 4.5% to 4.8%" },
  { id: "AL_003", action: "WHITELIST_ADDED", entityId: "wallet_0x7A2...", admin: "Compliance_Bot", timestamp: "2026-04-06T09:12:00Z", details: "Cleared KYC layer 2 for UAE FO" },
  { id: "AL_004", action: "WEBHOOK_TRIGGERED", entityId: "outreach_pipeline", admin: "SYSTEM_BOT", timestamp: new Date().toISOString(), details: "Autonomous CRM Ping Executed" },
];

export async function GET() {
  return NextResponse.json(auditLogs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.action || !body.entityId || !body.admin) {
      return NextResponse.json({ error: "Missing audit log parameters" }, { status: 400 });
    }

    const logEntry = {
      id: `AL_${Date.now()}`,
      action: body.action,
      entityId: body.entityId,
      admin: body.admin,
      timestamp: new Date().toISOString(),
      details: body.details || "No details provided"
    };

    auditLogs.unshift(logEntry);
    return NextResponse.json({ success: true, log: logEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Audit Logger Error" }, { status: 500 });
  }
}
