"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  TrendingUp,
  FileText,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Search,
  Bot,
  Link as LinkIcon,
  ChevronRight
} from "lucide-react";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  volume: string;
  createdAt: any;
}

interface AuditEntry {
  id: string;
  fileName: string;
  status: string;
  timestamp: string;
  userId: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "waitlist" | "audits" | "properties" | "sourcing">("overview");
  
  // AI Sourcing State
  const [dealUrl, setDealUrl] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Demo data for when Firebase isn't configured
  const demoWaitlist: WaitlistEntry[] = [
    { id: "1", name: "Ahmed Rahman", email: "ahmed@example.de", volume: "25k+", createdAt: { toDate: () => new Date() } },
    { id: "2", name: "Fatima Al-Rashid", email: "fatima@example.de", volume: "5k-25k", createdAt: { toDate: () => new Date(Date.now() - 86400000) } },
    { id: "3", name: "Omar Mustafa", email: "omar@example.de", volume: "25k+", createdAt: { toDate: () => new Date(Date.now() - 172800000) } },
    { id: "4", name: "Leila Hassan", email: "leila@example.de", volume: "1k-5k", createdAt: { toDate: () => new Date(Date.now() - 259200000) } },
    { id: "5", name: "Yusuf Ibrahim", email: "yusuf@example.de", volume: "5k-25k", createdAt: { toDate: () => new Date(Date.now() - 345600000) } },
    { id: "6", name: "Amira Said", email: "amira@example.de", volume: "25k+", createdAt: { toDate: () => new Date(Date.now() - 432000000) } },
    { id: "7", name: "Karim Rashidi", email: "karim@example.de", volume: "5k-25k", createdAt: { toDate: () => new Date(Date.now() - 518400000) } },
    { id: "8", name: "Nour Al-Din", email: "nour@example.de", volume: "25k+", createdAt: { toDate: () => new Date(Date.now() - 604800000) } },
  ];

  const demoAudits: AuditEntry[] = [
    { id: "a1", fileName: "Mietvertrag_Berlin.pdf", status: "COMPLIANT", timestamp: new Date().toISOString(), userId: "user1" },
    { id: "a2", fileName: "Darlehensvertrag_Sparkasse.pdf", status: "NON_COMPLIANT", timestamp: new Date(Date.now() - 86400000).toISOString(), userId: "user1" },
    { id: "a3", fileName: "Musharakah_Agreement.pdf", status: "COMPLIANT", timestamp: new Date(Date.now() - 172800000).toISOString(), userId: "user2" },
    { id: "a4", fileName: "Sukuk_Prospekt.pdf", status: "COMPLIANT", timestamp: new Date(Date.now() - 259200000).toISOString(), userId: "user3" },
    { id: "a5", fileName: "Hypothekenvertrag.pdf", status: "NON_COMPLIANT", timestamp: new Date(Date.now() - 345600000).toISOString(), userId: "user2" },
  ];

  useEffect(() => {
    const loadData = async () => {
      if (!db) {
        setWaitlist(demoWaitlist);
        setAudits(demoAudits);
        return;
      }

      try {
        const wq = query(collection(db, "waitlist"), orderBy("createdAt", "desc"), limit(50));
        const wSnap = await getDocs(wq);
        setWaitlist(wSnap.docs.map((d) => ({ id: d.id, ...d.data() } as WaitlistEntry)));

        const aq = query(collection(db, "compliance_audits"), orderBy("createdAt", "desc"), limit(50));
        const aSnap = await getDocs(aq);
        setAudits(aSnap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditEntry)));
      } catch (err) {
        console.error("Admin data load error:", err);
        setWaitlist(demoWaitlist);
        setAudits(demoAudits);
      }
    };

