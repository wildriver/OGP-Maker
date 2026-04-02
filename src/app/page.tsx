'use client';

import { useState, useEffect } from 'react';
import { Download, Copy, RefreshCcw, LogIn, Settings } from 'lucide-react';

const PATTERNS = [
  { id: 'classic', name: 'Classic Dark', desc: 'Minimalist dark overlay' },
  { id: 'glass', name: 'Glassmorphism', desc: 'Frosted central card' },
  { id: 'neon', name: 'Cyber Neon', desc: 'Glowing text effects' },
  { id: 'minimal', name: 'Clean Light', desc: 'Focus on title scale' },
];

// Help helper for cookies
const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function Home() {
  const [formData, setFormData] = useState({
    type: 'Report',
    title: 'Modern OGP Generator Service',
    info: 'Arakawa Lab | 2026',
    pattern: 'glass',
    seed: '42',
    apiKey: '',
    source: 'pollinations',
    query: ''
  });
  
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    const date = getTodayDate();
    const stored = localStorage.getItem(`ogp_usage_${date}`);
    if (stored) setUsage(parseInt(stored));
  }, []);

  const incrementUsage = () => {
    const date = getTodayDate();
    const newCount = usage + 1;
    setUsage(newCount);
    localStorage.setItem(`ogp_usage_${date}`, newCount.toString());
  };

  const maxLimit = 10;
  const isOverLimit = !formData.apiKey && usage >= maxLimit;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const regenerateSeed = () => {
    if (isOverLimit) {
      alert(`Limit reached (${maxLimit}/day). Use your own API key for more.`);
      return;
    }
    setFormData(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000).toString() }));
    incrementUsage();
  };

  const ogUrl = `/api/og?title=${encodeURIComponent(formData.title)}&type=${encodeURIComponent(formData.type)}&info=${encodeURIComponent(formData.info)}&pattern=${formData.pattern}&seed=${formData.seed}&source=${formData.source}&query=${encodeURIComponent(formData.query || formData.title)}`;

  const copyUrl = () => {
    const fullUrl = window.location.origin + ogUrl;
    navigator.clipboard.writeText(fullUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '8px', letterSpacing: '-1px' }}>
          OGP Maker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Powered by Pollinations AI
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        <section className="card">
          <div className="form-group">
            <label className="label">Template Data</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input name="type" className="input" placeholder="Type" style={{ width: '40%' }} value={formData.type} onChange={handleChange} />
              <input name="info" className="input" placeholder="Supplementary Info" style={{ width: '60%' }} value={formData.info} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Title</label>
            <input name="title" className="input" placeholder="Main Title" value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label">Background Source</label>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="source" value="pollinations" checked={formData.source === 'pollinations'} onChange={handleChange} />
                <span style={{ fontSize: '0.9rem' }}>AI (Pollinations)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="source" value="unsplash" checked={formData.source === 'unsplash'} onChange={handleChange} />
                <span style={{ fontSize: '0.9rem' }}>Stock (Unsplash)</span>
              </label>
            </div>
            {formData.source === 'unsplash' && (
              <input 
                name="query" 
                className="input" 
                placeholder="Search keyword (e.g. nature, tech)" 
                value={formData.query} 
                onChange={handleChange} 
              />
            )}
          </div>

          <div className="form-group">
            <label className="label">Layout Pattern</label>
            <div className="pattern-grid">
              {PATTERNS.map((p) => (
                <label key={p.id} className="pattern-option">
                  <input type="radio" name="pattern" value={p.id} className="pattern-input" checked={formData.pattern === p.id} onChange={handleChange} />
                  <div className="pattern-card">
                    <div className="pattern-name">{p.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Settings size={16} /> Optional Settings
            </label>
            <input 
              name="apiKey" 
              className="input" 
              placeholder="Enter Access Key (Unlimited Mode)" 
              value={formData.apiKey} 
              onChange={handleChange}
              type="password"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={copyUrl}>
              <Copy size={20} /> Copy OGP URL
            </button>
            <button className="button" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }} onClick={regenerateSeed} title="Regenerate Background">
              <RefreshCcw size={20} />
            </button>
          </div>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ 
              height: '4px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '2px', 
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{ 
                width: `${Math.min(100, (usage / maxLimit) * 100)}%`, 
                height: '100%', 
                background: usage >= maxLimit ? 'var(--accent-color)' : 'var(--accent-blue)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: isOverLimit ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
              Usage Today: {usage} / {maxLimit}
            </span>
          </div>
        </section>

        <section className="preview-section" style={{ marginTop: 0 }}>
          <div className="ogp-preview-container" style={{ border: isOverLimit ? '2px solid var(--accent-color)' : '1px solid var(--border-color)' }}>
            {isOverLimit ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', background: 'rgba(0,0,0,0.8)' }}>
                <p style={{ marginBottom: '16px', fontWeight: 600 }}>Limit reached for today!</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Wait 24h or enter an Access Key to continue.</p>
              </div>
            ) : (
              <>
                <img src={ogUrl} alt="OGP Preview" className="ogp-image" key={ogUrl} />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '285px',
                  width: '630px',
                  height: '630px',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '8px',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)'
                }}>
                  630x630 Critical Area
                </div>
              </>
            )}
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
             <a href={ogUrl} download={`ogp-${formData.seed}.png`} target="_blank" className="button" style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border-color)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} /> Open full size
             </a>
          </div>
        </section>
      </div>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-secondary)', paddingBottom: '40px' }}>
        <p>Built with Pollinations + Unsplash + Next.js. Ready for Vercel.</p>
      </footer>
    </main>
  );
}
