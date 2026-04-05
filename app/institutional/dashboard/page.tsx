"use client";

import { useState } from "react";
import { 
  Building2, 
  Users, 
  Key, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  Plus,
  RefreshCw,
  FolderTree,
  Mail,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const subAccounts = [
  { id: "SA-01", name: "MENA Real Estate Fund I", balance: 14500000, yield: 5.2 },
  { id: "SA-02", name: "DACH Logistics Allocation", balance: 28000000, yield: 5.8 },
  { id: "SA-03", name: "ESG Green Building Tranche", balance: 5200000, yield: 4.8 }
];

const allocationData = [
  { name: "Wohnquartiere", value: 45, color: "#c5a059" },
  { name: "Logistik", value: 35, color: "#854d0e" },
  { name: "Gewerbe", value: 20, color: "#064e3b" }
];

export default function FamilyOfficeDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "subaccounts" | "api" | "reports">("overview");

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#d4af37]/30 px-3 py-1 rounded-full text-xs font-bold text-[#d4af37] mb-3">
            <ShieldCheck className="w-3 h-3" />
            <span>Institutionelles Portfolio</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#c5a059]" /> Al-Maktoum Wealth Management
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Zentrale Verwaltung für institutionelle Token-Allokationen, Sub-Accounts und regulatorisches Reporting (eWpG & MiFID II).
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#03362a] border border-[#064e3b] hover:border-[#c5a059] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV Export
          </button>
          <button className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Bulk Invest (OTC)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#064e3b]/40 pb-px">
        {[
          { id: "overview", label: "Konsolidierte Übersicht", icon: PieChart },
          { id: "subaccounts", label: "Sub-Accounts", icon: FolderTree },
          { id: "api", label: "API Keys & Webhooks", icon: Key },
          { id: "reports", label: "Steuer & Compliance", icon: FileSpreadsheet }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5 rounded-t-lg"
                : "border-transparent text-gray-400 hover:text-white hover:bg-[#064e3b]/20 rounded-t-lg"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-right">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#03362a] border border-[#064e3b]/40 p-5 rounded-2xl">
                <p className="text-gray-400 text-xs font-semibold uppercase mb-1">AUM (Assets Under Management)</p>
                <p className="text-3xl font-bold text-white">€ 47.700.000</p>
                <p className="text-xs text-green-400 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12.4% YTD</p>
              </div>
              <div className="bg-[#03362a] border border-[#064e3b]/40 p-5 rounded-2xl">
                <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Konsolidierte Rendite (Ijarah)</p>
                <p className="text-3xl font-bold text-[#c5a059]">5.42% p.a.</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center">Gewichtet über alle Sub-Accounts</p>
              </div>
              <div className="bg-[#03362a] border border-[#064e3b]/40 p-5 rounded-2xl">
                <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Ausstehende Allokation</p>
                <p className="text-3xl font-bold text-white">€ 2.300.000</p>
                <p className="text-xs text-blue-400 mt-2 flex items-center">Fiat Bestand in Verwahrung</p>
              </div>
            </div>

            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Performance Historie</h3>
                <span className="text-xs bg-[#022c22] border border-[#064e3b] px-3 py-1 rounded-full text-gray-300">2026</span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2 border-b border-[#064e3b] pb-2">
                {[45, 52, 48, 61, 59, 75, 82, 0, 0, 0, 0, 0].map((val, i) => (
                  <div key={i} className="w-full bg-gradient-to-t from-[#c5a059] to-[#854d0e] rounded-t-sm" style={{ height: `${val}%`, opacity: val === 0 ? 0 : 1 }}></div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Dez</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Asset Allokation</h3>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={allocationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#022c22', border: '1px solid #064e3b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-bold text-xl">100%</span>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                {allocationData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div> {item.name}</span>
                    <span className="font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Sub-Accounts */}
      {activeTab === "subaccounts" && (
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 animate-fade-in-right">
          <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="text-lg font-bold text-white">SPV Mandate & Sub-Accounts</h3>
               <p className="text-sm text-gray-400">Verwalten Sie getrennte Krypto-Wallets für unterschiedliche Anlagevehikel Ihres Family Offices.</p>
             </div>
             <button className="bg-[#022c22] border border-[#064e3b] hover:border-[#c5a059] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2">
               <Plus className="w-4 h-4" /> Neues Mandat anlegen
             </button>
          </div>
          
          <div className="space-y-4">
            {subAccounts.map((sa) => (
              <div key={sa.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-[#022c22] border border-[#064e3b]/50 rounded-xl hover:border-[#c5a059]/50 transition-colors">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-[#064e3b]">
                    <FolderTree className="w-5 h-5 text-[#c5a059]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-lg">{sa.name}</h4>
                      <span className="text-[10px] bg-[#064e3b] text-white px-2 py-0.5 rounded uppercase">{sa.id}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Multi-Signature Wallet (eWpG registriert)</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 items-center">
                   <div>
                     <p className="text-xs text-gray-500 uppercase">AUM</p>
                     <p className="font-bold text-white">€ {(sa.balance / 1000000).toFixed(1)}M</p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500 uppercase">Yield p.a.</p>
                     <p className="font-bold text-green-400">{sa.yield}%</p>
                   </div>
                   <button className="text-gray-400 hover:text-white ml-4 flex items-center justify-center w-8 h-8 bg-[#03362a] rounded-full transition-colors">
                     <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: API */}
      {activeTab === "api" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-right">
           <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 space-y-6">
             <div>
               <h3 className="text-lg font-bold text-white mb-2">REST API Keys (Production)</h3>
               <p className="text-sm text-gray-400">Integrieren Sie unsere Token & Ijarah Feeds direkt in Ihre Bloomberg Terminals oder internen Wealth-Management Dashboards.</p>
             </div>
             
             <div className="bg-[#022c22] border border-[#064e3b]/50 rounded-xl p-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-white font-medium text-sm">Key: Amanah_Prod_Wealth_v1</span>
                 <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Aktiv</span>
               </div>
               <div className="flex items-center gap-2">
                 <input type="password" value="sk_live_amanah_8f92b3c4d5e6f7a8b9c0" readOnly className="flex-1 bg-[#03362a] border border-[#064e3b] text-white text-sm rounded-lg p-2 focus:outline-none" />
                 <button className="bg-[#c5a059] text-[#022c22] p-2 rounded-lg font-bold hover:brightness-110">Copy</button>
               </div>
             </div>

             <div className="pt-4 border-t border-[#064e3b]/40">
               <button className="text-sm font-bold text-white hover:text-[#c5a059] flex items-center gap-2">
                 <RefreshCw className="w-4 h-4" /> Neuen Schlüssel generieren
               </button>
             </div>
           </div>

           <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Webhook Endpunkte</h3>
              <p className="text-sm text-gray-400 mb-4">Empfangen Sie Echtzeit-Events über Transaktionen und Ijarah-Ausschüttungen in Ihrem System.</p>
              
              <div className="space-y-3">
                 <div className="bg-[#022c22] border border-[#064e3b]/50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-white font-mono">transaction.created</span>
                    </div>
                    <span className="text-xs text-gray-500">https://api.yourfamilyoffice.com/webhooks/amanah</span>
                 </div>
                 <div className="bg-[#022c22] border border-[#064e3b]/50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-white font-mono">ijarah.distributed</span>
                    </div>
                    <span className="text-xs text-gray-500">https://api.yourfamilyoffice.com/webhooks/amanah</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Tab Content: Reports */}
      {activeTab === "reports" && (
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 animate-fade-in-right min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
           <FileSpreadsheet className="w-16 h-16 text-[#c5a059] mb-2 opacity-80" />
           <h3 className="text-xl font-bold text-white">Zentralisiertes Compliance-Reporting</h3>
           <p className="text-gray-400 max-w-lg">
             Fordern Sie konsolidierte Steuerberichte, WpHG/MiFID II Aufstellungen und Zertifizierungen des AAOIFI Sharia Boards für das gesamte Quartal an.
           </p>
           <div className="flex gap-4 mt-6">
             <button className="bg-[#c5a059] text-[#022c22] px-6 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg flex items-center gap-2">
               <Download className="w-5 h-5" /> Q1 2026 Exportieren (PDF/CSV)
             </button>
             <button className="bg-[#022c22] border border-[#064e3b] hover:border-[#c5a059] text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2">
               <Mail className="w-5 h-5" /> An Wirtschaftsprüfer senden
             </button>
           </div>
        </div>
      )}

    </div>
  );
}
