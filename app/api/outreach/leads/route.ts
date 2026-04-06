import { NextResponse } from "next/server";

// Mock Database for B2B CRM Pipeline
let crmLeads = {
  new: [
    { id: "L1", name: "Ibn Saud Family Office", country: "UAE", value: "€ 4.5M", type: "Institutional", lastContact: "Vor 2 Std" },
    { id: "L2", name: "Al-Futtaim Asset Mgmt", country: "Qatar", value: "€ 12M", type: "Institutional", lastContact: "Gestern" },
  ],
  contacted: [
    { id: "L3", name: "DACH Real Estate GmbH", country: "Germany", value: "€ 1.2M", type: "B2B SaaS", lastContact: "Vor 3 Tagen" },
  ],
  qualified: [
    { id: "L5", name: "Münchener Pensionskasse", country: "Germany", value: "€ 18M", type: "Institutional", lastContact: "Vor 1 Std", hot: true },
  ],
  closed: [
    { id: "L6", name: "Emirates Islamic Wealth", country: "UAE", value: "€ 22M", type: "Institutional", closedDate: "12. Mär 2026" },
  ]
};

export async function GET() {
  return NextResponse.json(crmLeads);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Automation Webhook Handler: When Python Bot sends an email, it pings this endpoint.
    if (body.action === "BOT_CONTACTED_LEAD") {
      const newLead = {
        id: `L_${Date.now()}`,
        name: body.company || "Unknown institutional Lead",
        country: "Global",
        value: "€ Target pending",
        type: "ProtonMail Outreach",
        lastContact: "Gerade eben (Bot)"
      };
      crmLeads.contacted.unshift(newLead);
      return NextResponse.json({ success: true, message: "Lead added to CRM Pipeline via Bot Webhook", lead: newLead });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
