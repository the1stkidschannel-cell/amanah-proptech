"use client";

import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, CheckCircle, PieChart as PieChartIcon, TrendingUp, DollarSign, Globe, CreditCard, X, Download, RefreshCw, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const exchangeRates: Record<string, number> = {
  "EUR": 1,
  "USD": 1.08,
  "AED": 3.97
};

const currencySymbols: Record<string, string> = {
  "EUR": "€",
  "USD": "$",
  "AED": "د.إ"
};

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<"EUR" | "USD" | "AED">("EUR");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadingTx, setDownloadingTx] = useState<number | null>(null);
  
  const [tokenHoldings, setTokenHoldings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [baseFiatEUR, setBaseFiatEUR] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const walletAddress = "0xAm4n4h…3B7f";
  const userId = "test_user_66"; // Mock user for now

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In production, this fetches from /api/wallet or similar
      const mockHoldings = [
        { name: "Rhein-Ruhr Token", symbol: "RRT", amount: 50, value: 5125, changePercent: +2.5 },
        { name: "München-Ost Token", symbol: "MOT", amount: 30, value: 3030, changePercent: +1.0 },
      ];
      const mockTxs = [
        { id: 1, type: "in", label: "Ijarah-Ausschüttung", amount: "+28,00 €", date: "22. Mär 2026", asset: "RRT" },
        { id: 2, type: "in", label: "Ijarah-Ausschüttung", amount: "+14,50 €", date: "22. Mär 2026", asset: "MOT" },
        { id: 3, type: "out", label: "Token-Kauf", amount: "-5.000,00 €", date: "15. Mär 2026", asset: "RRT" },
      ];
      
      setTokenHoldings(mockHoldings);
      setTransactions(mockTxs);
      setBaseFiatEUR(1250.45);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/wallet/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tokenValueEUR = tokenHoldings.reduce((s, t) => s + t.value, 0);
  const pieData = [
    { name: "Immobilien Token", value: tokenValueEUR, color: "#c5a059" },
    { name: "Guthaben (Fiat)", value: baseFiatEUR, color: "#064e3b" },
  ];

  const formatCurrency = (amountInEUR: number) => {
    const converted = amountInEUR * exchangeRates[currency];
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : currency === "AED" ? "ar-AE" : "de-DE", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2
    }).format(converted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("0xAm4n4hPr0pT3ch000000000000003B7f");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowDeposit(false);
      setDepositAmount("");
    }, 2500);
  };

  const handleDownloadPDF = async (tx: any) => {
    setDownloadingTx(tx.id);
    try {
      const res = await fetch("/api/reporting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txId: `TX-${tx.id.toString().padStart(6, '0')}-${Date.now().toString().slice(-4)}`,
          type: tx.type === "in" ? "yield" : "buy",
          user: "Investitionskonto Amanah",
          amount: tx.amount,
          asset: tx.asset,
          date: tx.date
        })
      });
      const data = await res.json();
      if (data.success) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.pdfBase64}`;
        link.download = data.filename;
        link.click();
      }
    } catch (e) {
      console.error("Failed to generate PDF", e);
    }
    setDownloadingTx(null);
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Gesamtes Vermögen</span>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="bg-[#022c22] border border-[#064e3b] text-gray-300 text-xs rounded-md px-2 py-1 outline-none focus:border-[#c5a059]"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {isLoading ? "---" : formatCurrency(tokenValueEUR + baseFiatEUR)}
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-medium flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> +4.8%</span>
                <span className="text-gray-400">All-Time Return</span>
              </div>
            </div>
            
            <div className="bg-[#022c22]/50 backdrop-blur-md border border-[#c5a059]/30 rounded-xl p-4 min-w-[200px]">
              <p className="text-xs text-gray-400 mb-1">Ihre Wallet Adresse</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#d4af37]">{walletAddress}</span>
                <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors p-1">
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400 font-medium lowercase tracking-wide">Verfügbares Fiat</p>
              <p className="text-xl font-bold text-white">{isLoading ? "---" : formatCurrency(baseFiatEUR)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium lowercase tracking-wide">Token-Wert</p>
              <p className="text-xl font-bold text-[#c5a059]">{isLoading ? "---" : formatCurrency(tokenValueEUR)}</p>
            </div>
            <div className="flex items-center justify-end">
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2.5 rounded-xl flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase leading-tight">Compound Mode</p>
                    <p className="text-[9px] text-[#c5a059] font-medium leading-tight">Auto-Reinvest ON</p>
                  </div>
                  <div className="w-10 h-6 bg-[#c5a059] rounded-full relative p-1 cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-[#022c22] rounded-full shadow-sm" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-1 flex flex-col gap-4 justify-center">
          <button 
            onClick={handleSync}
            disabled={isSyncing || isLoading}
            className="w-full bg-[#022c22] border border-[#c5a059]/40 text-[#c5a059] font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-[#c5a059]/10 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} /> 
            <span>{isSyncing ? "Syncing..." : "On-Chain Sync"}</span>
          </button>
          <button onClick={() => setShowDeposit(true)} className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <ArrowDownLeft className="w-5 h-5" /> <span>Guthaben aufladen</span>
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
        <div className="lg:col-span-2 bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-[#064e3b]/40 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#c5a059]" /> Ihre Investments
            </h3>
            <button className="text-sm text-[#c5a059] hover:underline flex items-center gap-1">
               Handeln <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-[#064e3b]/30">
            {isLoading ? (
               <div className="p-12 text-center text-gray-500 animate-pulse">Lade Investments...</div>
            ) : tokenHoldings.map((t) => (
              <div key={t.symbol} className="px-6 py-5 flex items-center justify-between hover:bg-[#064e3b]/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c5a059] to-[#854d0e] rounded-xl flex items-center justify-center text-[#022c22] font-bold text-sm shadow-inner">
                    {t.symbol}
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.amount} Token gehalten</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-white">{formatCurrency(t.value)}</p>
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
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-[#064e3b]/40 flex justify-between items-center">
          <h3 className="font-semibold text-white flex items-center gap-2">
             <DollarSign className="w-5 h-5 text-[#c5a059]" /> Letzte Transaktionen
          </h3>
          <button className="text-xs text-gray-500 hover:text-white">Alle anzeigen</button>
        </div>
        <div className="divide-y divide-[#064e3b]/30">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse">Lade Transaktionen...</div>
          ) : transactions.map((tx) => (
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
              <div className="flex items-center space-x-3">
                 <span className={`text-base font-bold ${tx.type === "in" ? "text-green-400" : "text-white"}`}>
                   {tx.amount}
                 </span>
                 <button 
                   onClick={() => handleDownloadPDF(tx)} 
                   disabled={downloadingTx === tx.id}
                   className="p-2 ml-2 bg-[#022c22] border border-[#064e3b] text-gray-400 hover:text-[#c5a059] rounded-lg transition-colors disabled:opacity-50"
                 >
                   {downloadingTx === tx.id ? <span className="w-4 h-4 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin block"></span> : <Download className="w-4 h-4" />}
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#022c22] border border-[#064e3b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in-up">
            <div className="p-6 border-b border-[#064e3b] flex items-center justify-between">
               <h3 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#c5a059]" /> Einzahlung</h3>
               <button onClick={() => setShowDeposit(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="p-6 space-y-5">
               <div className="bg-[#03362a] p-4 rounded-xl border border-[#064e3b]/50">
                  <p className="text-xs text-gray-400 mb-1">Betrag ({currency})</p>
                  <div className="flex items-center gap-3">
                     <span className="text-2xl text-gray-500">{currencySymbols[currency]}</span>
                     <input 
                       type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} 
                       className="w-full bg-transparent text-3xl font-bold text-white outline-none" autoFocus
                     />
                  </div>
               </div>
               <button onClick={handleDeposit} disabled={isProcessing} className="w-full bg-[#c5a059] text-[#022c22] font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                  {isProcessing ? <RefreshCw className="animate-spin w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                  {isProcessing ? "Verarbeitung..." : "Jetzt einzahlen"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
