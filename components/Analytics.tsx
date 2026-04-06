"use client";

import { useEffect, Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ShieldAlert, Check, X } from "lucide-react";

function CookieConsentAndTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showBanner, setShowBanner] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem("amanah_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      setAnalyticsEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (analyticsEnabled && pathname) {
      // Simulation of PostHog / Google Analytics
      console.log(`[PostHog Analytics] Pageview recorded: ${pathname}`);
      console.log(`[PostHog Analytics] Session recording ACTIVE`);
    }
  }, [pathname, searchParams, analyticsEnabled]);

  const handleAccept = () => {
    localStorage.setItem("amanah_cookie_consent", "accepted");
    setAnalyticsEnabled(true);
    setShowBanner(false);
    console.log("[PostHog Analytics] INITIALIZED");
  };

  const handleDecline = () => {
    localStorage.setItem("amanah_cookie_consent", "declined");
    setAnalyticsEnabled(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-4 left-0 sm:left-4 right-0 sm:right-auto sm:max-w-md z-50 animate-fade-in-up">
      <div className="bg-[#022c22] border border-[#064e3b] p-5 sm:rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500/20 p-2 rounded-full shrink-0">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Privatsphäre & Analytics (DSGVO)</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Wir verwenden PostHog (in der EU gehostet), um die Nutzererfahrung anonymisiert zu verbessern und Fehler im Investment-Prozess zu beheben. Es werden keine sensiblen Wallet-Daten getrackt. Stimmen Sie der Nutzung zu?
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
           <button 
             onClick={handleDecline} 
             className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
           >
             Ablehnen
           </button>
           <button 
             onClick={handleAccept} 
             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
           >
             <Check className="w-3 h-3" /> Zustimmen
           </button>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <CookieConsentAndTracker />
    </Suspense>
  );
}
