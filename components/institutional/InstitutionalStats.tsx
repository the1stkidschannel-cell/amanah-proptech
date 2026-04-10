import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InstitutionalStatsProps {
  aum: number;
  yield: number;
  allocation: number;
}

export function InstitutionalStats({ aum, yield: yieldValue, allocation }: InstitutionalStatsProps) {
  const { t, lang, dir } = useLanguage();
  const isRTL = dir === "rtl";
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US', { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);

    <div className="space-y-4">
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 xl:gap-6 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="bg-[#03362a] border border-[#064e3b]/80 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
            <TrendingUp className="w-24 h-24 text-white" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{t('stat_aum') || "Gross AUM"} / Target 500M €</p>
          <p className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{formatCurrency(aum)}</p>
          <div className="mt-3 bg-[#01140f] h-1.5 w-full rounded-full overflow-hidden">
            <div className="h-full bg-[#c5a059]" style={{ width: `${Math.min((aum / 500000000) * 100, 100)}%` }}></div>
          </div>
          <p className="text-xs text-green-400 mt-2 font-mono">
             {((aum / 500000000) * 100).toFixed(2)}% of 2027 Pipeline Goal
          </p>
        </div>
        
        <div className="bg-[#03362a] border border-[#064e3b]/80 p-5 rounded-2xl z-10 relative">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{t('all_time_return') || "Net Target Margin"}</p>
          <p className="text-3xl lg:text-4xl font-bold text-[#c5a059] tracking-tight">{yieldValue}% <span className="text-lg text-gray-500 font-normal">p.a.</span></p>
          <div className="mt-3 bg-[#01140f] h-1.5 w-full rounded-full overflow-hidden">
             <div className="h-full bg-green-500" style={{ width: `${Math.min((yieldValue / 20) * 100, 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-mono flex items-center justify-between">
            <span>Target: 15-20% </span>
            <span className={yieldValue >= 15 ? 'text-green-400' : 'text-yellow-400'}>
              {yieldValue >= 15 ? 'ON TRACK' : 'IN GAP'}
            </span>
          </p>
        </div>
        
        <div className="bg-[#03362a] border border-[#064e3b]/80 p-5 rounded-2xl">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{t('fiat_balance') || "Liquid Fiat Deposit"}</p>
          <p className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{formatCurrency(allocation)}</p>
          <p className="text-xs text-blue-400 mt-5 font-mono bg-blue-500/10 px-2 py-1 rounded inline-block">
             <span className="animate-pulse mr-1">●</span> Stripe Connect LIVE
          </p>
        </div>
      </div>
    </div>
  );
}
