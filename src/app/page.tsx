'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';

const PATTERNS = [
  { id: 'glass',    name: 'グラス',         img: '/pattern-glass.png' },
  { id: 'classic',  name: 'センター',       img: '/pattern-classic.png' },
  { id: 'neon',     name: 'ネオン',         img: '/pattern-neon.png' },
  { id: 'minimal',  name: 'ミニマル',       img: '/pattern-minimal.png' },
  { id: 'full',     name: 'ボトムバー',     img: '/pattern-neon.png' },
  { id: 'columns',  name: '2カラム',        img: '/pattern-minimal.png' },
];

const FONTS = [
  { id: 'noto-sans-jp',   name: 'Noto Sans JP',    desc: 'ゴシック体' },
  { id: 'noto-serif-jp',  name: 'Noto Serif JP',   desc: '明朝体' },
  { id: 'm-plus-rounded', name: 'M PLUS Rounded',  desc: '丸ゴシック体' },
  { id: 'inter',          name: 'Inter',            desc: '英語向けサンセリフ' },
];

const COLOR_PRESETS = [
  { id: 'dark-blue',    label: 'Blue',   colors: ['#0f0c29', '#302b63'] },
  { id: 'dark-green',   label: 'Green',  colors: ['#0a1a0f', '#1a3a2a'] },
  { id: 'dark-purple',  label: 'Purple', colors: ['#1a0a2e', '#2d1b69'] },
  { id: 'dark-warm',    label: 'Warm',   colors: ['#1a0a00', '#2d1500'] },
  { id: 'light-blue',   label: 'Blue',   colors: ['#e0f2fe', '#bae6fd'], text: '#334155' },
  { id: 'light-green',  label: 'Green',  colors: ['#ecfdf5', '#d1fae5'], text: '#334155' },
  { id: 'light-warm',   label: 'Warm',   colors: ['#fff7ed', '#fed7aa'], text: '#334155' },
  { id: 'light-purple', label: 'Purple', colors: ['#f5f3ff', '#ede9fe'], text: '#334155' },
];

