'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── English Institutional Landing Page ────────────────────────────────────
// Mirrors the German institutional page but in English for MENA/international investors.

const metrics = [
  { value: '€500M+', label: 'Target AUM by 2027' },
  { value: '4.8–6.2%', label: 'Target Net Ijarah Yield p.a.' },
  { value: '€500K', label: 'Minimum Allocation per SPV' },
  { value: '100%', label: 'BaFin / eWpG Regulated' },
];

const features = [
  {
    icon: '🕌',
    title: 'Sharia-Compliant Structure',
    desc: 'Every token is certified by an independent Scholars Board. Ijarah-based income distribution — zero interest, zero gharar.',
  },
  {
    icon: '🏛️',
    title: 'BaFin-Regulated & eWpG-Compliant',
    desc: 'German electronic securities law (eWpG) provides the legal backbone. Blockchain-native, fully regulated digital securities.',
  },
  {
    icon: '🏙️',
    title: 'Prime German Core Real Estate',
    desc: 'Institutional-grade office, residential and logistics assets in Class-A DACH markets: Munich, Frankfurt, Berlin, Hamburg.',
  },
  {
    icon: '🔒',
    title: 'White-Label Due Diligence Room',
    desc: 'Full transparency via a dedicated data room. Institutional co-investors receive NAV reports, rent rolls and legal opinions.',
  },
  {
    icon: '⚡',
    title: 'Dedicated SPV per Asset',
    desc: 'Each property is ring-fenced in its own Special Purpose Vehicle — full asset separation, no cross-collateralization.',
  },
  {
    icon: '🌍',
    title: 'MENA-First Investment Bridge',
    desc: 'Designed for GCC sovereign funds, family offices and Islamic banks seeking stable Euro-denominated real estate allocations.',
  },
];

const pipeline = [
  { status: 'Active', name: 'Berlin Mitte Office Complex', aum: '€28M', yield: '5.4%', type: 'Office' },
  { status: 'Active', name: 'Munich Logistics Hub', aum: '€45M', yield: '4.9%', type: 'Logistics' },
  { status: 'Pipeline', name: 'Frankfurt Banking District', aum: '€72M', yield: '5.8%', type: 'Office' },
  { status: 'Pipeline', name: 'Hamburg Residential Portfolio', aum: '€38M', yield: '4.6%', type: 'Residential' },
];

