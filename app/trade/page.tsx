"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeftRight, TrendingUp, TrendingDown, Search, Filter, AlertCircle, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { OrderBook } from "@/components/trade/OrderBook";
import { RecentTrades } from "@/components/trade/RecentTrades";

// Mock data for the secondary market order book
const activeListings = [
  { id: "L1", symbol: "RRT", propertyName: "Wohnquartier Rhein-Ruhr", tokens: 150, askPrice: 102.50, originalPrice: 100.00, volume: 15375, yield: 4.6, seller: "0x3f...9a" },
  { id: "L2", symbol: "RRT", propertyName: "Wohnquartier Rhein-Ruhr", tokens: 25, askPrice: 99.00, originalPrice: 100.00, volume: 2475, yield: 4.85, seller: "0x88...2c" },
  { id: "L3", symbol: "MOT", propertyName: "Stadtresidenz München-Ost", tokens: 500, askPrice: 105.00, originalPrice: 100.00, volume: 52500, yield: 4.0, seller: "0x11...ff" },
  { id: "L4", symbol: "BMT", propertyName: "Quartier Berlin-Mitte", tokens: 10, askPrice: 512.00, originalPrice: 500.00, volume: 5120, yield: 4.0, seller: "0xaa...bb" },
];

const recentTrades = [
  { id: "T1", symbol: "MOT", price: 104.50, amount: 100, time: "Vor 12 Min" },
  { id: "T2", symbol: "RRT", price: 101.00, amount: 50, time: "Vor 1 Std" },
  { id: "T3", symbol: "RRT", price: 100.50, amount: 200, time: "Vor 3 Std" },
  { id: "T4", symbol: "MOT", price: 104.00, amount: 10, time: "Gestern" },
];

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [search, setSearch] = useState("");
  const [processingTrade, setProcessingTrade] = useState<string | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState<any>(null);

  const handleExecuteTrade = async (listing: any) => {
    setProcessingTrade(listing.id);
    
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: activeTab,
          listingId: listing.id,
          symbol: listing.symbol,
          amount: listing.tokens,
          price: listing.askPrice
        })
      });
      
      const data = await res.json();
      if(data.success) {
         setTradeSuccess(data);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setProcessingTrade(null);
      // Optional: hide success modal after delay
      setTimeout(() => setTradeSuccess(null), 5000);
    }
  };

  const filteredListings = activeListings.filter(l => 
    l.symbol.toLowerCase().includes(search.toLowerCase()) || 
    l.propertyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-[#c5a059] rounded-lg flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Sekundärmarkt</h1>
        </div>
        <p className="text-gray-400 max-w-2xl">
          Handeln Sie Ihre eWpG-Token Peer-to-Peer vor Ablauf der Haltefrist. P2P-Transaktionen sind 100% Sharia-konform, da echte Asset-Anteile übertragen werden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trading Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#03362a] border border-[#064e3b]/40 p-4 rounded-xl">
            <div className="flex bg-[#022c22] p-1 rounded-lg border border-[#064e3b]/30">
              <button 
                onClick={() => setActiveTab("buy")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "buy" ? "bg-[#064e3b] text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
              >
                Kaufen
              </button>
              <button 
                onClick={() => setActiveTab("sell")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "sell" ? "bg-[#064e3b] text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
              >
                Verkaufen
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Token oder Projekt suchen..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#022c22] border border-[#064e3b]/50 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Order Book / Listings */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#064e3b]/40 flex justify-between items-center">
              <h3 className="font-semibold text-white">Aktive Angebote (Orderbuch)</h3>
              <button className="text-gray-400 hover:text-[#c5a059] transition-colors"><Filter className="w-4 h-4" /></button>
            </div>
            
            <OrderBook 
              listings={filteredListings} 
              onTrade={handleExecuteTrade} 
              processingId={processingTrade} 
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5 space-y-4">
             <h3 className="font-semibold text-white mb-2">Marktdaten (24h)</h3>
             <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg border border-[#064e3b]/30">
               <span className="text-xs text-gray-400">Handelsvolumen</span>
               <span className="text-sm font-bold text-white">€ 42.500</span>
             </div>
             <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg border border-[#064e3b]/30">
               <span className="text-xs text-gray-400">Ausgeführte Trades</span>
               <span className="text-sm font-bold text-white">12</span>
             </div>
             <div className="flex justify-between items-center bg-[#022c22] p-3 rounded-lg border border-[#064e3b]/30">
               <span className="text-xs text-gray-400">Top Gainer</span>
               <div className="text-right">
                  <span className="text-sm text-[#d4af37] font-bold">MOT</span>
                  <span className="text-[10px] text-green-400 ml-1">+4.5%</span>
               </div>
             </div>
          </div>

          {/* Recent Trades Stream */}
          <RecentTrades trades={recentTrades} />

          {/* Sharia Compliance Note */}
          <div className="bg-[#022c22] border border-green-500/20 rounded-xl p-4 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-green-400 mb-1">Peer-to-Peer Trading</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Der Handel auf dem Sekundärmarkt ist strikt gedeckt durch die übertragenen Immobilienanteile. Kein Leerverkauf (Short-Selling), kein Margin-Trading. Gewährleistete AAOIFI-Compliance.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Trade Success Modal */}
      {tradeSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#022c22] border border-[#064e3b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up text-center space-y-4">
             <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
             </div>
             <h3 className="text-xl font-bold text-white">Atomic Swap Erfolgreich</h3>
             
             <div className="bg-[#03362a] rounded-xl p-4 text-left space-y-2 border border-[#064e3b]/50">
               <p className="text-xs text-gray-400 font-mono break-all mb-4">Tx: {tradeSuccess.txHash}</p>
               
               <div className="flex justify-between items-center border-b border-[#064e3b]/30 pb-2">
                 <span className="text-gray-400 text-sm">Asset Swap</span>
                 <span className="text-white font-bold">{tradeSuccess.tradeDetails.tokensTransferred} {tradeSuccess.tradeDetails.symbol}</span>
               </div>
               <div className="flex justify-between items-center border-b border-[#064e3b]/30 pb-2">
                 <span className="text-gray-400 text-sm">Durchschnittlicher Execution-Preis</span>
                 <span className="text-white font-bold">{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(tradeSuccess.tradeDetails.averagePrice || tradeSuccess.tradeDetails.executionPrice)}</span>
               </div>
               <div className="flex justify-between items-center border-b border-[#064e3b]/30 pb-2">
                 <span className="text-gray-400 text-sm">Target Volumen</span>
                 <span className="text-white font-bold">{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(tradeSuccess.tradeDetails.fiatTransferred)}</span>
               </div>
               <div className="flex justify-between items-center border-b border-[#064e3b]/30 pb-2">
                 <span className="text-gray-400 text-sm text-[#c5a059]">Platform Fee (Amanah)</span>
                 <span className="text-[#c5a059] font-bold">{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(tradeSuccess.tradeDetails.amanahPlatformFeeDue || 0)}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm">Status / Regulierung</span>
                 <span className={`${tradeSuccess.status === "partial" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"} px-2 py-0.5 rounded text-xs font-bold uppercase`}>{tradeSuccess.status} (eWpG)</span>
               </div>
             </div>

             {/* Matching Engine Logs View */}
             {tradeSuccess.logs && (
               <div className="bg-black/80 rounded-xl p-4 text-left border border-gray-800 mt-2 h-32 overflow-y-auto">
                 <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold tracking-widest">Matching Engine Output</p>
                 <div className="space-y-1 font-mono text-[10px]">
                   {tradeSuccess.logs.map((log: string, idx: number) => (
                     <div key={idx} className={log.includes("PARTIAL") ? "text-[#c5a059]" : log.includes("ERROR") ? "text-red-400" : "text-green-400"}>
                       {log}
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <button 
               onClick={() => setTradeSuccess(null)}
               className="w-full bg-[#064e3b] hover:bg-[#064e3b]/80 text-white font-bold py-3 rounded-xl transition-all"
             >
               Zurück zum Markt
             </button>
          </div>
        </div>
      )}

    </div>
  );
}
