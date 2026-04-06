'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Institutional Design Tokens ──────────────────────────────────────────
const colors = {
  bg: '#050f0a',
  surface: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(197, 160, 89, 0.15)',
  gold: '#c5a059',
  goldGradient: 'linear-gradient(135deg, #c5a059 0%, #e8c97a 100%)',
  emerald: '#064e3b',
  textMain: '#f0ede8',
  textDim: '#a0998e',
};

const glassEffect = {
  background: 'rgba(10, 25, 20, 0.7)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${colors.border}`,
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
};

// ─── Data ──────────────────────────────────────────────────────────────────
const metrics = [
  { value: '€2.5B+', label: 'Target AUM (3-Year)' },
  { value: '4.8–6.2%', label: 'Target Net Ijarah Yield p.a.' },
  { value: 'Tier-1', label: 'Planned Property Mgmt Partners' },
  { value: 'Target', label: 'BaFin Tied-Agent Structure' },
];

const features = [
  {
    icon: '🕌',
    title: 'Certified Sharia-Compliance',
    desc: 'Each asset undergoes rigorous certification by our independent Sharia Board. Ijarah-based distribution ensures zero-interest, ethical returns.',
  },
  {
    icon: '🏛️',
    title: 'Planned Institutional Bridge',
    desc: 'Targeting the German Electronic Securities Act (eWpG) for blockchain-native, transparent digital securities. BaFin Tied-Agent structure in preparation.',
  },
  {
    icon: '🏢',
    title: 'Tier-1 Asset Management (Planned)',
    desc: 'Assets are planned to be managed by global Tier-1 partners (e.g. CBRE, JLL) via API integration, accessible through our planned €4,990/month White-Label SaaS Portal.',
  },
  {
    icon: '🔐',
    title: 'Automated Compliance Stack',
    desc: 'KYC/AML checks (IDnow/Sumsub) and Sharia-compliance reporting are fully automated by AI agents within our tokenization engine.',
  },
];

const pipeline = [
  { status: 'Simulated', name: 'Berlin Green-Office Cluster', aum: '€32M', yield: '5.2%', type: 'Core Office (Illustrative)' },
  { status: 'Simulated', name: 'Munich Airport Logistics', aum: '€18M', yield: '5.8%', type: 'Logistics (Illustrative)' },
  { status: 'Simulated', name: 'Frankfurt Sky-Residential', aum: '€85M', yield: '4.9%', type: 'Residential (Illustrative)' },
];

