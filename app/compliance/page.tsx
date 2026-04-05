"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  Timestamp 
} from "firebase/firestore";
import {
  Upload,
  ShieldCheck,
  CheckCircle,
  FileText,
  Loader2,
  AlertTriangle,
  XCircle,
  Scale,
  Bot,
  RotateCcw,
  History,
  Printer,
  ChevronRight,
} from "lucide-react";

/* ── Types ── */
type AuditStatus = "COMPLIANT" | "NON_COMPLIANT" | "NEEDS_REVIEW";

interface Finding {
  paragraph: string;
  classification: "RIBA" | "GHARAR" | "MAYSIR" | "COMPLIANT";
  severity: "critical" | "warning" | "ok";
  explanation: string;
  aaoifiReference: string;
}

interface AuditReport {
  id?: string; // Firestore ID
  status: AuditStatus;
  engineVersion: string;
  standard: string;
  executiveSummary: string;
  findings: Finding[];
  remediation: string[] | null;
  timestamp: string;
  fileName?: string;
  fileSize?: number;
}

/* ── Component ── */
export default function CompliancePage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [auditState, setAuditState] = useState<"idle" | "loading" | "done">("idle");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [history, setHistory] = useState<AuditReport[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    
    // Demo Mode Simulation
    if (!db) {
      setHistory([
        {
          id: "demo-a",
          status: "COMPLIANT",
          fileName: "Mietvertrag_Mitte_Berlin.pdf",
          timestamp: new Date().toISOString(),
          executiveSummary: "Das Dokument entspricht den AAOIFI Sharia Standards. Es wurden keine Riba- oder Gharar-Klauseln gefunden. Die Miete basiert auf Ijarah.",
          findings: [{ severity: "ok", classification: "COMPLIANT", paragraph: "Sämtliche Mietzahlungen...", explanation: "Ijarah konform.", aaoifiReference: "AAOIFI Nr. 9" }],
          remediation: null,
          engineVersion: "2.0.0-demo",
          standard: "AAOIFI (Demo)"
        },
        {
          id: "demo-b",
          status: "NON_COMPLIANT",
          fileName: "Darlehensvertrag_Sparkasse.pdf",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          executiveSummary: "Kritische Verstöße gegen das Riba-Verbot identifiziert. Der Vertrag enthält Verzugszinsklauseln.",
          findings: [{ severity: "critical", classification: "RIBA", paragraph: "Bei Zahlungsverzug...", explanation: "Zinseszins-Elemente.", aaoifiReference: "AAOIFI Nr. 3" }],
          remediation: ["Zinsklauseln entfernen"],
          engineVersion: "2.0.0-demo",
          standard: "AAOIFI (Demo)"
        }
      ]);
      return;
    }

    setLoadingHistory(true);
    try {
      const q = query(
        collection(db, "compliance_audits"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const audits: AuditReport[] = [];
      querySnapshot.forEach((doc) => {
        audits.push({ id: doc.id, ...doc.data() } as AuditReport);
      });
      setHistory(audits);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveAudit = async (reportData: AuditReport) => {
    if (!user || !db) return;
    try {
      await addDoc(collection(db, "compliance_audits"), {
        ...reportData,
        userId: user.uid,
        createdAt: Timestamp.now(), 
      });
      fetchHistory();
    } catch (err) {
      console.error("Error saving audit:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleAudit = async () => {
    if (!file) return;
    setAuditState("loading");
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/compliance", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ein unbekannter Fehler ist aufgetreten.");
      }

      setReport(data);
      setAuditState("done");
      
      // Persist to history
      saveAudit(data);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message);
      setAuditState("idle");
    }
  };

  const reset = () => {
    setFile(null);
    setAuditState("idle");
    setReport(null);
    setApiError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const statusConfig = {
    COMPLIANT: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", icon: CheckCircle, label: "COMPLIANT" },
    NON_COMPLIANT: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle, label: "NON-COMPLIANT" },
    NEEDS_REVIEW: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: AlertTriangle, label: "NEEDS MANUAL REVIEW" },
  };

  const verdictStyles = {
    ok: { color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle },
    warning: { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: AlertTriangle },
    critical: { color: "text-red-400", bg: "bg-red-500/10", icon: XCircle },
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <Bot className="w-6 h-6 text-[#c5a059]" />
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Proprietary Sharia AI Engine</h1>
        </div>
        <p className="text-gray-400 mt-1">
          Unabhängige In-House NLP-Technologie für Echtzeit-Scharia-Audits nach AAOIFI-Standards.
        </p>
        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5" /><span>AAOIFI-konform</span></span>
          <span className="flex items-center space-x-1"><Scale className="w-3.5 h-3.5" /><span>Pre-Fatwa Level</span></span>
          <span className="flex items-center space-x-1"><Bot className="w-3.5 h-3.5" /><span>Explainable AI (XAI)</span></span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── Dashboard / History Section ── */}
        {auditState === "idle" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Upload Zone */}
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#064e3b] hover:border-[#c5a059]/50 rounded-xl p-12 text-center cursor-pointer transition-colors bg-[#03362a]"
              >
                <input ref={fileInputRef} type="file" onChange={handleFileChange} accept=".pdf,.sol,.txt,.doc,.docx" className="hidden" />
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white font-medium mb-1">Vertrag oder Smart Contract (PDF/TXT) hochladen</p>
                <p className="text-sm text-gray-500">Drag & Drop oder klicken zum Auswählen</p>
                {file && (
                  <div className="mt-4 inline-flex items-center space-x-2 bg-[#022c22] px-4 py-2 rounded-lg text-sm">
                    <FileText className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-white">{file.name}</span>
                  </div>
                )}
              </div>

              {apiError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3 text-red-400 animate-fade-in-up">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{apiError}</p>
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={!file}
                className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Sharia Audit starten</span>
              </button>
            </div>

            {/* Audit History List */}
            {history.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-400 mb-2 px-1">
                  <History className="w-4 h-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Letzte Audits</h3>
                </div>
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <div 
                      key={h.id || i}
                      onClick={() => {
                        setReport(h);
                        setAuditState("done");
                      }}
                      className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-4 flex items-center justify-between hover:border-[#c5a059]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          h.status === "COMPLIANT" ? "bg-green-500/10" : "bg-red-500/10"
                        }`}>
                          {h.status === "COMPLIANT" ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">{h.fileName || "Unbenanntes Dokument"}</p>
                          <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleDateString("de-DE")} • {h.status}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#c5a059] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Loading State ── */}
        {auditState === "loading" && (
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-12 text-center">
            <Loader2 className="w-14 h-14 text-[#c5a059] animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Sharia Audit läuft…</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Dokument wird via LLM ausgewertet. Prüfung auf Riba, Gharar und Maysir gemäß AAOIFI…
            </p>
            <div className="mt-6 flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Audit Report ── */}
        {auditState === "done" && report && (() => {
          const sc = statusConfig[report.status];
          const StatusIcon = sc.icon;

          return (
            <div className="space-y-6">
              {/* Report Header */}
              <div className={`bg-[#03362a] ${sc.border} border rounded-xl p-6 relative overflow-hidden`}>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                   <ShieldCheck className="w-48 h-48" />
                </div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Automated Sharia Audit Report</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 no-print">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center space-x-1 hover:text-[#c5a059] transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Drucken</span>
                    </button>
                    <span>|</span>
                    <span>Engine: {report.engineVersion}</span>
                    <span>|</span>
                    <span>Standard: {report.standard}</span>
                  </div>
                  <div className="hidden print-only text-xs text-gray-500">
                    Proprietary Amanah Sharia AI Analysis • {new Date().toLocaleDateString()}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-3 mb-4 relative z-10">
                  <div className={`w-12 h-12 ${sc.bg} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-6 h-6 ${sc.color}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${sc.color}`}>{sc.label}</h2>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">Dokument: {report.fileName || file?.name || "Unbekannt"}</p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-[#022c22] rounded-lg p-4 relative z-10">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">1. Executive Summary</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-serif italic text-justify">{report.executiveSummary}</p>
                </div>
              </div>

              {/* XAI Finding Log */}
              {report.findings.length > 0 && (
                <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#064e3b]/40">
                    <h3 className="font-semibold text-white text-sm">2. Explainable AI (XAI) Finding Log</h3>
                  </div>
                  <div className="divide-y divide-[#064e3b]/30">
                    {report.findings.map((f, i) => {
                      const vs = verdictStyles[f.severity];
                      const VIcon = vs.icon;
                      return (
                        <div key={i} className="p-5 space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className={`w-7 h-7 ${vs.bg} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                              <VIcon className={`w-4 h-4 ${vs.color}`} />
                            </div>
                            <div className="space-y-2 min-w-0">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">KI Klassifizierung: {f.classification}</p>
                                {f.paragraph && f.paragraph !== "[Gesamtes Dokument geprüft]" && (
                                  <p className="text-sm text-white/90 italic bg-[#022c22] rounded-lg p-3 border-l-2 border-[#c5a059]/40 mb-2">
                                    "{f.paragraph}"
                                  </p>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Scharia-Bewertung</p>
                                <p className="text-sm text-gray-300 leading-relaxed">{f.explanation}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Scale className="w-3.5 h-3.5 text-[#c5a059]" />
                                <span className="text-xs text-[#c5a059]">{f.aaoifiReference}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Remediation (only for non-compliant) */}
              {report.remediation && (
                <div className="bg-[#03362a] border border-yellow-500/20 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#064e3b]/40">
                    <h3 className="font-semibold text-white text-sm">3. Remediation & Action Items</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {report.remediation.map((r, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-[#c5a059]/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#c5a059]">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={reset}
                className="w-full bg-[#064e3b] hover:bg-[#064e3b]/70 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Neues Dokument prüfen</span>
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