    loadData();
  }, []);

  const totalLeadVolume = waitlist.reduce((sum, w) => {
    if (w.volume === "25k+") return sum + 35000;
    if (w.volume === "5k-25k") return sum + 15000;
    return sum + 3000;
  }, 0);

  const complianceRate = audits.length > 0
    ? Math.round((audits.filter((a) => a.status === "COMPLIANT").length / audits.length) * 100)
    : 0;

  const tabs = [
    { id: "overview" as const, label: "Übersicht", icon: LayoutDashboard },
    { id: "sourcing" as const, label: "AI Sourcing", icon: Sparkles },
    { id: "waitlist" as const, label: `Waitlist (${waitlist.length})`, icon: Users },
    { id: "audits" as const, label: `Audits (${audits.length})`, icon: ShieldCheck },
    { id: "properties" as const, label: "Objekte", icon: Building2 },
  ];

  const handleAiEvaluation = () => {
    if (!dealUrl) return;
    setIsEvaluating(true);
    // Simulate complex AI underwriting process
    setTimeout(() => {
      setAiReport({
        score: 92,
        title: "Logistikpark Hannover-Messe",
        volume: "18.500.000 €",
        irr: "7,8%",
        shariaCheck: "Pass",
        flags: ["Keine Alkohol-Gewerbemieter", "Zinsfreies Verkäuferdarlehen möglich", "ESG-Klasse A"],
        verdict: "Strong Buy - Ready for Tokenization"
      });
      setIsEvaluating(false);
    }, 2800);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Plattform-Management & Investor Pipeline
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[#03362a] rounded-xl p-1 border border-[#064e3b]/40 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#c5a059]/15 text-[#d4af37]"
                : "text-gray-400 hover:text-white hover:bg-[#064e3b]/30"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Waitlist Leads</span>
                <Users className="w-5 h-5 text-[#c5a059]" />
              </div>
              <p className="text-3xl font-bold text-white">{waitlist.length}</p>
              <p className="text-xs text-green-400 flex items-center space-x-1 mt-2">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{Math.min(waitlist.length, 3)} diese Woche</span>
              </p>
            </div>
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pipeline Volume</span>
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{new Intl.NumberFormat("de-DE").format(totalLeadVolume)} €</p>
              <p className="text-xs text-gray-500 mt-2">Geschätztes Investmentpotenzial</p>
            </div>
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sharia Audits</span>
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{audits.length}</p>
              <p className="text-xs text-gray-500 mt-2">{complianceRate}% Compliance Rate</p>
            </div>
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Aktive Objekte</span>
                <Building2 className="w-5 h-5 text-[#c5a059]" />
              </div>
              <p className="text-3xl font-bold text-white">2</p>
              <p className="text-xs text-[#c5a059] mt-2">6.7M € Gesamtvolumen</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Waitlist Signups */}
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#064e3b]/40 flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">Neueste Leads</h3>
                <button onClick={() => setActiveTab("waitlist")} className="text-xs text-[#c5a059] hover:underline">Alle anzeigen</button>
              </div>
              <div className="divide-y divide-[#064e3b]/30">
                {waitlist.slice(0, 4).map((w) => (
                  <div key={w.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] font-bold text-xs">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{w.name}</p>
                        <p className="text-xs text-gray-500">{w.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      w.volume === "25k+" ? "bg-green-500/10 text-green-400" : "bg-[#c5a059]/10 text-[#c5a059]"
                    }`}>
                      {w.volume}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audits */}
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#064e3b]/40 flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">Neueste Audits</h3>
                <button onClick={() => setActiveTab("audits")} className="text-xs text-[#c5a059] hover:underline">Alle anzeigen</button>
              </div>
              <div className="divide-y divide-[#064e3b]/30">
                {audits.slice(0, 4).map((a) => (
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        a.status === "COMPLIANT" ? "bg-green-500/10" : "bg-red-500/10"
                      }`}>
                        {a.status === "COMPLIANT" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">{a.fileName}</p>
                        <p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleDateString("de-DE")}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${a.status === "COMPLIANT" ? "text-green-400" : "text-red-400"}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Tab */}
      {activeTab === "waitlist" && (
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#064e3b]/40 flex items-center justify-between">
            <h3 className="font-semibold text-white">Investor Waitlist</h3>
            <span className="text-xs text-gray-500">{waitlist.length} Einträge</span>
          </div>
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-[#064e3b]/20">
            <div className="col-span-4">Name / E-Mail</div>
            <div className="col-span-3">Volumen</div>
            <div className="col-span-3">Datum</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y divide-[#064e3b]/30">
            {waitlist.map((w) => (
              <div key={w.id} className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-5 py-4 items-center hover:bg-[#064e3b]/10 transition-colors">
                <div className="lg:col-span-4 flex items-center space-x-3">
                  <div className="w-9 h-9 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] font-bold text-xs shrink-0">
                    {w.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{w.name}</p>
                    <p className="text-xs text-gray-500 truncate">{w.email}</p>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <span className={`inline-flex text-xs font-bold px-3 py-1 rounded-full ${
                    w.volume === "25k+" ? "bg-green-500/10 text-green-400" :
                    w.volume === "5k-25k" ? "bg-[#c5a059]/10 text-[#c5a059]" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    {w.volume === "25k+" ? "€25.000+" : w.volume === "5k-25k" ? "€5.000-25.000" : "€1.000-5.000"}
                  </span>
                </div>
                <div className="lg:col-span-3 flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{w.createdAt?.toDate ? w.createdAt.toDate().toLocaleDateString("de-DE") : "N/A"}</span>
                </div>
                <div className="lg:col-span-2">
                  <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-full font-medium">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === "audits" && (
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#064e3b]/40 flex items-center justify-between">
            <h3 className="font-semibold text-white">Sharia Audit Log</h3>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1"><CheckCircle className="w-3 h-3 text-green-400" /><span>{audits.filter(a => a.status === "COMPLIANT").length} Compliant</span></span>
              <span className="flex items-center space-x-1"><XCircle className="w-3 h-3 text-red-400" /><span>{audits.filter(a => a.status === "NON_COMPLIANT").length} Non-Compliant</span></span>
            </div>
          </div>
          <div className="divide-y divide-[#064e3b]/30">
            {audits.map((a) => (
              <div key={a.id} className="px-5 py-4 flex items-center justify-between hover:bg-[#064e3b]/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    a.status === "COMPLIANT" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {a.status === "COMPLIANT" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{a.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(a.timestamp).toLocaleDateString("de-DE")} • User: {a.userId?.substring(0, 8) || "demo"}...
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  a.status === "COMPLIANT" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div className="space-y-4">
          {[
            { name: "Wohnquartier Rhein-Ruhr", location: "Essen, NRW", volume: "2.5M €", funded: 48, yield: 4.8, status: "funding" },
            { name: "Stadtresidenz München-Ost", location: "München, Bayern", volume: "4.2M €", funded: 22, yield: 4.2, status: "funding" },
          ].map((p, i) => (
            <div key={i} className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#c5a059]" />
                </div>
                <div>
                  <p className="text-white font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Volumen</p>
                  <p className="font-semibold text-white">{p.volume}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Funded</p>
                  <p className="font-semibold text-[#c5a059]">{p.funded}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rendite</p>
                  <p className="font-semibold text-green-400">{p.yield}%</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold uppercase">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Sourcing Tab */}
      {activeTab === "sourcing" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#03362a] to-[#022c22] border border-[#064e3b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-[#c5a059]/5 w-64 h-64 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-[#c5a059]" />
                  <span>Sharia AI Deal Underwriting</span>
                </h2>
                <p className="text-sm text-gray-400 mt-2 max-w-2xl">
                  Unser neuronales KI-Modell liest Exposés, bewertet die Makro- und Mikrolage, führt einen regulatorischen Sharia-Screening-Prozess durch und kalkuliert die IRR-Netto-Rendite für Investoren &mdash; vollautomatisiert.
                </p>
              </div>
              <div className="hidden sm:flex bg-[#064e3b]/30 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg items-center space-x-2 text-xs font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span>LLM Engine Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <LinkIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={dealUrl}
                  onChange={(e) => setDealUrl(e.target.value)}
                  placeholder="ImmoScout24 Link / PDF Exposé URL einfügen..."
                  className="w-full bg-[#064e3b]/20 border border-[#064e3b] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 transition-all"
                />
              </div>
              <button 
                onClick={handleAiEvaluation}
                disabled={!dealUrl || isEvaluating}
                className="bg-[#c5a059] hover:bg-[#d4af37] disabled:opacity-50 text-[#022c22] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#c5a059]/20 tracking-wide flex items-center justify-center min-w-[200px]"
              >
                {isEvaluating ? (
                  <span className="flex items-center space-x-2">
                     <span className="w-4 h-4 border-2 border-[#022c22] border-t-transparent rounded-full animate-spin"></span>
                     <span>Underwriting...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Objekt Scannen</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* AI Report Result */}
          {aiReport && (
            <div className="bg-[#03362a] border border-[#c5a059]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(197,160,89,0.05)] animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                       <Bot className="w-6 h-6 text-[#c5a059]" />
                       <h3 className="text-lg font-bold text-white">Sharia AI Gutachten</h3>
                    </div>
                    <p className="text-xl text-white font-medium">{aiReport.title}</p>
                    <p className="text-gray-400 text-sm">Maschinelles Underwriting für potenzielles Token-Volumen von <span className="text-[#c5a059] font-bold">{aiReport.volume}</span>.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Erkannte Key-Faktoren:</p>
                    <div className="flex flex-col gap-2">
                      {aiReport.flags.map((idx: string, f: number) => (
                        <div key={f} className="flex items-center space-x-3 bg-[#064e3b]/20 px-4 py-2.5 rounded-lg border border-[#064e3b]/40">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          <span className="text-gray-300 text-sm">{idx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score Panel */}
                <div className="bg-[#022c22] border border-[#064e3b]/50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                   <div className="relative">
                     <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#064e3b]" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={56 * 2 * Math.PI} strokeDashoffset={56 * 2 * Math.PI * (1 - aiReport.score / 100)} className="text-[#c5a059] transition-all duration-1000 ease-out" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{aiReport.score}</span>
                        <span className="text-xs text-gray-500">Score</span>
                     </div>
                   </div>
                   
                   <div className="mt-6 space-y-4 w-full">
                     <div className="flex justify-between items-center border-b border-[#064e3b]/40 pb-2">
                       <span className="text-gray-400 text-sm">Target IRR</span>
                       <span className="text-green-400 font-bold">{aiReport.irr}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-[#064e3b]/40 pb-2">
                       <span className="text-gray-400 text-sm">Sharia Status</span>
                       <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs font-bold">{aiReport.shariaCheck}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-mono text-xs">{aiReport.verdict}</span>
                     </div>
                   </div>

                   <button className="w-full mt-6 bg-[#064e3b] hover:bg-[#064e3b]/80 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 border border-green-500/30">
                     <span>Smart Contract generieren</span>
                     <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
