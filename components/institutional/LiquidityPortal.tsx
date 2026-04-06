"use client";

import { HandCoins, ArrowRightLeft, ShieldCheck, AlertCircle } from "lucide-react";

export function LiquidityPortal() {
  return (
    <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Liquidity matching engine (OTC)</h3>
          <p className="text-xs text-gray-400">Direkter Sekundärmarkt für großvolumige Token-Exits.</p>
        </div>
        <div className="bg-[#c5a059]/10 p-2 rounded-lg">
          <ArrowRightLeft className="w-5 h-5 text-[#c5a059]" />
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="bg-[#022c22] border border-yellow-500/20 p-3 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
          <p className="text-[10px] text-gray-300">
            Institutionelle Transaktionen {">"} 1 Mio. € erfordern eine manuelle Freigabe durch den Sharia-Compliance Officer.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="bg-[#022c22] border border-[#064e3b] hover:border-[#c5a059] p-4 rounded-xl text-center group transition-all">
            <HandCoins className="w-6 h-6 text-[#c5a059] mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">Token Sell-Side</span>
          </button>
          <button className="bg-[#022c22] border border-[#064e3b] hover:border-[#c5a059] p-4 rounded-xl text-center group transition-all">
            <ShieldCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">Equity Matching</span>
          </button>
        </div>
      </div>
      
      <button className="mt-6 w-full bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
        <ArrowRightLeft className="w-4 h-4" /> Trade Ticket eröffnen
      </button>
    </div>
  );
}
