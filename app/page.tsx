"use client";

import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Landmark, HandCoins, BarChart3, ShieldCheck, FileText, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName || "Investor";

  /* Chart data: Halal wealth trajectory */
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    let portfolio = 15000;
    return months.map((m) => {
      const ijarah = Math.round(portfolio * 0.004);
      portfolio += ijarah + Math.round(Math.random() * 60 - 10);
      return { month: m, Portfolio: portfolio, Ijarah: ijarah };
    });
  }, []);

  const kpis = [
    { label: "Gesamtes Halal-Portfolio", value: "15.000 €", icon: Landmark, color: "text-[#d4af37]" },
    { label: "Erhaltene Mieten (Ijarah)", value: "340 €", icon: HandCoins, color: "text-green-400" },
    { label: "Performance", value: "+4,8 % p.a.", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Aktive Token", value: "3", icon: BarChart3, color: "text-[#c5a059]" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Alhamdulillah, willkommen zurück, {displayName}.
        </h1>
        <p className="text-gray-400 mt-1">
          Ihr Riba-freies Immobilienportfolio im Überblick.
        </p>
      </div>

      {/* KYC Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
             <ShieldCheck className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">KYC-Verifizierung ausstehend</h3>
            <p className="text-xs text-gray-300">Um uneingeschränkt investieren zu können, schließen Sie bitte Ihr Onboarding gemäß Geldwäschegesetz (GwG) ab.</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = "/onboarding"}
          className="shrink-0 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
           Jetzt verifizieren
        </button>
      </div>

      {/* Executive Summary (Pitch Deck Section) */}
      <div className="bg-gradient-to-br from-[#022c22] to-[#03362a] border border-[#c5a059]/40 rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/5 blur-[80px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#c5a059]/20 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-[#c5a059]" />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Executive Summary</h2>
        </div>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl leading-relaxed">
          The first BaFin-regulated platform bridging MENA capital and European core real estate via eWpG tokenization. 100% Sharia-compliant.
        </p>
        <div className="flex flex-wrap gap-3">
           <span className="px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#d4af37] text-[10px] font-bold rounded-full uppercase">€ 500M Target AUM</span>
           <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold rounded-full uppercase">BaFin (eWpG)</span>
           <span className="px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#d4af37] text-[10px] font-bold rounded-full uppercase">AAOIFI Screened</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5 hover:border-[#c5a059]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {kpi.label}
              </span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">
          Riba-freier Vermögensverlauf
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Diminishing Musharakah – Ihr wachsender Eigentumsanteil (letzte 12 Monate)
        </p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradIjarah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#064e3b" opacity={0.5} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} width={50} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#03362a", border: "1px solid #064e3b", borderRadius: "8px", color: "#fff" }}
                labelStyle={{ color: "#c5a059" }}
                formatter={(value: any) => [`${new Intl.NumberFormat("de-DE").format(value)} €`]}
              />
              <Area type="monotone" dataKey="Portfolio" stroke="#c5a059" strokeWidth={2} fill="url(#gradPortfolio)" name="Portfoliowert" />
              <Area type="monotone" dataKey="Ijarah" stroke="#34d399" strokeWidth={2} fill="url(#gradIjarah)" name="Monatsmiete" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