export default function InstitutionalEnglishPage() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', aum: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to CRM API
    setSubmitted(true);
  };

  return (
    <main style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#050f0a', minHeight: '100vh', color: '#f0ede8' }}>

      {/* ── Navigation ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid rgba(197,160,89,0.15)', background: 'rgba(5,15,10,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#c5a059' }}>أمانة</span>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#f0ede8' }}>Amanah PropTech</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#a0998e' }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
          <a href="#pipeline" style={{ color: 'inherit', textDecoration: 'none' }}>Pipeline</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact IR</a>
          <Link href="/institutional" style={{ color: '#c5a059', textDecoration: 'none', fontWeight: 600 }}>🇩🇪 Deutsch</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '120px 48px 80px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.3)', borderRadius: '100px', padding: '8px 20px', fontSize: '13px', color: '#c5a059', marginBottom: '32px', fontWeight: 600 }}>
          🏦 For Qualified Institutional Investors Only
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', color: '#f0ede8' }}>
          Islamic Real Estate<br />
          <span style={{ background: 'linear-gradient(135deg, #c5a059, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Tokenized. BaFin-Regulated.
          </span>
        </h1>
        <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#a0998e', maxWidth: '680px', margin: '0 auto 48px' }}>
          The first fully regulated bridge for GCC sovereign funds, Islamic banks and MENA family offices to access 
          prime German core real estate — structured under eWpG and certified Sharia-compliant.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#contact" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c5a059, #b08d48)', color: '#050f0a', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
            Request Institutional Deck
          </a>
          <a href="#pipeline" style={{ display: 'inline-block', border: '1px solid rgba(197,160,89,0.4)', color: '#c5a059', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '16px' }}>
            View Live Pipeline →
          </a>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section style={{ padding: '60px 48px', background: 'rgba(197,160,89,0.05)', borderTop: '1px solid rgba(197,160,89,0.1)', borderBottom: '1px solid rgba(197,160,89,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#c5a059', marginBottom: '8px' }}>{m.value}</div>
              <div style={{ fontSize: '14px', color: '#706860', fontWeight: 500 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '100px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '60px', color: '#f0ede8' }}>
          Why Institutional Investors Choose Amanah
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(197,160,89,0.12)', borderRadius: '16px', padding: '32px', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f0ede8', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#706860', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section id="pipeline" style={{ padding: '80px 48px', background: 'rgba(197,160,89,0.04)', borderTop: '1px solid rgba(197,160,89,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#f0ede8' }}>Live Investment Pipeline</h2>
          <p style={{ color: '#706860', marginBottom: '40px', fontSize: '15px' }}>Institutional DD room available upon NDA execution.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(197,160,89,0.3)' }}>
                  {['Status', 'Asset', 'AUM', 'Net Yield', 'Type'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#c5a059', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pipeline.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: p.status === 'Active' ? 'rgba(34,197,94,0.15)' : 'rgba(197,160,89,0.15)', color: p.status === 'Active' ? '#22c55e' : '#c5a059', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#f0ede8', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '14px 16px', color: '#c5a059', fontWeight: 700 }}>{p.aum}</td>
                    <td style={{ padding: '14px 16px', color: '#22c55e', fontWeight: 600 }}>{p.yield}</td>
                    <td style={{ padding: '14px 16px', color: '#706860' }}>{p.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Contact / IR Form ── */}
      <section id="contact" style={{ padding: '100px 48px', maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '12px', color: '#f0ede8' }}>
          Request Investor Pack
        </h2>
        <p style={{ textAlign: 'center', color: '#706860', marginBottom: '48px', fontSize: '15px' }}>
          Qualified institutions receive the full prospectus, Sharia certification, and SPV term sheets within 24h.
        </p>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: '#22c55e', marginBottom: '8px' }}>Request Received</h3>
            <p style={{ color: '#706860' }}>Our IR team will contact you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { id: 'name', placeholder: 'Full Name', type: 'text' },
              { id: 'company', placeholder: 'Institution / Fund Name', type: 'text' },
              { id: 'email', placeholder: 'Institutional Email Address', type: 'email' },
              { id: 'aum', placeholder: 'Investable AUM (€M)', type: 'text' },
            ].map((field) => (
              <input
                key={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required={field.id !== 'aum'}
                value={(formData as any)[field.id]}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(197,160,89,0.2)', borderRadius: '10px', padding: '16px 20px', color: '#f0ede8', fontSize: '15px', outline: 'none' }}
              />
            ))}
            <button type="submit" style={{ background: 'linear-gradient(135deg, #c5a059, #b08d48)', color: '#050f0a', padding: '18px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              Request Institutional Deck →
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#50483e' }}>
              For qualified investors only. This is not a public offer. Data handled per GDPR.
            </p>
          </form>
        )}
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(197,160,89,0.1)', padding: '40px 48px', textAlign: 'center', color: '#50483e', fontSize: '13px' }}>
        <p style={{ marginBottom: '8px' }}>
          <strong style={{ color: '#c5a059' }}>Amanah PropTech</strong> · Institutional Relations · deals@amanah-proptech.com
        </p>
        <p>© 2026 Amanah PropTech. Technology provider & tied agent (Tied Agent) per § 2 Para. 10 KWG. All investments are mediated under the liability of our licensed white-label partner.</p>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <Link href="/institutional" style={{ color: '#706860', textDecoration: 'none' }}>🇩🇪 German Version</Link>
          <Link href="/compliance" style={{ color: '#706860', textDecoration: 'none' }}>Compliance</Link>
          <Link href="/institutional/dashboard" style={{ color: '#706860', textDecoration: 'none' }}>Investor Login</Link>
        </div>
      </footer>
    </main>
  );
}
