"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Zap, Database, Building2, Server, Globe2, Loader2 } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Professional",
    price: "€ 1.990",
    interval: "pro Monat",
    description: "Für kleine bis mittlere Vermögensverwalter, die Tokenomics in ihr Portfolio aufnehmen wollen.",
    badge: null,
    features: [
      "Zugriff auf Primary Market API",
      "Bis zu 3 Sub-Accounts",
      "Basic Sharia Compliance Reporting",
      "Standard E-Mail Support (24h)",
      "Standard Trading Fees (1.0%)"
    ],
    icon: Database,
    buttonText: "Abonnieren",
    buttonType: "outline",
    priceId: "price_professional"
  },
  {
    name: "Enterprise",
    price: "€ 4.990",
    interval: "pro Monat",
    description: "Das komplette White-Label Ökosystem für etablierte Family Offices und Banken.",
    badge: "Empfohlen",
    features: [
      "White-Label Tokenization Engine (Dein Branding)",
      "Automatisiertes eWpG Setup für eigene SPVs",
      "Unlimitierte Sub-Accounts (Multi-Tenancy)",
      "Vollzugriff via REST API & Webhooks",
      "Dedizierter Account Manager (SLA 4h)",
      "Reduzierte Trading Fees (0.2%)"
    ],
    icon: Zap,
    buttonText: "Upgrade auf Enterprise",
    buttonType: "primary",
    priceId: "price_enterprise"
  },
  {
    name: "Institutionell",
    price: "Custom",
    interval: "Jährlich abgerechnet",
    description: "Individuelle On-Premise Installationen oder exklusive Private-Dealflow-Pipelines.",
    badge: null,
    features: [
      "Eigenes Smart-Contract Factory Deployment",
      "On-Premise Node Operations",
      "Prioritärer Zugang zu Core-Real-Estate Deals",
      "Direkter Kontakt zum AAOIFI Sharia Board",
      "Zero Trading Fees (0.00%)"
    ],
    icon: Server,
    buttonText: "Sales kontaktieren",
    buttonType: "outline",
    priceId: "contact_sales"
  }
];

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    if (priceId === "contact_sales") {
      window.location.href = "mailto:institutional@amanah-proptech.com";
      return;
    }

    setLoadingTier(priceId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
      });
      const data = await response.json();
      
      if (data.url) {
         setCheckoutUrl(data.url); // Simulating Stripe Checkout Redirect
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTier(null);
    }
  };

  if (checkoutUrl) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in-up text-center">
         <ShieldCheck className="w-20 h-20 text-green-400 mb-6 mx-auto" />
         <h1 className="text-3xl font-bold text-white mb-4">Weiterleitung zu Stripe Checkout...</h1>
         <p className="text-gray-400 max-w-md">In einer Produktionsumgebung würdest du jetzt auf die hochsichere Stripe B2B-Checkout Page weitergeleitet werden, um das SEPA/Kreditkarten Mandat zu unterschreiben.</p>
         <button onClick={() => setCheckoutUrl(null)} className="mt-8 text-[#c5a059] hover:underline">Simulation abbrechen</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in-up pb-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#d4af37]/30 px-4 py-2 rounded-full text-sm font-bold text-[#d4af37] shadow-lg shadow-[#d4af37]/10">
          <Globe2 className="w-4 h-4" />
          <span>B2B Platform als Service (PaaS)</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Skalierbare API-Infrastruktur für Ihr Wachstum.</h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Nutzen Sie die Amanah PropTech Engine, um Ihren eigenen Kunden sharia-konforme, tokenisierte Anlageprodukte vollautomatisiert anzubieten. White-Label, eWpG-konform und sofort einsetzbar.
        </p>
      </div>

      {/* Pricing Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col bg-[#03362a] rounded-3xl transition-transform hover:-translate-y-2 ${
              tier.badge ? "border-2 border-[#c5a059] shadow-2xl shadow-[#c5a059]/20" : "border border-[#064e3b]/40 shadow-xl"
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="bg-[#c5a059] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {tier.badge}
                </span>
              </div>
            )}
            
            <div className="p-8 pb-0">
              <div className="w-12 h-12 bg-[#022c22] rounded-xl flex items-center justify-center border border-[#064e3b] mb-6">
                 <tier.icon className={`w-6 h-6 ${tier.badge ? "text-[#c5a059]" : "text-white"}`}/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-gray-400 mb-6 h-10">{tier.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-gray-500 ml-2">{tier.interval}</span>
              </div>
            </div>

            <div className="px-8 pb-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mr-3 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCheckout(tier.priceId)}
                disabled={loadingTier === tier.priceId}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
                  tier.buttonType === "primary" 
                    ? "bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] shadow-lg shadow-[#c5a059]/20" 
                    : "bg-[#022c22] border border-[#064e3b] hover:border-[#c5a059] text-white"
                }`}
              >
                {loadingTier === tier.priceId ? <Loader2 className="w-5 h-5 animate-spin" /> : tier.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Sell */}
      <div className="max-w-6xl mx-auto mt-20 bg-[#022c22] rounded-3xl border border-[#064e3b]/50 p-8 lg:p-12 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-2/3 space-y-6">
          <h2 className="text-3xl font-bold text-white">Entwickelt für globale Skalierung</h2>
          <p className="text-gray-400 leading-relaxed">
            Als White-Label SaaS Plattform übernehmen wir die schwere technische Arbeit hinter den Kulissen. Von der BaFin-Reporting-Schnittstelle über das dynamische PDF-Ijarah-Generation bis zur SPV-Verwaltung auf der Polygon-Blockchain. Amanah PropTech abstrahiert die gesamte regulative und technische Komplexität in eine einzige, saubere REST API.
          </p>
          <Link href="/institutional/dashboard" className="inline-block text-[#c5a059] font-bold hover:underline">
            Zurück zur Family Office Umgebung →
          </Link>
        </div>
        <div className="lg:w-1/3 flex justify-center">
           <Building2 className="w-48 h-48 text-[#03362a]" />
        </div>
      </div>
    </div>
  );
}
