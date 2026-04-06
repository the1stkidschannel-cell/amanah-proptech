import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import DashboardShell from "@/components/DashboardShell";
import Analytics from "@/components/Analytics";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import HelpdeskWidget from "@/components/HelpdeskWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amanah PropTech | Halal Real Estate Investing",
  description: "Die erste BaFin-regulierte Plattform für tokenisierte Halal-Immobilien in der DACH-Region.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#022c22] text-white">
        <Analytics />
        <LegalDisclaimer />
        <HelpdeskWidget />
        <AuthProvider>
          <DashboardShell>{children}</DashboardShell>
        </AuthProvider>
      </body>
    </html>
  );
}
