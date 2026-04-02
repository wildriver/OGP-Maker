'use client';

import { useState, useEffect } from 'react';
import { Download, Copy, RefreshCcw, Settings, ImageIcon } from 'lucide-react';

const PATTERNS = [
  { id: 'classic', name: 'クラシック', desc: 'グラデーションオーバーレイ', img: '/pattern-classic.png' },
  { id: 'glass', name: 'グラス', desc: 'すりガラス風カード', img: '/pattern-glass.png' },
  { id: 'neon', name: 'ネオン', desc: 'サイバーな発光効果', img: '/pattern-neon.png' },
  { id: 'minimal', name: 'ミニマル', desc: '左寄せ大文字', img: '/pattern-minimal.png' },
];

const FONTS = [
  { id: 'noto-sans-jp', name: 'Noto Sans JP', desc: 'ゴシック体（デフォルト）' },
  { id: 'noto-serif-jp', name: 'Noto Serif JP', desc: '明朝体' },
  { id: 'm-plus-rounded', name: 'M PLUS Rounded', desc: '丸ゴシック体' },
  { id: 'inter', name: 'Inter', desc: '英語向けサンセリフ' },
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function Home() {
  const [formData, setFormData] = useState({
    type: '採択',
    title: '大規模言語モデルによる研究支援の新展開',
    info: 'Arakawa Lab | IEEE 2026',
    pattern: 'glass',
    seed: '42',
    source: 'pollinations',
    query: '',
    font: 'noto-sans-jp',
  });

  const [usage, setUsage] = useState(0);
  const [previewKey, setPreviewKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const isOverLimit = usage >= maxLimit;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    // Loading will be cleared when image loads
  };

  const ogUrl = `/api/og?title=${encodeURIComponent(formData.title)}&type=${encodeURIComponent(formData.type)}&info=${encodeURIComponent(formData.info)}&pattern=${formData.pattern}&seed=${formData.seed}&source=${formData.source}&query=${encodeURIComponent(formData.query || formData.title)}&font=${formData.font}`;

  const copyUrl = () => {
    const fullUrl = window.location.origin + ogUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="gradient-text" style={{ fontSize: '3.2rem', marginBottom: '8px', letterSpacing: '-1px' }}>
          OGP Maker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          AI背景 × テキストオーバーレイで、SNS映えするOGP画像を生成
        </p>
      </header>

      <div className="main-grid">
        {/* ===== Left: Form ===== */}
        <section className="card">
          {/* Type + Info */}
          <div className="form-group">
            <label className="label">コンテンツタイプ / 補足情報</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input name="type" className="input" placeholder="例: 採択 / 報告 / 発表" style={{ width: '40%' }} value={formData.type} onChange={handleChange} />
              <input name="info" className="input" placeholder="例: 学会名 / 日付" style={{ width: '60%' }} value={formData.info} onChange={handleChange} />
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="label">タイトル</label>
            <input name="title" className="input" placeholder="メインタイトルを入力" value={formData.title} onChange={handleChange} />
          </div>

          {/* Background Source */}
          <div className="form-group">
            <label className="label">背景画像</label>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <label className="radio-label">
                <input type="radio" name="source" value="pollinations" checked={formData.source === 'pollinations'} onChange={handleChange} />
                <span>🎨 AI生成（Pollinations）</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="source" value="unsplash" checked={formData.source === 'unsplash'} onChange={handleChange} />
                <span>📷 写真素材（Unsplash）</span>
              </label>
            </div>
            <input
              name="query"
              className="input"
              placeholder={formData.source === 'pollinations' ? '背景のプロンプト（空欄ならタイトルを使用）' : '検索キーワード（例: nature, technology）'}
              value={formData.query}
              onChange={handleChange}
            />
          </div>

          {/* Font */}
          <div className="form-group">
            <label className="label">フォント</label>
            <select name="font" className="input select" value={formData.font} onChange={handleChange}>
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.name} — {f.desc}</option>
              ))}
            </select>
          </div>

          {/* Pattern */}
          <div className="form-group">
            <label className="label">レイアウトパターン</label>
            <div className="pattern-grid">
              {PATTERNS.map((p) => (
                <label key={p.id} className="pattern-option">
                  <input type="radio" name="pattern" value={p.id} className="pattern-input" checked={formData.pattern === p.id} onChange={handleChange} />
                  <div className="pattern-card">
                    <img src={p.img} alt={p.name} className="pattern-preview-img" />
                    <div className="pattern-name">{p.name}</div>
                    <div className="pattern-desc">{p.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button className="button generate-btn" onClick={generatePreview} disabled={isOverLimit}>
            <ImageIcon size={20} />
            {loading ? '生成中...' : '🔄 背景を再生成する'}
          </button>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button className="button secondary-btn" onClick={copyUrl}>
              <Copy size={18} /> {copied ? 'コピーしました！' : 'OGP URLをコピー'}
            </button>
            <a href={ogUrl} target="_blank" className="button secondary-btn" rel="noopener noreferrer">
              <Download size={18} /> フルサイズで開く
            </a>
          </div>

          {/* Usage Bar */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div className="usage-bar">
              <div className="usage-fill" style={{
                width: `${Math.min(100, (usage / maxLimit) * 100)}%`,
                background: usage >= maxLimit ? 'var(--accent-color)' : 'var(--accent-blue)',
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: isOverLimit ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
              本日の利用: {usage} / {maxLimit} 回
            </span>
          </div>
        </section>

        {/* ===== Right: Preview ===== */}
        <section className="preview-section" style={{ marginTop: 0 }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>プレビュー（1200×630）</h2>
          <div className="ogp-preview-container">
            {isOverLimit ? (
              <div className="limit-overlay">
                <p style={{ marginBottom: '12px', fontWeight: 600, fontSize: '1.1rem' }}>本日の利用上限に達しました</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>明日またお使いいただけます。</p>
              </div>
            ) : (
              <>
                {loading && (
                  <div className="loading-overlay">
                    <div className="spinner" />
                    <p>画像を生成中...</p>
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
              </>
            )}
          </div>

          {/* How to use */}
          <div className="tip-card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={16} /> 使い方
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              生成されたURLをHTMLの<code>&lt;meta&gt;</code>タグに設定してください：
            </p>
            <code className="code-block">
              &lt;meta property=&quot;og:image&quot; content=&quot;https://your-domain.com{ogUrl}&quot; /&gt;
            </code>
          </div>
        </section>
      </div>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-secondary)', paddingBottom: '40px', fontSize: '0.85rem' }}>
        <p>Pollinations AI + Unsplash + Next.js で構築 | Vercel にデプロイ中</p>
      </footer>
    </main>
  );
}
