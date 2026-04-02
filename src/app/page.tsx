'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';

const PATTERNS = [
  { id: 'glass', name: 'グラス', img: '/pattern-glass.png' },
  { id: 'classic', name: 'グラデーション', img: '/pattern-classic.png' },
  { id: 'topbar', name: 'トップバー', img: '/pattern-neon.png' }, // 仮の画像を使用
  { id: 'bottombar', name: 'ボトムバー', img: '/pattern-minimal.png' }, // 仮
  { id: 'full', name: 'フル', img: '/pattern-classic.png' }, // 仮
  { id: 'columns', name: '2カラム', img: '/pattern-glass.png' }, // 仮
];

const FONTS = [
  { id: 'noto-sans-jp', name: 'Noto Sans JP' },
  { id: 'noto-serif-jp', name: 'Noto Serif JP' },
  { id: 'm-plus-rounded', name: 'M PLUS Rounded' },
  { id: 'inter', name: 'Inter (English)' },
];

const COLOR_PRESETS = [
  { id: 'dark-blue', colors: ['#0f0c29', '#302b63'] },
  { id: 'dark-green', colors: ['#0a1a0f', '#1a3a2a'] },
  { id: 'dark-purple', colors: ['#1a0a2e', '#2d1b69'] },
  { id: 'dark-warm', colors: ['#1a0a00', '#2d1500'] },
  { id: 'light-blue', colors: ['#e0f2fe', '#bae6fd'] },
  { id: 'light-green', colors: ['#ecfdf5', '#d1fae5'] },
  { id: 'light-warm', colors: ['#fff7ed', '#fed7aa'] },
  { id: 'light-purple', colors: ['#f5f3ff', '#ede9fe'] },
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
    <div className="app-wrapper">
      {/* 左側: 設定・背景ブロック */}
      <aside className="sidebar">
        <h2 className="sidebar-title">設定</h2>

        <div className="form-group">
          <label className="label">コンテンツタイプ</label>
          <input name="type" className="input" placeholder="採択" value={formData.type} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="label">タイトル</label>
          <textarea 
            name="title" 
            className="input" 
            rows={3} 
            placeholder="メインタイトルを入力" 
            style={{ resize: 'none' }}
            value={formData.title} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label className="label">補足情報</label>
          <input name="info" className="input" placeholder="Arakawa Lab | IEEE 2026" value={formData.info} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="label">フォント</label>
          <select name="font" className="select" value={formData.font} onChange={handleChange}>
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginTop: 'auto' }}>
          <label className="label">背景</label>
          <div className="tabs">
            {BG_SOURCES.map((s) => (
              <div 
                key={s.id} 
                className={`tab-item ${formData.source === s.id ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, source: s.id })}
              >
                {s.label.split(' ')[1]}
              </div>
            ))}
          </div>

          {formData.source === 'gradient' && (
            <div className="swatch-grid animate-fade-in">
              {COLOR_PRESETS.map((c) => (
                <div
                  key={c.id}
                  className={`swatch ${formData.color === c.id ? 'active' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}
                  onClick={() => setFormData({ ...formData, color: c.id })}
                />
              ))}
            </div>
          )}

          {formData.source !== 'gradient' && (
            <div className="animate-fade-in">
              <input
                name="query"
                className="input"
                placeholder={formData.source === 'pollinations' ? 'AIプロンプトを入力' : '写真キーワードを入力'}
                value={formData.query}
                onChange={handleChange}
              />
              <button className="btn-regenerate" onClick={generatePreview} disabled={isOverLimit}>
                {loading ? '生成中...' : '🔄 背景を再構成'}
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          残り利用回数: {maxLimit - usage} / {maxLimit}
        </div>
      </aside>

      {/* 右側: 3段構成メインコンテンツ */}
      <main className="main-content">
        {/* 上段: デザインブロック */}
        <section className="patterns-area">
          <div className="label">レイアウトパターン</div>
          <div className="patterns-row">
            {PATTERNS.map((p) => (
              <div 
                key={p.id} 
                className={`pattern-card ${formData.pattern === p.id ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, pattern: p.id })}
              >
                <div className="pattern-thumb">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="pattern-name">{p.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 中段: プレビュー画面 */}
        <section className="canvas-area">
          <div className="preview-container">
            <div className="ogp-image-box">
              {loading && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                </div>
              )}
              <img 
                src={ogUrl} 
                alt="OGP Preview" 
                className="ogp-image" 
                key={previewKey} 
                onLoad={() => setLoading(false)} 
                onError={() => setLoading(false)} 
              />
            </div>
            <div className="resolution-label">1200 × 630</div>
          </div>
        </section>

        {/* 下段: PNGダウンロード */}
        <footer className="export-area">
          <button className="btn-primary" onClick={downloadImage} disabled={downloading}>
            <Download size={20} />
            {downloading ? '保存中...' : 'PNGをダウンロード'}
          </button>
        </footer>
      </main>
    </div>
  );
}
