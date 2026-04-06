"use client";

import { properties } from "@/lib/properties";
import { ChevronRight, ShieldCheck, MapPin } from "lucide-react";

export function DealFlowTable() {
  const highTicketProperties = properties.filter(p => p.targetVolume >= 2000000);

  return (
    <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Institutional Deal-Flow</h3>
        <span className="text-xs text-gray-400 bg-[#022c22] border border-[#064e3b] px-3 py-1 rounded-full uppercase tracking-widest">
          {highTicketProperties.length} Aktive Objekte
        </span>
      </div>
      
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left min-w-[600px] lg:min-w-0">
          <thead>
            <tr className="text-gray-500 text-[10px] sm:text-xs uppercase border-b border-[#064e3b]/50">
              <th className="pb-4 font-semibold tracking-widest pl-2">Asset</th>
              <th className="pb-4 font-semibold tracking-widest">Location</th>
              <th className="pb-4 font-semibold tracking-widest text-right">Volume</th>
              <th className="pb-4 font-semibold tracking-widest text-right">Yield</th>
              <th className="pb-4 font-semibold tracking-widest text-right">Status</th>
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#064e3b]/30">
            {highTicketProperties.map((p) => (
              <tr key={p.id} className="group hover:bg-[#064e3b]/10 transition-colors">
                <td className="py-4 pr-4 pl-2">
                  <p className="font-bold text-white text-sm tracking-tight">{p.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{p.type}</p>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <MapPin className="w-3 h-3 text-[#c5a059]" /> {p.city}
                  </div>
                </td>
                <td className="py-4 pr-4 font-bold text-white text-sm text-right">
                  € {(p.targetVolume / 1000000).toFixed(1)}M
                </td>
                <td className="py-4 pr-4 text-green-400 font-bold text-sm text-right">
                  {p.yield}%
                </td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-[9px] sm:text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> <span className="uppercase font-bold tracking-tighter">Verified</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button className="text-gray-500 hover:text-[#c5a059] transition-colors p-1 group-hover:translate-x-1 duration-300">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
