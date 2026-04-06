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

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="bg-[#03362a] border border-[#064e3b]/40 p-5 rounded-2xl">
        <p className="text-gray-400 text-xs font-semibold uppercase mb-1">{t('stat_aum') || "AUM"}</p>
        <p className="text-3xl font-bold text-white">{formatCurrency(aum)}</p>
        <p className="text-xs text-green-400 mt-2 flex items-center">
          <TrendingUp className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}/> +12.4% YTD
        </p>
      </div>
      
      <div className="bg-[#03362a] border border-[#064e3b]/40 p-5 rounded-2xl">
        <p className="text-gray-400 text-xs font-semibold uppercase mb-1">{t('all_time_return') || "Yield"}</p>
        <p className="text-3xl font-bold text-[#c5a059]">{yieldValue}% p.a.</p>
        <p className="text-xs text-gray-500 mt-2">{t('on_chain_sync') || "On-Chain Sync"}</p>
      </div>
      
      <div className="bg-[#03362a] border border-[#064e3b]/40 p-5 rounded-2xl">
        <p className="text-gray-400 text-xs font-semibold uppercase mb-1">{t('fiat_balance') || "Fiat"}</p>
        <p className="text-3xl font-bold text-white">{formatCurrency(allocation)}</p>
        <p className="text-xs text-blue-400 mt-2">{t('deposit') || "Deposit"}</p>
      </div>
    </div>
  );
}
