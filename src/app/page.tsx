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
  { id: 'noto-sans-jp', name: 'Noto Sans JP', type: 'ゴシック体', family: "'Noto Sans JP', sans-serif" },
  { id: 'noto-serif-jp', name: 'Noto Serif JP', type: '明朝体', family: "'Noto Serif JP', serif" },
  { id: 'm-plus-rounded', name: 'M PLUS Rounded', type: '丸ゴシック体', family: "'M PLUS Rounded 1c', sans-serif" },
  { id: 'inter', name: 'Inter', type: '英語向けサンセリフ', family: "Inter, sans-serif" },
];

const COLOR_PRESETS = [
  { id: 'dark-blue', name: 'ダーク・ブルー', colors: ['#0f0c29', '#302b63'], isLight: false },
  { id: 'dark-green', name: 'ダーク・グリーン', colors: ['#0a1a0f', '#1a3a2a'], isLight: false },
  { id: 'dark-purple', name: 'ダーク・パープル', colors: ['#1a0a2e', '#2d1b69'], isLight: false },
  { id: 'dark-warm', name: 'ダーク・ウォーム', colors: ['#1a0a00', '#2d1500'], isLight: false },
  { id: 'light-blue', name: 'ライト・ブルー', colors: ['#e0f2fe', '#bae6fd'], isLight: true },
  { id: 'light-green', name: 'ライト・グリーン', colors: ['#ecfdf5', '#d1fae5'], isLight: true },
  { id: 'light-warm', name: 'ライト・ウォーム', colors: ['#fff7ed', '#fed7aa'], isLight: true },
  { id: 'light-purple', name: 'ライト・パープル', colors: ['#f5f3ff', '#ede9fe'], isLight: true },
];

const BG_SOURCES = [
  { id: 'gradient', label: '🎨 カラー', icon: '🎨' },
  { id: 'pollinations', label: '✨ AI生成', icon: '✨' },
  { id: 'unsplash', label: '📷 写真素材', icon: '📷' },
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
        <p>AI背景 × テキストオーバーレイで、プロフェッショナルな画像を生成</p>
      </header>

      {/* トップパネル: コンテンツ内容を横並びで集中管理 */}
      <section className="input-panel">
        <div className="field-group">
          <div className="field-label">表示ヘッダ <span className="hint">例: 採択, 受賞</span></div>
          <input name="type" className="panel-input" value={formData.type} onChange={handleChange} />
        </div>
        <div className="field-group">
          <div className="field-label">メインタイトル</div>
          <textarea name="title" className="panel-textarea" rows={2} value={formData.title} onChange={handleChange} />
        </div>
        <div className="field-group">
          <div className="field-label">補足・クレジット</div>
          <textarea name="info" className="panel-textarea" rows={2} value={formData.info} onChange={handleChange} />
        </div>
      </section>

      <div className="workspace">
        {/* サイドバー: スタイル・フォント設定 (独立スクロール) */}
        <aside className="sidebar">
          <div className="sidebar-group">
            <h3 className="section-label">🖋 書体選択</h3>
            <select name="font" className="dark-select" value={formData.font} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'white', borderRadius: '8px' }}>
              {FONTS.map(f => (
                <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                  {f.name} — {f.type}
                </option>
              ))}
            </select>
          </div>

          <div className="sidebar-group">
            <h3 className="section-label">🖼 背景スタイル</h3>
            {/* プレミアム・タブデザインの復活 */}
            <div className="premium-tabs">
              {BG_SOURCES.map(s => (
                <div 
                  key={s.id} 
                  className={`premium-tab ${formData.source === s.id ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, source: s.id }))}
                >
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span> {s.label.split(' ')[1]}
                </div>
              ))}
            </div>

            {formData.source === 'gradient' ? (
              <div className="palette-card-grid animate-fade-in">
                {COLOR_PRESETS.map(c => (
                  <div 
                    key={c.id} 
                    className={`palette-card ${formData.color === c.id ? 'active' : ''}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})`,
                      color: c.isLight ? '#000' : '#fff'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, color: c.id }))}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-fade-in">
                <input 
                  name="query" 
                  className="panel-input" 
                  placeholder={formData.source === 'pollinations' ? 'AI指示（例: nebula, city）' : 'キーワード検索'} 
                  value={formData.query} 
                  onChange={handleChange} 
                  style={{ width: '100%', marginBottom: '12px' }}
                />
                <button className="btn-premium" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }} onClick={generatePreview} disabled={isOverLimit}>
                  🔄 背景を生成する
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', paddingTop: '20px' }}>
             本日利用: {usage} / {maxLimit} 回分
          </div>
        </aside>

        {/* メイン: 制作ダッシュボード */}
        <main className="main-dashboard">
          <section className="pattern-bar">
            {PATTERNS.map(p => (
              <div 
                key={p.id} 
                className={`pattern-card ${formData.pattern === p.id ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, pattern: p.id }))}
              >
                <div className="pattern-thumb-box">
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: formData.pattern === p.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {p.name}
                </div>
              </div>
            ))}
          </section>

          <section className="canvas-center">
            <div className="og-vignette">
              {loading && (
                <div className="loading-shade">
                  <div className="spin"></div>
                </div>
              )}
              <img src={ogUrl} alt="Preview" className="og-img" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} key={previewKey} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
              <div style={{ position: 'absolute', bottom: '-24px', right: '0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>1200 × 630</div>
            </div>
          </section>

          <footer className="action-bar">
            <button className="btn-og-primary" onClick={downloadImage} disabled={downloading}>
              <Download size={22} />
              {downloading ? '生成中...' : 'PNGをダウンロード'}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
