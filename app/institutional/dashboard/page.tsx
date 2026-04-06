"use client";

import { useState, useEffect, useCallback } from "react";
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
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { InstitutionalStats } from "@/components/institutional/InstitutionalStats";
import { DealFlowTable } from "@/components/institutional/DealFlowTable";
import { LiquidityPortal } from "@/components/institutional/LiquidityPortal";
import { ROISimulator } from "@/components/tools/ROISimulator";

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

type LogEntry = { ts: string; phase: string; status: string; msg: string };
type EngineStats = { total: number; errors: number; lastRun: string | null; phaseCounts: Record<string, number> };

export default function FamilyOfficeDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "subaccounts" | "api" | "reports" | "engine">("overview");
  const [engineLogs, setEngineLogs] = useState<LogEntry[]>([]);
  const [engineStats, setEngineStats] = useState<EngineStats | null>(null);
  const [engineLoading, setEngineLoading] = useState(false);

  const fetchEngineLogs = useCallback(async () => {
    setEngineLoading(true);
    try {
      const res = await fetch('/api/engine/log');
      const data = await res.json();
      setEngineLogs(data.entries || []);
      setEngineStats(data.stats || null);
    } catch {}
    setEngineLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'engine') {
      fetchEngineLogs();
      const interval = setInterval(fetchEngineLogs, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchEngineLogs]);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#d4af37]/30 px-3 py-1 rounded-full text-xs font-bold text-[#d4af37] mb-3">
            <ShieldCheck className="w-3 h-3" />
            <span>Institutionelles Portfolio</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#c5a059]" /> Al-Maktoum Wealth Management
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Zentrale Verwaltung für institutionelle Token-Allokationen, Sub-Accounts und regulatorisches Reporting (eWpG & MiFID II).
          </p>
        </div>
        <div className="flex flex-row md:flex-row gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center bg-[#03362a] border border-[#064e3b] hover:border-[#c5a059] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-lg flex items-center gap-2">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">CSV Export</span><span className="sm:hidden">CSV</span>
          </button>
          <button className="flex-1 md:flex-none justify-center bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center gap-2 uppercase tracking-tighter">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Bulk Invest (OTC)</span><span className="sm:hidden">OTC</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#064e3b]/40 pb-px overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: "overview", label: "Konsolidierte Übersicht", icon: PieChart },
          { id: "subaccounts", label: "Sub-Accounts", icon: FolderTree },
          { id: "engine", label: "500M Engine", icon: Zap },
          { id: "api", label: "API Keys & Webhooks", icon: Key },
          { id: "reports", label: "Steuer & Compliance", icon: FileSpreadsheet }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? tab.id === 'engine'
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/5 rounded-t-lg'
                  : "border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5 rounded-t-lg"
                : "border-transparent text-gray-400 hover:text-white hover:bg-[#064e3b]/20 rounded-t-lg"
            }`}
          >
            <tab.icon className="w-4 h-4 shrink-0" /> {tab.label}
            {tab.id === 'engine' && (
              <span className="ml-1 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-right">
          
          <div className="lg:col-span-2 space-y-6">
            <InstitutionalStats aum={47700000} yield={5.42} allocation={2300000} />
            <DealFlowTable />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ROISimulator />
            <LiquidityPortal />
            
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
              <div key={sa.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 bg-[#022c22] border border-[#064e3b]/50 rounded-xl hover:border-[#c5a059]/50 transition-colors gap-4">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-[#064e3b] shrink-0">
                    <FolderTree className="w-4 h-4 sm:w-5 sm:h-5 text-[#c5a059]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base sm:text-lg truncate">{sa.name}</h4>
                      <span className="text-[9px] bg-[#064e3b] text-white px-1.5 py-0.5 rounded uppercase shrink-0">{sa.id}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Multi-Signature Wallet (eWpG)</p>
                  </div>
                </div>
                
                <div className="flex w-full sm:w-auto justify-between sm:justify-start items-center gap-4 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#064e3b]/30">
                   <div className="flex flex-col">
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest">AUM</p>
                     <p className="font-bold text-white text-sm sm:text-base">€ {(sa.balance / 1000000).toFixed(1)}M</p>
                   </div>
                   <div className="flex flex-col">
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest">Yield</p>
                     <p className="font-bold text-green-400 text-sm sm:text-base">{sa.yield}%</p>
                   </div>
                   <button className="text-gray-400 hover:text-white flex items-center justify-center w-8 h-8 bg-[#03362a] rounded-full transition-colors shrink-0">
                     <ChevronRight className="w-4 h-4" />
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

      {/* Tab Content: 500M Engine Command Center */}
      {activeTab === "engine" && (
        <div className="space-y-6 animate-fade-in-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#03362a] to-[#022c22] border border-yellow-400/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">500M Scaling Engine</h2>
                <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Live</span>
              </div>
              <p className="text-sm text-gray-400">Autonomer B2B-Outreach Loop · Harvest → Audit → Outreach → Analytics</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchEngineLogs}
                className="flex items-center gap-2 bg-[#022c22] border border-[#064e3b] hover:border-yellow-400/50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${engineLoading ? 'animate-spin' : ''}`} /> Aktualisieren
              </button>
            </div>
          </div>

          {/* Stats Row */}
          {engineStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Log Einträge', value: engineStats.total, icon: Activity, color: 'text-blue-400' },
                { label: 'Fehler', value: engineStats.errors, icon: XCircle, color: 'text-red-400' },
                { label: 'Outreach Läufe', value: engineStats.phaseCounts?.['OUTREACH'] || 0, icon: Mail, color: 'text-green-400' },
                { label: 'Letzter Zyklus', value: engineStats.lastRun ? new Date(engineStats.lastRun).toLocaleTimeString('de-DE') : 'Noch nie', icon: CheckCircle2, color: 'text-yellow-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Log Stream */}
          <div className="bg-[#011a14] border border-[#064e3b]/40 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#064e3b]/40">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" /> Autonomous Engine Log
              </h3>
              <span className="text-xs text-gray-500">Letzte 50 Einträge · Auto-Refresh alle 10s</span>
            </div>
            <div className="max-h-96 overflow-y-auto font-mono text-xs p-4 space-y-1">
              {engineLoading && engineLogs.length === 0 && (
                <p className="text-gray-500 text-center py-8">Lade Engine-Log... Starte zuerst: <code className="text-yellow-400">node scripts/autonomous_loop.js --dry-run --once</code></p>
              )}
              {!engineLoading && engineLogs.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <Zap className="w-10 h-10 text-yellow-400/40 mx-auto" />
                  <p className="text-gray-500">Engine noch nicht gestartet.</p>
                  <p className="text-gray-600">Starte mit: <code className="text-yellow-400 bg-[#03362a] px-2 py-1 rounded">scripts\launch_500m_engine.bat</code></p>
                </div>
              )}
              {engineLogs.map((entry, i) => {
                const statusColor = entry.status === 'OK' ? 'text-green-400' : entry.status === 'ERROR' || entry.status === 'FATAL' ? 'text-red-400' : entry.status === 'WARN' ? 'text-yellow-400' : 'text-blue-400';
                const phaseColor: Record<string, string> = { HARVEST: 'text-purple-400', AUDIT: 'text-blue-400', OUTREACH: 'text-green-400', ANALYTICS: 'text-yellow-400', SYSTEM: 'text-gray-400' };
                return (
                  <div key={i} className="flex gap-3 py-1 border-b border-[#064e3b]/20 hover:bg-[#03362a]/30">
                    <span className="text-gray-600 shrink-0">{new Date(entry.ts).toLocaleTimeString('de-DE')}</span>
                    <span className={`shrink-0 w-20 ${phaseColor[entry.phase] || 'text-gray-400'}`}>[{entry.phase}]</span>
                    <span className={`shrink-0 w-16 font-bold ${statusColor}`}>{entry.status}</span>
                    <span className="text-gray-300 break-all">{entry.msg}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quickstart */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Engine Schnellstart</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: '1. Testlauf (kein Versand)', cmd: 'node scripts/autonomous_loop.js --dry-run --once', color: 'border-blue-400/30 text-blue-400' },
                { label: '2. Dauerschleife (Dry-Run)', cmd: 'node scripts/autonomous_loop.js --dry-run', color: 'border-yellow-400/30 text-yellow-400' },
                { label: '3. LIVE starten', cmd: 'node scripts/autonomous_loop.js', color: 'border-green-400/30 text-green-400' },
              ].map((item, i) => (
                <div key={i} className={`bg-[#022c22] border ${item.color} rounded-xl p-4`}>
                  <p className={`text-xs font-bold mb-2 ${item.color.split(' ')[1]}`}>{item.label}</p>
                  <code className="text-gray-300 text-xs break-all">{item.cmd}</code>
                </div>
              ))}
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
