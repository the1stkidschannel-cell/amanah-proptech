"use client";

interface Trade {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  time: string;
}

interface RecentTradesProps {
  trades: Trade[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">Letzte Trades (P2P)</h3>
      <div className="space-y-3">
        {trades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[#c5a059] font-bold w-10">{trade.symbol}</span>
              <span className="text-gray-400 text-[10px]">{trade.time}</span>
            </div>
            <div className="text-right">
              <span className="text-white font-medium">{trade.amount} Stk</span>
              <span className="text-gray-500 text-[10px] ml-2">@ €{trade.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
