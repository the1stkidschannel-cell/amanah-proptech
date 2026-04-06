import { NextResponse } from "next/server";

// Mock Database for Support Tickets
let supportTickets = [
  { id: "T1", user: "Ahmed K.", subject: "Verzögerung beim KYC-Onboarding", status: "OPEN", priority: "HIGH", createdAt: "2026-04-05T09:12:00Z", message: "Mein Ausweis wurde abgelehnt, obwohl das Dokument gültig ist." },
  { id: "T2", user: "Sara J.", subject: "Frage zum Sekundärmarkt", status: "CLOSED", priority: "MEDIUM", createdAt: "2026-04-04T12:00:00Z", message: "Wie schnell werden Verkaufsorders ausgeführt?" },
  { id: "T3", user: "Münchener Pensionskasse", subject: "B2B Dashboard Zugriff", status: "IN_PROGRESS", priority: "URGENT", createdAt: "2026-04-06T10:15:00Z", message: "Wir benötigen eine Freigabe für weitere 3 Sub-Accounts." },
];

export async function GET() {
  return NextResponse.json(supportTickets);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.action === "UPDATE_STATUS") {
      const ticket = supportTickets.find(t => t.id === body.ticketId);
      if (ticket) {
        ticket.status = body.newStatus;
        return NextResponse.json({ success: true, ticket });
      }
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
