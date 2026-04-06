"use client";

export type LeadStatus = "Cold" | "In_Progress" | "Interested" | "Deal_Closed" | "Rejected";

export interface Lead {
  id: string;
  name: string;
  company: string;
  region: "DACH" | "MENA";
  status: LeadStatus;
  lastContacted?: string;
  notes?: string;
}

export const leadStatusColors: Record<LeadStatus, string> = {
  "Cold": "bg-gray-500",
  "In_Progress": "bg-blue-500",
  "Interested": "bg-yellow-500",
  "Deal_Closed": "bg-green-500",
  "Rejected": "bg-red-500"
};

// Simulation Layer for Phase 2
export function getLeadScore(lead: Lead): number {
  let score = 0;
  if (lead.region === "MENA") score += 50; // Priority for MENA capital
  if (lead.status === "Interested") score += 100;
  return score;
}
