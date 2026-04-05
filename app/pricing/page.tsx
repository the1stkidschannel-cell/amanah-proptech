"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Bot,
  Scale,
  Zap,
  Building2,
  Check,
  ArrowRight,
  Star,
  Globe,
  FileText,
  Lock,
  Users,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "/ Monat",
    description: "Für Einzelpersonen und erste Tests",
    features: [
      "3 Sharia Audits / Monat",
      "PDF & TXT Uploads",
      "Standard AAOIFI-Prüfung",
      "Exportierbare Berichte",
      "Community Support",
    ],
    cta: "Kostenlos starten",
    highlight: false,
    badge: null,
  },
  {
    name: "Professional",
    price: "299",
    period: "/ Monat",
    description: "Für Islamic Finance Berater & Kanzleien",
    features: [
      "Unbegrenzte Audits",
      "Alle Dateiformate inkl. Smart Contracts",
      "Multi-Standard Support (AAOIFI + IFSB)",
      "Detaillierte XAI-Analyse (Explainable AI)",
      "White-Label-Berichte mit eigenem Branding",
      "API-Zugang (REST + Webhook)",
      "Prioritäts-Support",
      "DSGVO-konformer Datenraum",
    ],
    cta: "14 Tage testen",
    highlight: true,
    badge: "Empfohlen",
  },
  {
    name: "Enterprise",
    price: "Individuell",
    period: "",
    description: "Für Islamic Banks, Fonds & Regulatoren",
    features: [
      "Alles aus Professional",
      "Dedizierte AI-Instanz (Private Cloud)",
      "On-Premise Deployment möglich",
      "Custom Fatwa-Datenbank Integration",
      "SSO & Role-Based Access Control",
      "SLA mit 99.9% Uptime Garantie",
      "Dedicated Account Manager",
      "Schulungen & Onboarding",
    ],
    cta: "Kontakt aufnehmen",
    highlight: false,
    badge: null,
  },
];

const useCases = [
  {
    icon: Building2,
    title: "Islamic Banks",
    description: "Automatisierte Compliance-Prüfung für Kreditverträge, Konto-Produkte und Sukuk-Strukturen.",
  },
  {
    icon: Scale,
    title: "Sharia Advisory Boards",
    description: "Pre-Screening Tool für Fatwa-Entscheidungen mit dokumentierter AI-Begründungskette.",
  },
  {
    icon: FileText,
    title: "Rechtsanwaltskanzleien",
    description: "Due-Diligence Beschleunigung bei islamkonformen Transaktionen und Fondsstrukturen.",
  },
  {
    icon: Globe,
    title: "RegTech & Compliance",
    description: "API-Integration in bestehende GRC-Systeme für lückenlose Sharia-Governance.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <Bot className="w-6 h-6 text-[#c5a059]" />
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Sharia AI Engine – SaaS</h1>
        </div>
        <p className="text-gray-400 mt-1 max-w-2xl">
          Lizenzieren Sie unsere proprietäre Sharia-KI für Ihre eigenen Produkte. Automatisierte AAOIFI-Compliance-Prüfung als Service.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm font-medium ${!annual ? "text-white" : "text-gray-500"}`}>Monatlich</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-[#c5a059]" : "bg-[#064e3b]"}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${annual ? "left-8" : "left-1"}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-white" : "text-gray-500"}`}>
          Jährlich <span className="text-green-400 text-xs">(-20%)</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const displayPrice = plan.price !== "Individuell" && annual && plan.price !== "0"
            ? Math.round(Number(plan.price) * 0.8).toString()
            : plan.price;

          return (
            <div
              key={plan.name}
              className={`relative bg-[#03362a] rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? "border-2 border-[#c5a059] shadow-xl shadow-[#c5a059]/10"
                  : "border border-[#064e3b]/40"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c5a059] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end space-x-1">
                  {displayPrice !== "Individuell" ? (
                    <>
                      <span className="text-4xl font-bold text-white">€{displayPrice}</span>
                      <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-white">Individuell</span>
                  )}
                </div>
                {plan.price !== "0" && plan.price !== "Individuell" && annual && (
                  <p className="text-xs text-green-400 mt-1">€{Math.round(Number(displayPrice) * 12)} / Jahr (statt €{Number(plan.price) * 12})</p>
                )}
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-[#c5a059]" : "text-green-400"}`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                  plan.highlight
                    ? "bg-[#c5a059] hover:bg-[#b08d48] text-white shadow-lg shadow-[#c5a059]/20"
                    : "bg-[#064e3b] hover:bg-[#064e3b]/70 text-white"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Use Cases */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 text-center">Wer profitiert von der Sharia AI Engine?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5 hover:border-[#c5a059]/30 transition-all group"
            >
              <div className="w-10 h-10 bg-[#022c22] rounded-lg flex items-center justify-center border border-[#064e3b] mb-4 group-hover:bg-[#c5a059]/10 transition-colors">
                <uc.icon className="w-5 h-5 text-[#c5a059]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{uc.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{uc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6 text-center">
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <span className="flex items-center space-x-2"><ShieldCheck className="w-5 h-5 text-green-400" /><span>AAOIFI-konform</span></span>
          <span className="flex items-center space-x-2"><Lock className="w-5 h-5 text-blue-400" /><span>DSGVO & ISO 27001</span></span>
          <span className="flex items-center space-x-2"><BadgeCheck className="w-5 h-5 text-[#c5a059]" /><span>SOC 2 Type II</span></span>
          <span className="flex items-center space-x-2"><Users className="w-5 h-5 text-purple-400" /><span>50+ Unternehmenskunden</span></span>
          <span className="flex items-center space-x-2"><TrendingUp className="w-5 h-5 text-green-400" /><span>99.9% Uptime</span></span>
        </div>
      </div>
    </div>
  );
}
