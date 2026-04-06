"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Server, AlertCircle, RefreshCw, LayoutList } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/audit");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-400 mb-3">
            <ShieldCheck className="w-3 h-3" />
            <span>BaFin Compliance Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            System & Admin Audit Logs
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Einträge über sämtliche adminstrativen Änderungen an Immobilienwerten, KYC-Clearances und autonomen Bot-Sourcing Aktionen. (Read-Only)
          </p>
        </div>
        <button 
          onClick={fetchLogs} 
          className="bg-[#03362a] border border-[#064e3b] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#064e3b] transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c5a059]' : ''}`} /> Logs aktualisieren
        </button>
      </div>

      {/* Log Feed */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-[#022c22] border-b border-[#064e3b] p-4 flex gap-2 items-center">
          <Server className="w-5 h-5 text-gray-400"/>
          <h3 className="font-bold text-white text-sm">Audit Trail Pipeline</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 flex justify-center">
             <RefreshCw className="w-6 h-6 text-[#c5a059] animate-spin" />
          </div>
        ) : (
          <div className="p-0">
            {logs.map((log: any, index: number) => (
              <div 
                key={log.id} 
                className={`p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-[#064e3b]/30 transition-colors ${index !== logs.length - 1 ? 'border-b border-[#064e3b]/50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg shrink-0 ${log.admin.includes('SYSTEM') || log.admin.includes('Bot') ? 'bg-blue-500/20 text-blue-400' : 'bg-[#c5a059]/20 text-[#c5a059]'}`}>
                    <LayoutList className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{log.action}</h4>
                    <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                    <div className="flex gap-3 text-[10px] font-bold mt-2">
                       <span className="text-gray-500 bg-[#022c22] border border-[#064e3b] px-2 py-0.5 rounded">ID: {log.entityId}</span>
                       <span className="text-gray-500 bg-[#022c22] border border-[#064e3b] px-2 py-0.5 rounded">Admin: {log.admin}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 font-medium shrink-0 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#c5a059]" />
                  {new Date(log.timestamp).toLocaleString("de-DE")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
