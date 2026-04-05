"use client";

import { useState } from "react";
import { Send, Users, Mail, CheckCircle2, Search, Briefcase, Filter } from "lucide-react";

export default function OutreachEngine() {
  const [campaignState, setCampaignState] = useState(0);

  const startOutreach = () => {
    setCampaignState(1);
    setTimeout(() => setCampaignState(2), 2000); // Searching
    setTimeout(() => setCampaignState(3), 4000); // Drafting
    setTimeout(() => setCampaignState(4), 6000); // Sending
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
          <Send className="w-8 h-8 text-[#c5a059]" />
          B2B Outreach Engine
        </h1>
        <p className="text-gray-400 mt-1 max-w-2xl">
          Automatisierte Akquise für Family Offices, Vermögensverwalter und Projektentwickler zur Skalierung auf unser 100 Mio. € Ziel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Configurator */}
        <div className="bg-[#03362a] border border-[#064e3b]/80 rounded-2xl p-6 relative overflow-hidden">
           <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Filter className="w-5 h-5 text-[#c5a059]" />
             Kampagne konfigurieren
           </h2>
           
           <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Zielgruppe (Target)</label>
                <select className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]">
                  <option>MENA Family Offices (Dubai/Abu Dhabi)</option>
                  <option>Deutsche institutionelle Stiftungen</option>
                  <option>Projektentwickler (DACH Raum)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">USP Fokus im Text</label>
                <select className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]">
                  <option>BaFin & eWpG konforme Tokenisierung</option>
                  <option>Hohe Zielrenditen & Liquidität über Secondary Market</option>
                  <option>Sharia Compliant Portfolio</option>
                </select>
              </div>

              <button 
                onClick={startOutreach}
                disabled={campaignState > 0}
                className="w-full mt-4 px-4 py-3 bg-[#c5a059] hover:bg-[#d4af37] disabled:opacity-50 text-[#022c22] font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {campaignState > 0 ? "KI-Pipeline läuft..." : "Outreach Kampagne starten"}
                {!campaignState && <Send className="w-4 h-4" />}
              </button>
           </div>
        </div>

        {/* Live Terminal & Logs */}
        <div className="bg-[#03362a] border border-[#064e3b]/80 rounded-2xl p-6">
           <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
             <Mail className="w-4 h-4 text-[#c5a059]" /> Kampagnen-Log
           </h2>
           
           <div className="bg-[#01140f] p-4 rounded-xl border border-[#064e3b] font-mono text-xs overflow-hidden h-[240px] flex flex-col justify-end">
             <div className="space-y-2 text-gray-400 opacity-80">
                <p>&gt; System Ready. Warte auf Kampagnen-Auslösung...</p>
                
                {campaignState >= 1 && (
                  <p className="text-blue-400">&gt; Initialisiere Apollo.io & LinkedIn Sales Navigator Connector...</p>
                )}
                {campaignState >= 2 && (
                  <p>&gt; <span className="text-yellow-400">Scraping:</span> 142 Family Offices in Dubai identifiziert.</p>
                )}
                {campaignState >= 3 && (
                   <p className="text-yellow-400">&gt; GPT-4 personalisiert Email-Texte basierend auf eWpG Use-Case...</p>
                )}
                {campaignState >= 4 && (
                  <>
                    <p className="text-green-400 font-bold">&gt; BATCH 1 (50 Emails) ERFOLGREICH VERSENDET.</p>
                    <p className="text-gray-500">&gt; Nächster Batch in 24 Stunden, um Spam-Filter zu vermeiden.</p>
                  </>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
