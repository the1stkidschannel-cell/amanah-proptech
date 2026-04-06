"use client";

import { useState } from "react";
import { TrendingUp, PieChart, Calculator, RefreshCw } from "lucide-react";

export function ROISimulator() {
  const [amount, setAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [yieldRate, setYieldRate] = useState(4.5);

  const totalROI = amount * Math.pow(1 + yieldRate / 100, years) - amount;

  return (
    <div className="bg-[#03362a] border border-[#064e3b]/80 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-5 h-5 text-[#c5a059]" />
        <h3 className="text-lg font-bold text-white uppercase tracking-widest">Amanah ROI Simulator</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="text-[10px] text-gray-400 uppercase mb-2 block">Investition (€)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-[#022c22] border border-[#064e3b] p-3 rounded-xl text-white text-sm" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 uppercase mb-2 block">Dauer (Jahre)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-[#022c22] border border-[#064e3b] p-3 rounded-xl text-white text-sm" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 uppercase mb-2 block">Erwartete Rendite (%)</label>
          <input type="number" step="0.1" value={yieldRate} onChange={(e) => setYieldRate(Number(e.target.value))} className="w-full bg-[#022c22] border border-[#064e3b] p-3 rounded-xl text-white text-sm" />
        </div>
      </div>
      <div className="bg-[#022c22] border border-[#c5a059]/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Geschätzter Gesamtertrag (Halal Dividenden)</p>
          <h2 className="text-3xl font-bold text-[#c5a059]">+ € {new Intl.NumberFormat("de-DE").format(Math.round(totalROI))}</h2>
        </div>
        <div className="bg-[#c5a059]/10 p-4 rounded-xl text-[10px] text-gray-400 max-w-[200px] italic">
          "Halal Ijarah ROI basiert auf Asset-Ownership (Musharakah), nicht auf Zins-Kredit (Riba)."
        </div>
      </div>
    </div>
  );
}
