"use client";

import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

interface Listing {
  id: string;
  symbol: string;
  propertyName: string;
  tokens: number;
  askPrice: number;
  originalPrice: number;
  volume: number;
}

interface OrderBookProps {
  listings: Listing[];
  onTrade: (listing: Listing) => void;
  processingId: string | null;
}

export function OrderBook({ listings, onTrade, processingId }: OrderBookProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#022c22]/50 border-b border-[#064e3b]/30 text-xs text-gray-500 uppercase tracking-wider">
            <th className="px-5 py-3 font-semibold">Asset</th>
            <th className="px-5 py-3 font-semibold">Menge</th>
            <th className="px-5 py-3 font-semibold">Preis</th>
            <th className="px-5 py-3 font-semibold text-right">Aktion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#064e3b]/20">
          {listings.map(listing => {
            const diff = ((listing.askPrice - listing.originalPrice) / listing.originalPrice) * 100;
            return (
              <tr key={listing.id} className="hover:bg-[#064e3b]/10 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#c5a059] flex items-center justify-center text-white text-[10px] font-bold">{listing.symbol}</div>
                    <div>
                      <p className="text-sm font-bold text-white">{listing.symbol}</p>
                      <p className="text-[10px] text-gray-500 w-24 truncate">{listing.propertyName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-300">{listing.tokens} Stk</td>
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-white">€{listing.askPrice.toFixed(2)}</p>
                  <p className={`text-[10px] flex items-center ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {diff >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {diff.toFixed(1)}%
                  </p>
                </td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={() => onTrade(listing)}
                    disabled={processingId === listing.id}
                    className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {processingId === listing.id ? "⌛" : "Trade"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
