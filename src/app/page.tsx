'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, ImageIcon } from 'lucide-react';

const PATTERNS = [
  { id: 'classic', name: 'クラシック', desc: 'グラデーションオーバーレイ', img: '/pattern-classic.png' },
  { id: 'glass', name: 'グラス', desc: 'すりガラス風カード', img: '/pattern-glass.png' },
  { id: 'neon', name: 'ネオン', desc: 'サイバーな発光効果', img: '/pattern-neon.png' },
  { id: 'minimal', name: 'ミニマル', desc: '左寄せ大文字', img: '/pattern-minimal.png' },
];

const FONTS = [
  { id: 'noto-sans-jp', name: 'Noto Sans JP', desc: 'ゴシック体' },
  { id: 'noto-serif-jp', name: 'Noto Serif JP', desc: '明朝体' },
  { id: 'm-plus-rounded', name: 'M PLUS Rounded', desc: '丸ゴシック体' },
  { id: 'inter', name: 'Inter', desc: '英語向けサンセリフ' },
];

const COLOR_PRESETS = [
  { id: 'dark-blue', name: 'ダーク・ブルー', colors: ['#0f0c29', '#302b63'], light: false },
  { id: 'dark-green', name: 'ダーク・グリーン', colors: ['#0a1a0f', '#1a3a2a'], light: false },
  { id: 'dark-purple', name: 'ダーク・パープル', colors: ['#1a0a2e', '#2d1b69'], light: false },
  { id: 'dark-warm', name: 'ダーク・ウォーム', colors: ['#1a0a00', '#2d1500'], light: false },
  { id: 'light-blue', name: 'ライト・ブルー', colors: ['#e0f2fe', '#bae6fd'], light: true },
  { id: 'light-green', name: 'ライト・グリーン', colors: ['#ecfdf5', '#d1fae5'], light: true },
  { id: 'light-warm', name: 'ライト・ウォーム', colors: ['#fff7ed', '#fed7aa'], light: true },
  { id: 'light-purple', name: 'ライト・パープル', colors: ['#f5f3ff', '#ede9fe'], light: true },
];

const BG_SOURCES = [
  { id: 'gradient', label: '🎨 カラー' },
  { id: 'pollinations', label: '✨ AI生成' },
  { id: 'unsplash', label: '📷 写真素材' },
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
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo-group">
          <h1>OGP Maker</h1>
        </div>
        <p className="header-subtitle">AI背景 × テキストオーバーレイで、SNS映えする画像を生成</p>
      </header>

      <main className="main-grid">
        <aside className="editor-sidebar">
          <div className="form-section">
            <label className="label">コンテンツタイプ / 補足情報</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input name="type" className="input" placeholder="採択" value={formData.type} onChange={handleChange} />
              <input name="info" className="input" placeholder="Arakawa Lab" value={formData.info} onChange={handleChange} />
            </div>
          </div>

          <div className="form-section">
            <label className="label">タイトル</label>
            <textarea 
              name="title" 
              className="input" 
              rows={2}
              style={{ resize: 'none' }}
              value={formData.title} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-section">
            <label className="label">背景ソース</label>
            <div className="tabs-row">
              {BG_SOURCES.map((s) => (
                <button 
                  key={s.id}
                  className={`tab-btn ${formData.source === s.id ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, source: s.id })}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {formData.source === 'gradient' && (
            <div className="form-section">
              <label className="label">カラープリセット</label>
              <div className="color-swatch-grid">
                {COLOR_PRESETS.map((c) => (
                  <div
                    key={c.id}
                    className={`swatch ${formData.color === c.id ? 'active' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}
                    onClick={() => setFormData({ ...formData, color: c.id })}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {formData.source !== 'gradient' && (
            <div className="form-section">
              <label className="label">
                {formData.source === 'pollinations' ? 'AIプロンプト' : '写真検索キーワード'}
              </label>
              <input
                name="query"
                className="input"
                placeholder={formData.source === 'pollinations' ? '例: space nebula' : '例: laboratory'}
                value={formData.query}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-section">
            <label className="label">フォント</label>
            <select name="font" className="select" value={formData.font} onChange={handleChange}>
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label className="label">レイアウトパターン</label>
            <div className="pattern-row">
              {PATTERNS.map((p) => (
                <label key={p.id} className="pattern-item">
                  <input type="radio" name="pattern" value={p.id} checked={formData.pattern === p.id} onChange={handleChange} />
                  <div className="pattern-thumb"><img src={p.img} alt={p.name} /></div>
                  <div className="pattern-name">{p.name}</div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn-generate" style={{ width: '100%', marginBottom: '12px' }} onClick={generatePreview} disabled={isOverLimit}>
              {loading ? '生成中...' : '🔄 背景を再構成する'}
            </button>
            <button className="btn-primary" onClick={downloadImage} disabled={downloading}>
              {downloading ? '生成中...' : '📥 PNGをダウンロード'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              利用回数: {usage} / {maxLimit}
            </div>
          </div>
        </aside>

        <section className="canvas-area">
          <div className="preview-box">
            <span className="preview-label">Live Preview (1200 × 630)</span>
            {isOverLimit ? (
              <div className="loading-overlay">
                <p style={{ fontWeight: 700 }}>利用上限に達しました</p>
              </div>
            ) : (
              <>
                {loading && (
                  <div className="loading-overlay">
                    <div className="loader-spinner"></div>
                    <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>生成中...</p>
                  </div>
                )}
                <img src={ogUrl} alt="Preview" className="ogp-image" key={previewKey} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
