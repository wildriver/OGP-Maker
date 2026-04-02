'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';

const PATTERNS = [
  { id: 'glass', name: 'グラス', img: '/pattern-glass.png' },
  { id: 'classic', name: 'グラデーション', img: '/pattern-classic.png' },
  { id: 'topbar', name: 'トップバー', img: '/pattern-neon.png' },
  { id: 'bottombar', name: 'ボトムバー', img: '/pattern-minimal.png' },
  { id: 'full', name: 'フルイメージ', img: '/pattern-classic.png' },
  { id: 'columns', name: '2カラム', img: '/pattern-glass.png' },
];

const FONTS = [
  { id: 'noto-sans-jp', name: 'Noto Sans JP' },
  { id: 'noto-serif-jp', name: 'Noto Serif JP' },
  { id: 'm-plus-rounded', name: 'M PLUS Rounded' },
  { id: 'inter', name: 'Inter (English)' },
];

const COLOR_PRESETS = [
  { id: 'dark-blue', name: 'ダーク・ブルー', colors: ['#0f0c29', '#302b63'] },
  { id: 'dark-green', name: 'ダーク・グリーン', colors: ['#0a1a0f', '#1a3a2a'] },
  { id: 'dark-purple', name: 'ダーク・パープル', colors: ['#1a0a2e', '#2d1b69'] },
  { id: 'dark-warm', name: 'ダーク・ウォーム', colors: ['#1a0a00', '#2d1500'] },
  { id: 'light-blue', name: 'ライト・ブルー', colors: ['#e0f2fe', '#bae6fd'] },
  { id: 'light-green', name: 'ライト・グリーン', colors: ['#ecfdf5', '#d1fae5'] },
  { id: 'light-warm', name: 'ライト・ウォーム', colors: ['#fff7ed', '#fed7aa'] },
  { id: 'light-purple', name: 'ライト・パープル', colors: ['#f5f3ff', '#ede9fe'] },
];

const BG_SOURCES = [
  { id: 'gradient', label: '🎨 カラー' },
  { id: 'pollinations', label: '✨ AI生成' },
  { id: 'unsplash', label: '📷 写真' },
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function Home() {
  const [formData, setFormData] = useState({
    type: '採択',
    title: '大規模言語モデルによる研究支援の新展開',
    info: 'Arakawa Lab | IEEE 2026',
    pattern: 'glass',
    seed: '42',
    source: 'gradient',
    query: '',
    font: 'noto-sans-jp',
    color: 'dark-blue',
  });

  const [usage, setUsage] = useState(0);
  const [previewKey, setPreviewKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const maxLimit = 30;
  const isOverLimit = usage >= maxLimit;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePreview = () => {
    if (isOverLimit) {
      alert(`本日の利用上限（${maxLimit}回/日）に達しました。`);
      return;
    }
    setLoading(true);
    setFormData(prev => ({ ...prev, seed: Math.floor(Math.random() * 10000).toString() }));
    incrementUsage();
    setPreviewKey(prev => prev + 1);
  };

  const ogUrl = `/api/og?title=${encodeURIComponent(formData.title)}&type=${encodeURIComponent(formData.type)}&info=${encodeURIComponent(formData.info)}&pattern=${formData.pattern}&seed=${formData.seed}&source=${formData.source}&query=${encodeURIComponent(formData.query || formData.title)}&font=${formData.font}&color=${formData.color}`;

  const downloadImage = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = formData.title.replace(/[^\w\u3000-\u9fff\uff00-\uffef-]/g, '_').substring(0, 40);
      a.download = `ogp_${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('ダウンロードに失敗しました。');
    } finally {
      setDownloading(false);
    }
  }, [ogUrl, formData.title]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>OGP Maker</h1>
        <p>AI背景 × テキストオーバーレイで、プロフェッショナルな画像を瞬時に生成</p>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-group">
            <h3 className="section-title"><span>📋</span> コンテンツ設定</h3>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>コンテンツタイプ</label>
              <input name="type" className="dark-input" placeholder="採択" value={formData.type} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>タイトル</label>
              <textarea 
                name="title" 
                className="dark-input" 
                rows={3} 
                style={{ resize: 'none' }} 
                value={formData.title} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>補足情報</label>
              <input name="info" className="dark-input" placeholder="Arakawa Lab" value={formData.info} onChange={handleChange} />
            </div>
          </div>

          <div className="sidebar-group">
            <h3 className="section-title"><span>🖋</span> タイポグラフィ</h3>
            <select name="font" className="dark-select" value={formData.font} onChange={handleChange}>
              {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div className="sidebar-group">
            <h3 className="section-title"><span>🖼</span> 背景・スタイル</h3>
            <div className="dark-tabs">
              {BG_SOURCES.map(s => (
                <div 
                  key={s.id} 
                  className={`dark-tab ${formData.source === s.id ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, source: s.id }))}
                >
                  {s.label.split(' ')[1]}
                </div>
              ))}
            </div>

            {formData.source === 'gradient' ? (
              <div className="palette-grid animate-fade-in">
                {COLOR_PRESETS.map(c => (
                  <div 
                    key={c.id} 
                    className={`palette-item ${formData.color === c.id ? 'active' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}
                    onClick={() => setFormData(prev => ({ ...prev, color: c.id }))}
                  >
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-fade-in">
                <input 
                  name="query" 
                  className="dark-input" 
                  placeholder={formData.source === 'pollinations' ? 'AI指示（例: nebula, city）' : '写真検索キーワード'} 
                  value={formData.query} 
                  onChange={handleChange} 
                />
                <button className="btn-secondary" onClick={generatePreview} disabled={isOverLimit}>
                  {loading ? '生成中...' : '🔄 背景を再構成する'}
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
             本日利用: {usage} / {maxLimit} 回 <br />
             <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>明日にリセットされます</span>
          </div>
        </aside>

        <main className="main-dashboard">
          <section className="pattern-section">
            <h3 className="section-title">🧩 レイアウトデザイン</h3>
            <div className="pattern-carousel">
              {PATTERNS.map(p => (
                <div 
                  key={p.id} 
                  className={`pattern-box ${formData.pattern === p.id ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, pattern: p.id }))}
                >
                  <div className="pattern-media">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="pattern-label">{p.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="canvas-section">
            <div className="canvas-preview">
              <div className="og-frame">
                {loading && (
                  <div className="loading-shade">
                    <div className="spin"></div>
                  </div>
                )}
                <img src={ogUrl} alt="Preview" className="og-img" key={previewKey} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
              </div>
              <div style={{ textAlign: 'right', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>1200 × 630</div>
            </div>
          </section>

          <footer className="action-area">
            <button className="btn-download" onClick={downloadImage} disabled={downloading}>
              <Download size={24} />
              {downloading ? '保存中...' : 'PNGをダウンロード'}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
