"use client";

import { useState } from "react";
import { 
  Bot,
  PlayCircle,
  Activity,
  CheckCircle2,
  CalendarDays,
  Percent,
  Database,
  Calculator,
  RefreshCw
} from "lucide-react";

export default function AutomationPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const triggerDistribution = async () => {
    setIsRunning(true);
    setLogs([]);
    
    try {
      const response = await fetch('/api/automation/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_ijarah' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Stream logs slowly for visual effect
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 400));
          setLogs(prev => [...prev, data.logs[i]]);
        }
        setLastRun(new Date().toLocaleString('de-DE'));
      } else {
        setLogs(prev => [...prev, "[ERROR] " + data.error]);
      }
    } catch (e: any) {
      setLogs(prev => [...prev, "[CRITICAL ERROR] Failed to reach automation engine."]);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-400" /> Sharia AI Portfolio Automation
        </h1>
        <p className="text-gray-400 mt-2">
          Verwaltung der zentralen Hintergrundprozesse (Chron-Jobs). Hier werden monatliche Ijarah-Renditen (Mieten) von den SPVs an die globalen Investoren-Wallets allokiert.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#03362a] border border-[#064e3b] rounded-2xl p-6 shadow-xl">
             <h3 className="text-lg font-bold text-white mb-4 border-b border-[#064e3b] pb-2">Ijarah Engine (Ertragsverteilung)</h3>
             
             <div className="space-y-4 text-sm text-gray-300 mb-6">
               <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg border border-[#064e3b]/50">
                 <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-500"/> Rhythmus</span>
                 <span className="font-medium text-white">1. des Monats</span>
               </div>
               <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg border border-[#064e3b]/50">
                 <span className="flex items-center gap-2"><Percent className="w-4 h-4 text-gray-500"/> Berechnung</span>
                 <span className="font-medium text-white">(Yield.pa / 12) * Invest</span>
               </div>
               <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg border border-[#064e3b]/50">
                 <span className="flex items-center gap-2"><Database className="w-4 h-4 text-gray-500"/> Ledger</span>
                 <span className="font-medium text-white">Firestore & Polygon</span>
               </div>
               <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg shadow-inner">
                 <span className="text-gray-400">Letzter Lauf</span>
                 <span className="text-[#c5a059] font-mono text-xs">{lastRun || "Noch nie ausgeführt"}</span>
               </div>
             </div>

             <button 
                onClick={triggerDistribution}
                disabled={isRunning}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all"
             >
               {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
               {isRunning ? "Verarbeite..." : "Test-Iteration Starten"}
             </button>
             <p className="text-xs text-gray-500 mt-3 text-center">In Produktion wird dieser Prozess als GCP Cloud Function getriggert.</p>
          </div>

          <div className="bg-[#022c22] border-l-4 border-[#c5a059] rounded-r-2xl p-5 shadow-xl">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-[#c5a059]" /> Acid Compliance
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Die Automatisierungs-Engine nutzt Transaktions-Wrappers. Fällt das System während der Ausschüttung aus, wird ein Rollback durchgeführt, sodass Wallets nicht korrumpieren.
            </p>
          </div>
        </div>

        {/* Live Terminal */}
        <div className="lg:col-span-2">
          <div className="bg-[#080c0b] border border-gray-800 rounded-2xl p-6 shadow-2xl h-full min-h-[500px] font-mono flex flex-col relative overflow-hidden">
             
             <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4 z-10">
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${isRunning ? 'text-green-400 animate-pulse' : 'text-gray-600'}`} />
                  <h3 className="text-gray-300 font-bold tracking-wider">CLOUD_FUNCTIONS_TERMINAL</h3>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 z-10 text-sm">
                {!isRunning && logs.length === 0 && (
                  <p className="text-gray-600">waiting for signal... (System im Standby)</p>
                )}
                
                {logs.map((log, index) => {
                  let color = "text-gray-300";
                  if (log.includes("[ERROR]")) color = "text-red-400";
                  if (log.includes("[SUCCESS]")) color = "text-green-400 font-bold";
                  if (log.includes("--- Asset:")) color = "text-[#c5a059] font-bold mt-4 block";
                  if (log.includes("->")) color = "text-blue-300 pl-4";
                  
                  return (
                    <div key={index} className={`${color} break-words`}>
                       {log.startsWith("---") || log.startsWith("\n") ? log : `> ${log}`}
                    </div>
                  );
                })}
                
                {isRunning && (
                  <div className="flex items-center gap-2 text-yellow-400 mt-4">
                    <span className="w-2 h-4 bg-yellow-400 animate-pulse"></span>
                    <span>executing payout algorithm...</span>
                  </div>
                )}
             </div>

             {/* Terminal Background Effect */}
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
}
