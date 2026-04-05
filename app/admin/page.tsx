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
  const [activeTab, setActiveTab] = useState<"overview" | "waitlist" | "audits" | "properties">("overview");

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
    { id: "waitlist" as const, label: `Waitlist (${waitlist.length})`, icon: Users },
    { id: "audits" as const, label: `Audits (${audits.length})`, icon: ShieldCheck },
    { id: "properties" as const, label: "Objekte", icon: Building2 },
  ];

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
    </div>
  );
}
