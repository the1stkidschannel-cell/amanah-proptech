"use client";

import { useState } from "react";
import { Users, Mail, Phone, Calendar, ArrowRight, Building2, Flame, Search, Filter, CheckCircle2, MoreVertical } from "lucide-react";

// Mock Data for CRM Lead Pipeline
const funnelLeads = {
  new: [
    { id: "L1", name: "Ibn Saud Family Office", country: "UAE", value: "€ 4.5M", type: "Institutional", lastContact: "Vor 2 Std" },
    { id: "L2", name: "Al-Futtaim Asset Mgmt", country: "Qatar", value: "€ 12M", type: "Institutional", lastContact: "Gestern" },
  ],
  contacted: [
    { id: "L3", name: "DACH Real Estate GmbH", country: "Germany", value: "€ 1.2M", type: "B2B SaaS", lastContact: "Vor 3 Tagen" },
    { id: "L4", name: "High-Net-Worth Individual (HNWI)", country: "Switzerland", value: "€ 500k", type: "VIP Retail", lastContact: "Vor 1 Woche" },
  ],
  qualified: [
    { id: "L5", name: "Münchener Pensionskasse", country: "Germany", value: "€ 18M", type: "Institutional", lastContact: "Vor 1 Std", hot: true },
  ],
  closed: [
    { id: "L6", name: "Emirates Islamic Wealth", country: "UAE", value: "€ 22M", type: "Institutional", closedDate: "12. Mär 2026" },
  ]
};

export default function OutreachCRMPage() {
  const [activeBoard, setActiveBoard] = useState("pipeline");
  const [searchTerm, setSearchTerm] = useState("");

  const LeadCard = ({ lead, showHot = false }: { lead: any, showHot?: boolean }) => (
    <div className="bg-[#022c22] border border-[#064e3b]/50 p-4 rounded-xl hover:border-[#c5a059]/50 transition-all cursor-pointer group shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white text-sm group-hover:text-[#c5a059] transition-colors">{lead.name}</h4>
        {lead.hot || showHot ? <Flame className="w-4 h-4 text-orange-500" /> : <MoreVertical className="w-4 h-4 text-gray-500" />}
      </div>
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1"><Building2 className="w-3 h-3"/> {lead.type} • {lead.country}</p>
      
      <div className="flex justify-between items-center border-t border-[#064e3b]/30 pt-3">
        <span className="text-xs font-bold text-white bg-[#03362a] px-2 py-1 rounded">{lead.value} Target</span>
        <span className="text-[10px] text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {lead.lastContact || lead.closedDate}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-400 mb-3">
            <Users className="w-3 h-3" />
            <span>Enterprise Sales CRM</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            B2B Outreach Pipeline
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Verwaltung von institutionellen Leads, Family Offices und SaaS-Kunden. E-Mails und NDAs (Non-Disclosure Agreements) direkt aus dem Panel versenden.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#03362a] border border-[#064e3b] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#064e3b] transition-all flex items-center gap-2">
            <Mail className="w-4 h-4" /> Massen-Mailing
          </button>
          <button className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Neuen Lead anlegen
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Qualifizierte Pipeline</p>
           <p className="text-2xl font-bold text-white">€ 34.500.000</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Neue Inbound Leads (24h)</p>
           <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mailing Open Rate</p>
           <p className="text-2xl font-bold text-white">64.2%</p>
        </div>
        <div className="bg-[#022c22] border-2 border-green-500/20 rounded-xl p-5 shadow-lg shadow-green-500/5">
           <p className="text-xs text-green-400 uppercase font-bold mb-1">Closed-Won (YTD)</p>
           <p className="text-2xl font-bold text-green-400">€ 22.000.000</p>
        </div>
      </div>

      {/* CRM Actions */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={() => setActiveBoard("pipeline")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeBoard === "pipeline" ? "bg-[#c5a059] text-[#022c22]" : "text-gray-400 hover:bg-[#064e3b]"}`}>
             Kanban Board
          </button>
          <button onClick={() => setActiveBoard("list")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeBoard === "list" ? "bg-[#c5a059] text-[#022c22]" : "text-gray-400 hover:bg-[#064e3b]"}`}>
             Waitlist (Retail)
          </button>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <input type="text" placeholder="Leads suchen..." className="w-full bg-[#022c22] border border-[#064e3b] text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#c5a059]"/>
        </div>
      </div>

      {/* Kanban Board */}
      {activeBoard === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
          
          {/* Column 1: Neu */}
          <div className="bg-[#03362a]/50 border border-[#064e3b]/30 rounded-xl p-4 flex flex-col gap-3">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-white text-sm">Neue Leads</h3>
               <span className="bg-[#022c22] border border-[#064e3b] text-gray-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.new.length}</span>
             </div>
             {funnelLeads.new.map(l => <LeadCard key={l.id} lead={l} />)}
          </div>

          {/* Column 2: Kontaktiert */}
          <div className="bg-[#03362a]/50 border border-[#064e3b]/30 rounded-xl p-4 flex flex-col gap-3">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-white text-sm">Kontaktiert (NDA send)</h3>
               <span className="bg-[#022c22] border border-[#064e3b] text-gray-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.contacted.length}</span>
             </div>
             {funnelLeads.contacted.map(l => <LeadCard key={l.id} lead={l} />)}
          </div>

          {/* Column 3: Qualifiziert */}
          <div className="bg-[#03362a]/80 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2"><Phone className="w-4 h-4"/> Due Diligence</h3>
               <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.qualified.length}</span>
             </div>
             {funnelLeads.qualified.map(l => <LeadCard key={l.id} lead={l} showHot={true} />)}
          </div>

          {/* Column 4: Closed */}
          <div className="bg-[#022c22] border-t-4 border-green-500 rounded-b-xl rounded-t-sm p-4 flex flex-col gap-3 shadow-lg shadow-green-500/5">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-white text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Closed-Won</h3>
               <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.closed.length}</span>
             </div>
             {funnelLeads.closed.map(l => <LeadCard key={l.id} lead={l} />)}
          </div>

        </div>
      )}

      {/* Waitlist View (Placeholder) */}
      {activeBoard === "list" && (
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
           <Filter className="w-12 h-12 text-gray-600 mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">B2C Retail Waitlist</h3>
           <p className="text-gray-400 max-w-md">Hier landen alle Retail-Registrierungen, die noch durch den eWpG/KYC Check müssen. Im MVP ist diese Liste aktuell leer.</p>
        </div>
      )}

    </div>
  );
}
