"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Loader2,
  Settings,
  Gift,
  GraduationCap,
  Bot
} from "lucide-react";

import LandingPage from "./LandingPage";

const navItems = [
  { labelKey: "dashboard", href: "/", icon: LayoutDashboard },
  { labelKey: "invest", href: "/invest", icon: Building2 },
  { labelKey: "trade", href: "/trade", icon: ArrowLeftRight },
  { labelKey: "wallet", href: "/wallet", icon: Wallet },
  { labelKey: "support", href: "/admin/support", icon: Bot },
  { labelKey: "referral", href: "/referral", icon: Gift },
  { labelKey: "academy", href: "/academy", icon: GraduationCap },
  { labelKey: "admin", href: "/admin", icon: Settings },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { lang, setLang, t, dir } = useLanguage();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#022c22]">
        <Loader2 className="w-10 h-10 text-[#c5a059] animate-spin" />
      </div>
    );
  }

  if (!user) return <LandingPage />;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-5 py-6 border-b border-[#064e3b]/40">
        <div className="w-8 h-8 bg-[#c5a059] rounded-lg flex items-center justify-center">
          <Building2 className="text-[#022c22] w-4 h-4 shadow-sm" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Amanah<span className="text-[#c5a059]">PropTech</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#c5a059]/15 text-[#d4af37]"
                  : "text-gray-400 hover:bg-[#064e3b]/30 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Switcher & User */}
      <div className="px-3 py-4 border-t border-[#064e3b]/40 space-y-4">
        {/* Language Switcher */}
        <div className="flex items-center justify-between bg-[#022c22] border border-[#064e3b] rounded-xl p-1">
          {(['de', 'en', 'ar'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                lang === l 
                  ? "bg-[#c5a059] text-[#022c22] shadow-sm" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c5a059] to-[#064e3b] border border-white/10 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.displayName || "Investor"}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#022c22] overflow-hidden" dir={dir}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#03362a] border-r border-[#064e3b]/40 shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 h-full bg-[#03362a] flex flex-col shadow-2xl z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top bar (mobile only) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#03362a] border-b border-[#064e3b]/40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white uppercase tracking-widest">
            Amanah
          </span>
          <button 
            onClick={() => setLang(lang === 'ar' ? 'de' : 'ar')}
            className="w-8 h-8 rounded-lg bg-[#022c22] border border-[#064e3b] text-[10px] font-bold text-[#c5a059]"
          >
            {lang.toUpperCase()}
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