export default function InstitutionalEnglishPage() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', aum: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ background: colors.bg, color: colors.textMain, fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── Background Ambiance ── */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(197, 160, 89, 0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(6, 78, 59, 0.08) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      {/* ── Navigation ── */}
      <nav style={{ ...glassEffect, position: 'sticky', top: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 60px', zIndex: 1000, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '26px', fontWeight: 900, color: colors.gold, letterSpacing: '-1px' }}>AMANAH</span>
          <div style={{ height: '24px', width: '1px', background: colors.border }} />
          <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '2px', color: colors.textDim }}>INSTITUTIONAL</span>
        </div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {['Ecosystem', 'Pipeline', 'Risk Mgmt'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: colors.textDim, textDecoration: 'none', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{item}</a>
          ))}
          <Link href="/institutional" style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${colors.gold}`, color: colors.gold, textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>🇩🇪 DEUTSCH</Link>
          <a href="#contact" style={{ background: colors.goldGradient, color: colors.bg, padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>GO LIVE</a>
        </div>
      </nav>

      {/* ── Hero Segment ── */}
      <section style={{ position: 'relative', padding: '140px 60px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1 }}>
        <div style={{ background: '#022c22', border: `1px solid ${colors.emerald}`, color: '#10b981', padding: '6px 18px', borderRadius: '100px', fontSize: '11px', fontWeight: 900, letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>
          • INSTITUTIONAL PRIVATE BETA (GTM PHASE)
        </div>
        <div style={{ background: 'rgba(197, 160, 89, 0.1)', border: `1px solid ${colors.gold}`, color: colors.gold, padding: '6px 18px', borderRadius: '100px', fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '40px', textTransform: 'uppercase' }}>
          MVP PROTOTYPE · Planned Sharia Certification · Targeting BaFin Tied-Agent Structure
        </div>
        <h1 style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1.05, marginBottom: '24px', maxWidth: '1000px' }}>
          Bridging Global Islamic Capital to <br/>
          <span style={{ background: colors.goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            European Core Real Estate.
          </span>
        </h1>
        <p style={{ fontSize: '20px', color: colors.textDim, maxWidth: '720px', lineHeight: 1.6, marginBottom: '50px' }}>
          Direct access to prime DACH-region assets via tokenized eWpG structures. 
          Engineered for Sovereign Funds, Family Offices, and Islamic Institutions.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#contact" style={{ background: colors.goldGradient, color: colors.bg, padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontWeight: 900, fontSize: '18px', boxShadow: `0 10px 40px -10px ${colors.gold}66` }}>
            Request Access
          </a>
          <a href="#pipeline" style={{ ...glassEffect, padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '18px' }}>
            View Dashboard →
          </a>
        </div>
      </section>

      {/* ── Metric Ribbon ── */}
      <section style={{ ...glassEffect, margin: '0 60px', padding: '50px', borderRadius: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
        {metrics.map((m) => (
          <div key={m.label}>
            <div style={{ fontSize: '42px', fontWeight: 900, color: colors.gold, marginBottom: '8px' }}>{m.value}</div>
            <div style={{ fontSize: '13px', color: colors.textDim, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{m.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section id="ecosystem" style={{ padding: '140px 60px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px' }}>The Institutional Gold Standard.</h2>
            <p style={{ color: colors.textDim, fontSize: '18px' }}>We combine the reliability of German legal framework with the efficiency of blockchain technology.</p>
          </div>
          <a href="/academy" style={{ color: colors.gold, fontWeight: 700, textDecoration: 'none', borderBottom: `2px solid ${colors.gold}`, paddingBottom: '4px' }}>Learn more about our Protocol →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
          {features.map((f) => (
            <div key={f.title} style={{ ...glassEffect, padding: '48px', borderRadius: '24px', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: colors.gold }}>{f.title}</h3>
              <p style={{ color: colors.textDim, lineHeight: 1.8, fontSize: '16px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline Section ── */}
      <section id="pipeline" style={{ padding: '100px 60px', background: 'rgba(6, 78, 59, 0.05)', borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '50px' }}>Active Allocation Queue</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {pipeline.map((p, i) => (
              <div key={i} style={{ ...glassEffect, display: 'grid', gridTemplateColumns: '120px 2fr 1fr 1fr 1fr', alignItems: 'center', padding: '30px 40px', borderRadius: '16px' }}>
                <span style={{ background: p.status === 'Simulated' ? colors.gold : colors.gold, color: colors.bg, padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', width: 'fit-content' }}>{p.status}</span>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>{p.name}</span>
                <span style={{ color: colors.gold, fontWeight: 800, fontSize: '22px' }}>{p.aum} AUM</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{p.yield} Yield</span>
                <span style={{ opacity: 0.6, fontSize: '14px', textAlign: 'right' }}>{p.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section id="contact" style={{ padding: '140px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px' }}>Secure Your Allocation.</h2>
          <p style={{ color: colors.textDim, marginBottom: '60px', fontSize: '18px' }}>Request the full institutional prospectus and access our private Deal-Room.</p>
          
          {submitted ? (
            <div style={{ ...glassEffect, padding: '80px', borderRadius: '32px', borderColor: '#10b981' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛡️</div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>Inquiry Transmitted</h3>
              <p style={{ color: colors.textDim, marginTop: '16px' }}>Your dedicated IR manager will contact you within 4 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input type="text" placeholder="Full Name" required style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '12px', color: 'white', outline: 'none' }} />
                <input type="email" placeholder="Institutional Email" required style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
              <input type="text" placeholder="Managing Entity / Institution" required style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '12px', color: 'white', outline: 'none' }} />
              <button type="submit" style={{ background: colors.goldGradient, color: colors.bg, padding: '24px', borderRadius: '12px', fontWeight: 900, fontSize: '20px', cursor: 'pointer', border: 'none', transition: 'transform 0.2s' }}>
                REQUEST MASTER DECK
              </button>
              <p style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>This is a technological MVP demonstration. No financial services are provided. No BaFin license is held. All data is simulated.</p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '80px 60px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: colors.textDim }}>
          <strong style={{ color: colors.gold }}>Amanah PropTech</strong> · Technological MVP — no regulated financial services are provided.<br/>
          Institutional Relations: amanah.proptech@gmail.com
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', fontSize: '12px' }}>
          {['Compliance', 'Risk Disclosure', 'Privacy Policy'].map(item => <a key={item} href="#" style={{ color:colors.textDim, textDecoration: 'none' }}>{item}</a>)}
        </div>
      </footer>
    </main>
  );
}