const BG_TABS = [
  { id: 'gradient',     label: 'カラー' },
  { id: 'pollinations', label: 'AI生成' },
  { id: 'unsplash',     label: '写真素材' },
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function Home() {
  const [form, setForm] = useState({
    type: '採択', title: '大規模言語モデルによる研究支援の新展開',
    info: 'Arakawa Lab | IEEE 2026', pattern: 'glass', seed: '42',
    source: 'gradient', query: '', font: 'noto-sans-jp', color: 'dark-blue',
  });
  const [usage, setUsage] = useState(0);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const d = getTodayDate();
    const s = localStorage.getItem(`ogp_usage_${d}`);
    if (s) setUsage(parseInt(s));
  }, []);

  const tick = () => { const d = getTodayDate(); const n = usage + 1; setUsage(n); localStorage.setItem(`ogp_usage_${d}`, n.toString()); };
  const limit = 30;
  const over = usage >= limit;

  const set = (patch: Partial<typeof form>) => setForm(p => ({ ...p, ...patch }));
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set({ [e.target.name]: e.target.value });

  const regen = () => { if (over) return; setLoading(true); set({ seed: String(Math.random() * 1e4 | 0) }); tick(); setKey(k => k + 1); };

  const ogUrl = `/api/og?title=${encodeURIComponent(form.title)}&type=${encodeURIComponent(form.type)}&info=${encodeURIComponent(form.info)}&pattern=${form.pattern}&seed=${form.seed}&source=${form.source}&query=${encodeURIComponent(form.query || form.title)}&font=${form.font}&color=${form.color}`;

  const download = useCallback(async () => {
    setSaving(true);
    try {
      const r = await fetch(ogUrl); const b = await r.blob();
      const u = URL.createObjectURL(b); const a = document.createElement('a');
      a.href = u; a.download = `ogp_${form.title.replace(/[^\w\u3000-\u9fff-]/g, '_').substring(0, 30)}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
    } catch { alert('ダウンロードに失敗しました。'); } finally { setSaving(false); }
  }, [ogUrl, form.title]);

  const darkPresets = COLOR_PRESETS.filter(c => c.id.startsWith('dark'));
  const lightPresets = COLOR_PRESETS.filter(c => c.id.startsWith('light'));

  return (
    <div className="app-shell">
      {/* ===== App Bar ===== */}
      <header className="app-bar">
        <div className="logo"><span>OGP</span> Maker</div>
        <div className="tagline">AI背景 × テキストオーバーレイで、SNS映えする画像を生成</div>
      </header>

      {/* ===== Input Bar ===== */}
      <section className="input-bar">
        <div className="field">
          <label className="field-label">表示ヘッダ<span className="field-hint">採択 / 受賞</span></label>
          <input name="type" className="input" value={form.type} onChange={onChange} />
        </div>
        <div className="field">
          <label className="field-label">メインタイトル</label>
          <textarea name="title" className="textarea" rows={1} value={form.title} onChange={onChange} />
        </div>
        <div className="field">
          <label className="field-label">補足・クレジット</label>
          <textarea name="info" className="textarea" rows={1} value={form.info} onChange={onChange} />
        </div>
      </section>

      {/* ===== Workspace ===== */}
      <div className="workspace">
        {/* Properties Panel */}
        <aside className="props-panel">
          <div>
            <div className="prop-section-title">書体</div>
            <select name="font" className="select" value={form.font} onChange={onChange}>
              {FONTS.map(f => <option key={f.id} value={f.id}>{f.name} — {f.desc}</option>)}
            </select>
          </div>

          <div>
            <div className="prop-section-title">背景</div>
            <div className="tab-group">
              {BG_TABS.map(t => (
                <div key={t.id} className={`tab-item ${form.source === t.id ? 'active' : ''}`} onClick={() => set({ source: t.id })}>{t.label}</div>
              ))}
            </div>

            {form.source === 'gradient' ? (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6, color: 'var(--text-tertiary)' }}>Dark</div>
                <div className="color-grid" style={{ marginBottom: 16 }}>
                  {darkPresets.map(c => (
                    <div key={c.id} className={`color-swatch ${form.color === c.id ? 'active' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})`, color: '#fff' }}
                      onClick={() => set({ color: c.id })}>{c.label}</div>
                  ))}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6, color: 'var(--text-tertiary)' }}>Light</div>
                <div className="color-grid">
                  {lightPresets.map(c => (
                    <div key={c.id} className={`color-swatch ${form.color === c.id ? 'active' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})`, color: (c as any).text || '#334155' }}
                      onClick={() => set({ color: c.id })}>{c.label}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <input name="query" className="input" style={{ width: '100%', marginBottom: '12px' }}
                  placeholder={form.source === 'pollinations' ? 'プロンプトを入力' : 'キーワードを入力'}
                  value={form.query} onChange={onChange} />
                <button className="btn-generate" onClick={regen} disabled={over}>背景を再生成</button>
              </div>
            )}
          </div>

          <div className="usage-counter">リミット: {usage} / {limit} 回</div>
        </aside>

        {/* Canvas Panel: Cohesive Studio Layout */}
        <main className="canvas-panel">
          <div className="studio-main-group">
            <div className="pattern-selector">
              <span className="prop-section-title" style={{ border: 'none', padding: 0 }}>レイアウトパターン</span>
              <div className="pattern-options-row">
                {PATTERNS.map(p => (
                  <div key={p.id} className={`pattern-option ${form.pattern === p.id ? 'active' : ''}`} onClick={() => set({ pattern: p.id })}>
                    <div className="pattern-option-thumb">
                      <img src={p.img} alt={p.name} />
                    </div>
                    <span className="pattern-option-name">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="canvas-viewport">
              <div className="canvas-frame">
                {loading && <div className="loading-overlay"><div className="spinner" /></div>}
                <img src={ogUrl} alt="Preview" key={key} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
              </div>
            </div>

            <footer className="action-footer">
              <button className="btn-primary" onClick={download} disabled={saving}>
                <Download size={20} />{saving ? '保存中…' : 'PNGをダウンロード'}
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
