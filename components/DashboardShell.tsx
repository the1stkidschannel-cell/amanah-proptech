"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  BadgeDollarSign,
  UserPen,
  GraduationCap,
  Gift,
  BriefcaseBusiness,
  Cpu,
  Mail,
  Bot
} from "lucide-react";

const navItems = [
  { label: "Übersicht", href: "/", icon: LayoutDashboard },
  { label: "Primärmarkt", href: "/invest", icon: Building2 },
  { label: "Sekundärmarkt", href: "/trade", icon: ArrowLeftRight },
  { label: "Halal Wallet", href: "/wallet", icon: Wallet },
  { label: "B2B Outreach", href: "/admin/outreach", icon: Mail },
  { label: "Freunde werben", href: "/referral", icon: Gift },
  { label: "Institutionell", href: "/institutional", icon: BriefcaseBusiness },
  { label: "Amanah Academy", href: "/academy", icon: GraduationCap },
  { label: "Profil & KYC", href: "/onboarding", icon: UserPen },
  { label: "Sharia AI", href: "/compliance", icon: ShieldCheck },
  { label: "Token Factory", href: "/admin/properties/create", icon: Cpu },
  { label: "SaaS Pricing", href: "/pricing", icon: BadgeDollarSign },
  { label: "Portfolio Automation", href: "/admin/automation", icon: Bot },
  { label: "Admin", href: "/admin", icon: Settings },
];

import LandingPage from "./LandingPage";

/* ──────────────────────── Dashboard Shell ──────────────────────── */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Loading spinner */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#022c22]">
        <Loader2 className="w-10 h-10 text-[#c5a059] animate-spin" />
      </div>
    );
  }

  /* Not authenticated */
  if (!user) return <LandingPage />;

  /* Sidebar content (reused for desktop & mobile) */
  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-2 px-5 py-6 border-b border-[#064e3b]/40">
        <div className="w-8 h-8 bg-[#c5a059] rounded-lg flex items-center justify-center">
          <Building2 className="text-white w-4 h-4" />
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & logout */}
      <div className="px-4 py-4 border-t border-[#064e3b]/40">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.displayName || "Investor"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Abmelden"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#022c22] overflow-hidden">
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
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#064e3b]/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white">
            Amanah<span className="text-[#c5a059]">PropTech</span>
          </span>
          <div className="w-9" /> {/* spacer */}
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
