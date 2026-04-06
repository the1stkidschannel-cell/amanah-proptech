"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, Building2, Flame, Search, Filter, CheckCircle2, MoreVertical, RefreshCw } from "lucide-react";

export default function OutreachCRMPage() {
  const [activeBoard, setActiveBoard] = useState("pipeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [funnelLeads, setFunnelLeads] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic pipeline from our Autonomous Bot API
  const fetchPipeline = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/outreach/leads");
      if (res.ok) {
        const data = await res.json();
        setFunnelLeads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
    // Auto-refresh mechanism to catch Bot Webhook injects
    const interval = setInterval(fetchPipeline, 10000); 
    return () => clearInterval(interval);
  }, []);

  const LeadCard = ({ lead, showHot = false }: { lead: any, showHot?: boolean }) => (
    <div className="bg-[#022c22] border border-[#064e3b]/50 p-4 rounded-xl hover:border-[#c5a059]/50 transition-all cursor-pointer group shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white text-sm group-hover:text-[#c5a059] transition-colors">{lead.name}</h4>
        {lead.hot || showHot ? <Flame className="w-4 h-4 text-orange-500" /> : <MoreVertical className="w-4 h-4 text-gray-500" />}
      </div>
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1"><Building2 className="w-3 h-3"/> {lead.type} • {lead.country}</p>
      
      <div className="flex justify-between items-center border-t border-[#064e3b]/30 pt-3">
        <span className="text-xs font-bold text-white bg-[#03362a] px-2 py-1 rounded w-max">{lead.value} Target</span>
        <span className="text-[10px] text-gray-500 flex items-center gap-1 shrink-0"><Calendar className="w-3 h-3"/> {lead.lastContact || lead.closedDate}</span>
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
            <span>Autonomous Sales CRM (Turbo-All Active)</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            B2B Outreach Pipeline
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Live-Überwachung der vom Python-Bot kontaktierten institutionellen Leads. Das Kanban-Board synchronisiert Webhooks automatisch.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPipeline} className="bg-[#03362a] border border-[#064e3b] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#064e3b] transition-all flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c5a059]' : ''}`} /> Sync DB
          </button>
          <button className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            <Building2 className="w-4 h-4" /> CRM Automation Config
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Qualifizierte Pipeline</p>
           <p className="text-2xl font-bold text-white">€ 34.500.000</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] pointer-events-none" />
           <p className="text-xs text-blue-400 uppercase font-bold mb-1">Bot-Generierte Leads</p>
           <p className="text-2xl font-bold text-white">{funnelLeads?.contacted?.length || 0}</p>
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

      {/* Kanban Board */}
      {activeBoard === "pipeline" && funnelLeads && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
          
          <div className="bg-[#03362a]/50 border border-[#064e3b]/30 rounded-xl p-4 flex flex-col gap-3">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-white text-sm">Neue Leads</h3>
               <span className="bg-[#022c22] border border-[#064e3b] text-gray-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.new.length}</span>
             </div>
             {funnelLeads.new.map((l: any) => <LeadCard key={l.id} lead={l} />)}
          </div>

          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-white text-sm flex items-center gap-2">Bot Kontaktiert (Outreach)</h3>
               <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">{funnelLeads.contacted.length}</span>
             </div>
             {funnelLeads.contacted.map((l: any) => <LeadCard key={l.id} lead={l} />)}
          </div>

          <div className="bg-[#03362a]/80 border border-orange-500/20 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-orange-400 text-sm flex items-center gap-2"><Phone className="w-4 h-4"/> Due Diligence</h3>
               <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.qualified.length}</span>
             </div>
             {funnelLeads.qualified.map((l: any) => <LeadCard key={l.id} lead={l} showHot={true} />)}
          </div>

          <div className="bg-[#022c22] border-t-4 border-green-500 rounded-b-xl rounded-t-sm p-4 flex flex-col gap-3 shadow-lg shadow-green-500/5">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-white text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Closed-Won</h3>
               <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{funnelLeads.closed.length}</span>
             </div>
             {funnelLeads.closed.map((l: any) => <LeadCard key={l.id} lead={l} />)}
          </div>

        </div>
      )}

      {isLoading && !funnelLeads && (
        <div className="flex justify-center items-center min-h-[300px]">
          <RefreshCw className="w-8 h-8 text-[#c5a059] animate-spin" />
        </div>
      )}
    </div>
  );
}
