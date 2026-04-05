"use client";

import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, CheckCircle, PieChart as PieChartIcon, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const tokenHoldings = [
  { name: "Rhein-Ruhr Token", symbol: "RRT", amount: 50, value: 5125, changePercent: +2.5 },
  { name: "München-Ost Token", symbol: "MOT", amount: 30, value: 3030, changePercent: +1.0 },
];

const transactions = [
  { id: 1, type: "in", label: "Ijarah-Ausschüttung", amount: "+28,00 €", date: "22. Mär 2026", asset: "RRT" },
  { id: 2, type: "in", label: "Ijarah-Ausschüttung", amount: "+14,50 €", date: "22. Mär 2026", asset: "MOT" },
  { id: 3, type: "out", label: "Token-Kauf", amount: "-5.000,00 €", date: "15. Mär 2026", asset: "RRT" },
  { id: 4, type: "in", label: "Ijarah-Ausschüttung", amount: "+28,00 €", date: "22. Feb 2026", asset: "RRT" },
];

const pieData = [
  { name: "Immobilien Token (RRT, MOT)", value: 8155, color: "#c5a059" },
  { name: "Verfügbares Fiat-Guthaben", value: 1250, color: "#064e3b" },
];

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0xAm4n4h…3B7f";
  const totalValue = tokenHoldings.reduce((s, t) => s + t.value, 0) + 1250; // Plus Fiat balance

  const handleCopy = () => {
    navigator.clipboard.writeText("0xAm4n4hPr0pT3ch000000000000003B7f");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-[#c5a059]" /> Halal Wallet & Portfolio
        </h1>
        <p className="text-gray-400 mt-1 max-w-2xl">
          Verwalten Sie Ihre eWpG-Token, verfolgen Sie Ihre Ijarah-Ausschüttungen und analysieren Sie Ihre Portfolio-Performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#064e3b] to-[#03362a] border border-[#064e3b]/40 rounded-xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[140%] bg-[#c5a059]/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-300 font-medium uppercase tracking-wider mb-2">Gesamtes Krypto-Vermögen</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{new Intl.NumberFormat("de-DE").format(totalValue)} €</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-medium flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> +4.8%</span>
                <span className="text-gray-400">All-Time Return</span>
              </div>
            </div>
            
            <div className="bg-[#022c22]/50 backdrop-blur-md border border-[#c5a059]/30 rounded-xl p-4 min-w-[200px]">
              <p className="text-xs text-gray-400 mb-1">Ihre Wallet Adresse</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#d4af37]">{walletAddress}</span>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400">Verfügbares Fiat</p>
              <p className="text-xl font-bold text-white">1.250,00 €</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Token-Wert</p>
              <p className="text-xl font-bold text-[#c5a059]">8.155,00 €</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-1 flex flex-col gap-4 justify-center">
          <button className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <ArrowDownLeft className="w-5 h-5" /> <span>Guthaben aufladen</span>
          </button>
          <button className="w-full bg-[#03362a] border border-[#064e3b] hover:bg-[#064e3b]/50 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <ArrowUpRight className="w-5 h-5" /> <span>Auszahlen</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
         <div className="lg:col-span-1 bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[#c5a059]" /> Asset Allocation
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "#022c22", border: "1px solid #064e3b", borderRadius: "8px", color: "white" }}
                    itemStyle={{ color: "white" }}
                    formatter={(value: any) => `${new Intl.NumberFormat("de-DE").format(value)} €`}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "gray" }} iconType="circle" />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Token holdings */}
        <div className="lg:col-span-2 bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#064e3b]/40 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#c5a059]" /> Ihre Investments
            </h3>
            <button className="text-sm text-[#c5a059] hover:underline">Zum Sekundärmarkt</button>
          </div>
          <div className="divide-y divide-[#064e3b]/30">
            {tokenHoldings.map((t) => (
              <div key={t.symbol} className="px-6 py-5 flex items-center justify-between hover:bg-[#064e3b]/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c5a059] to-[#854d0e] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-white/20">
                    {t.symbol}
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.amount} Token gehalten</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-white">{new Intl.NumberFormat("de-DE").format(t.value)} €</p>
                  <p className={`text-sm font-medium ${t.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {t.changePercent >= 0 ? "+" : ""}{t.changePercent.toFixed(1)} % ROI
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#064e3b]/40">
          <h3 className="font-semibold text-white flex items-center gap-2">
             <DollarSign className="w-5 h-5 text-[#c5a059]" /> Letzte Transaktionen
          </h3>
        </div>
        <div className="divide-y divide-[#064e3b]/30">
          {transactions.map((tx) => (
            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#064e3b]/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "in" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {tx.type === "in" ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tx.label}</p>
                  <p className="text-xs text-gray-500">{tx.date} · Asset: <span className="text-[#c5a059] font-mono">{tx.asset}</span></p>
                </div>
              </div>
              <span className={`text-base font-bold ${tx.type === "in" ? "text-green-400" : "text-white"}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
