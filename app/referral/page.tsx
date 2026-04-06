"use client";

import { useState } from "react";
import { Link2, Users, Gift, TrendingUp, CheckCircle, Copy, Share2, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ReferralPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<any>(null);
  
  // Simulated referral code based on user
  const referralCode = user?.uid ? `AMN-${user.uid.substring(0, 6).toUpperCase()}` : "AMN-VIP26X";
  const referralLink = `https://amanah-proptech.com/invite/${referralCode}`;

  const handleClaim = async (referral: any) => {
    if (referral.status !== "Investiert") return;
    setClaiming(referral.id);
    
    try {
      const res = await fetch("/api/referral/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim_reward", referralId: referral.id, amount: 250 })
      });
      const data = await res.json();
      if (data.success) {
        setClaimSuccess(data);
        setTimeout(() => setClaimSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = [
    { label: "Eingeladene Freunde", value: "3", icon: Users, color: "text-[#c5a059]" },
    { label: "Aktive Investoren", value: "1", icon: CheckCircle, color: "text-green-400" },
    { label: "Verdienter Bonus", value: "250 €", icon: Gift, color: "text-[#d4af37]" },
  ];

  const history = [
    { id: "REF-101", name: "Ahmed K.", date: "02. Apr 2026", status: "Investiert", reward: "+ 250 €" },
    { id: "REF-102", name: "Sara F.", date: "28. Mär 2026", status: "Registriert (KYC pending)", reward: "Ausstehend" },
    { id: "REF-103", name: "Leila A.", date: "15. Mär 2026", status: "Eingeladen", reward: "-" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#03362a] to-[#022c22] border border-[#064e3b] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[200%] bg-[#c5a059]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#064e3b] px-3 py-1.5 rounded-full text-xs font-bold text-[#c5a059]">
              <Gift className="w-3.5 h-3.5" />
              <span>Partnerprogramm</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Empfehlen & Verdienen</h1>
            <p className="text-gray-400 text-lg">
              Bringen Sie Freunde und Familie in die Welt der Halal-Investments. 
              <strong className="text-white"> Sie erhalten 2,5% des ersten Investments </strong> 
              Ihrer Freunde als Prämie in Ihr Halal Wallet.
            </p>
          </div>
          
          <div className="w-full md:w-80 bg-[#022c22]/80 backdrop-blur-md border border-[#c5a059]/30 rounded-xl p-6 shadow-xl shrink-0">
            <p className="text-sm text-gray-300 font-medium mb-3">Ihr persönlicher Einladungslink</p>
            <div className="flex items-center space-x-2 bg-[#011a14] border border-[#064e3b]/80 p-2 rounded-lg mb-4">
              <span className="text-sm font-mono text-[#d4af37] truncate flex-1">{referralLink}</span>
              <button 
                onClick={handleCopy}
                className="bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#d4af37] p-2 rounded transition-colors"
                title="Link kopieren"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Jetzt teilen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-full bg-[#022c22] border border-[#064e3b] flex items-center justify-center mb-3 ${m.color}`}>
              <m.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Referral History */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#064e3b]/40 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#c5a059]" /> <span>Ihre Einladungen</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#022c22]/50 border-b border-[#064e3b]/30 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Nutzer</th>
                <th className="px-6 py-4 font-semibold">Datum der Einladung</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Prämie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#064e3b]/20">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-[#064e3b]/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{h.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{h.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      h.status === "Investiert" ? "bg-green-500/10 text-green-400" :
                      h.status.includes("KYC") ? "bg-[#c5a059]/10 text-[#c5a059]" :
                      "bg-gray-800 text-gray-400"
                    }`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-white">
                    {h.status === "Investiert" ? (
                      <button 
                        onClick={() => handleClaim(h)}
                        disabled={claiming === h.id}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-end ml-auto gap-2"
                      >
                         {claiming === h.id ? <span className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span> : <span>{h.reward} Auszahlen</span>}
                      </button>
                    ) : (
                       <span className="text-gray-500">{h.reward}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {claimSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-500/10 border border-green-500/50 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up flex items-center gap-4">
          <div className="bg-green-500/20 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-green-400" /></div>
          <div>
            <p className="font-bold text-white">Auszahlung erfolgreich!</p>
            <p className="text-sm text-green-400">+ € {claimSuccess.amountCredited} ins Halal Wallet transferiert.</p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { step: "1", title: "Link teilen", desc: "Schicken Sie Ihren Link an Freunde, Geschäftspartner oder teilen Sie ihn auf Social Media." },
          { step: "2", title: "Registrierung & KYC", desc: "Ihre Kontakte registrieren sich über den Link und schließen die gesetzliche Legitimierung ab." },
          { step: "3", title: "Prämie kassieren", desc: "Sobald das erste Investment getätigt wurde, erhalten Sie 2,5% der Summe sofort ausgezahlt." }
        ].map((s) => (
          <div key={s.step} className="bg-[#022c22] border border-[#064e3b] p-6 rounded-xl flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-[#c5a059] flex items-center justify-center text-white font-bold shrink-0">
              {s.step}
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">{s.title}</h4>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
