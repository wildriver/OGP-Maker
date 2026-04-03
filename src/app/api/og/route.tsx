import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Verified direct TTF URLs from Google Fonts CDN
const FONT_URLS: Record<string, string> = {
  'noto-sans-jp': 'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf',
  'noto-serif-jp': 'https://fonts.gstatic.com/s/notoserifjp/v33/xn71YHs72GKoTvER4Gn3b5eMRtWGkp6o7MjQ2bzWPebA.ttf',
  'm-plus-rounded': 'https://fonts.gstatic.com/s/mplusrounded1c/v20/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsK.ttf',
  'inter': 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
};

type ColorTheme = {
  bg: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
  glassBg: string;
  glassBorder: string;
  neonGlow: string;
  neonAccent: string;
};

const COLOR_THEMES: Record<string, ColorTheme> = {
  'dark-blue': {
    bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    accent: '#ff3366',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    badgeBg: 'rgba(255,255,255,0.12)',
    badgeText: '#ff3366',
    glassBg: 'rgba(0,0,0,0.4)',
    glassBorder: 'rgba(255,255,255,0.15)',
    neonGlow: '0 0 20px #00d2ff, 0 0 40px #00d2ff',
    neonAccent: '#ff00ff',
  },
  'dark-green': {
    bg: 'linear-gradient(135deg, #0a1a0f, #1a3a2a, #0d2818)',
    accent: '#4ade80',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    badgeBg: 'rgba(74,222,128,0.15)',
    badgeText: '#4ade80',
    glassBg: 'rgba(0,0,0,0.35)',
    glassBorder: 'rgba(74,222,128,0.2)',
    neonGlow: '0 0 20px #4ade80, 0 0 40px #4ade80',
    neonAccent: '#22d3ee',
  },
  'dark-purple': {
    bg: 'linear-gradient(135deg, #1a0a2e, #2d1b69, #1a0a2e)',
    accent: '#a78bfa',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    badgeBg: 'rgba(167,139,250,0.15)',
    badgeText: '#c4b5fd',
    glassBg: 'rgba(0,0,0,0.35)',
    glassBorder: 'rgba(167,139,250,0.2)',
    neonGlow: '0 0 20px #a78bfa, 0 0 40px #a78bfa',
    neonAccent: '#f472b6',
  },
  'dark-warm': {
    bg: 'linear-gradient(135deg, #1a0a00, #2d1500, #1a0800)',
    accent: '#fb923c',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    badgeBg: 'rgba(251,146,60,0.15)',
    badgeText: '#fb923c',
    glassBg: 'rgba(0,0,0,0.35)',
    glassBorder: 'rgba(251,146,60,0.2)',
    neonGlow: '0 0 20px #fb923c, 0 0 40px #fb923c',
    neonAccent: '#f43f5e',
  },
  'light-blue': {
    bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #dbeafe)',
    accent: '#2563eb',
    textPrimary: '#1e293b',
    textSecondary: 'rgba(30,41,59,0.65)',
    badgeBg: 'rgba(37,99,235,0.12)',
    badgeText: '#2563eb',
    glassBg: 'rgba(255,255,255,0.6)',
    glassBorder: 'rgba(37,99,235,0.15)',
    neonGlow: '0 0 12px rgba(37,99,235,0.4)',
    neonAccent: '#7c3aed',
  },
  'light-green': {
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5, #f0fdf4)',
    accent: '#059669',
    textPrimary: '#1e293b',
    textSecondary: 'rgba(30,41,59,0.65)',
    badgeBg: 'rgba(5,150,105,0.12)',
    badgeText: '#059669',
    glassBg: 'rgba(255,255,255,0.6)',
    glassBorder: 'rgba(5,150,105,0.15)',
    neonGlow: '0 0 12px rgba(5,150,105,0.4)',
    neonAccent: '#0891b2',
  },
  'light-warm': {
    bg: 'linear-gradient(135deg, #fff7ed, #fed7aa, #fef3c7)',
    accent: '#c2410c',
    textPrimary: '#1e293b',
    textSecondary: 'rgba(30,41,59,0.65)',
    badgeBg: 'rgba(194,65,12,0.12)',
    badgeText: '#c2410c',
    glassBg: 'rgba(255,255,255,0.6)',
    glassBorder: 'rgba(194,65,12,0.15)',
    neonGlow: '0 0 12px rgba(194,65,12,0.4)',
    neonAccent: '#b91c1c',
  },
  'light-purple': {
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe, #faf5ff)',
    accent: '#7c3aed',
    textPrimary: '#1e293b',
    textSecondary: 'rgba(30,41,59,0.65)',
    badgeBg: 'rgba(124,58,237,0.12)',
    badgeText: '#7c3aed',
    glassBg: 'rgba(255,255,255,0.6)',
    glassBorder: 'rgba(124,58,237,0.15)',
    neonGlow: '0 0 12px rgba(124,58,237,0.4)',
    neonAccent: '#ec4899',
  },
};

async function loadFont(fontKey: string): Promise<ArrayBuffer> {
  const url = FONT_URLS[fontKey] || FONT_URLS['noto-sans-jp'];
  const res = await fetch(url);
  return res.arrayBuffer();
}

// Auto font-size: estimate how many rows the title will take
// and shrink to fit within the available height
function calcTitleFontSize(text: string, maxWidth: number): number {
  // Average char width ~= fontSize * 0.55 for latin, ~= fontSize * 1.0 for CJK
  const hasCJK = /[\u3000-\u9fff\uf900-\ufaff]/.test(text);
  const avgCharWidth = hasCJK ? 1.0 : 0.55;

  // Try sizes from large to small
  const sizes = [80, 72, 64, 56, 48, 42, 36, 32, 28];
  for (const size of sizes) {
    const lineWidth = maxWidth;
    const charsPerLine = Math.floor(lineWidth / (size * avgCharWidth));
    const lines = Math.ceil(text.length / charsPerLine);
    const totalHeight = lines * size * 1.3; // line-height 1.3
    // Keep within ~300px of vertical space for title
    if (totalHeight <= 320) return size;
  }
  return 28;
}

function calcTypeFontSize(text: string): number {
  if (text.length <= 4) return 32;
  if (text.length <= 8) return 28;
  if (text.length <= 15) return 24;
  return 20;
}

function calcInfoFontSize(text: string): number {
  if (text.length <= 20) return 28;
  if (text.length <= 40) return 24;
  return 20;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') || 'タイトル未設定';
  const type = searchParams.get('type') || '';
  const info = searchParams.get('info') || '';
  const pattern = searchParams.get('pattern') || 'classic';
  const seed = searchParams.get('seed') || '42';
  const source = searchParams.get('source') || 'gradient';
  const query = searchParams.get('query') || '';
  const fontKey = searchParams.get('font') || 'noto-sans-jp';
  const colorKey = searchParams.get('color') || 'dark-blue';

  // Load the font
  const fontData = await loadFont(fontKey);
  const fontFamily = 'CustomFont';

  const theme = COLOR_THEMES[colorKey] || COLOR_THEMES['dark-blue'];
  const isDark = colorKey.startsWith('dark');

  // ===== Background image fetching =====
  let bgSrc = '';
  if (source === 'pollinations' || source === 'unsplash') {
    try {
      let bgUrl = '';
      let headers: Record<string, string> = {};

      if (source === 'unsplash') {
        const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
        if (unsplashKey) {
          // Use search instead of random for determinism
          const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query || 'abstract')}&orientation=landscape&per_page=30&client_id=${unsplashKey}`;
          const apiRes = await fetch(searchUrl, {
            headers: { 'Accept-Version': 'v1' }
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            const results = data.results || [];
            if (results.length > 0) {
              // Pick one deterministically using seed
              const idx = Math.abs(parseInt(seed) || 0) % results.length;
              bgUrl = results[idx].urls?.regular || '';
            }
          } else {
            console.warn(`[OG-API] Unsplash API search failed: ${apiRes.status}`);
          }
        }
      } else {
        // Pollinations API (Latest endpoint)
        const pollinationsKey = process.env.POLLINATIONS_API_KEY;
        const prompt = encodeURIComponent(
          `abstract background: ${query || 'abstract'}, minimalist, no text, digital art`
        );
        bgUrl = `https://gen.pollinations.ai/image/${prompt}?width=1200&height=630&nologo=true&seed=${seed}&model=flux`;
        if (pollinationsKey) {
          headers['Authorization'] = `Bearer ${pollinationsKey}`;
        }
      }

      if (bgUrl) {
        console.log(`[OG-API] Fetching from ${source}: ${bgUrl}`);
        const bgRes = await fetch(bgUrl, { 
          redirect: 'follow',
          headers: headers
        });
        const contentType = bgRes.headers.get('content-type') || '';
        console.log(`[OG-API] Result: status=${bgRes.status}, type=${contentType}`);
        
        if (bgRes.ok && contentType.startsWith('image/')) {
          const buf = await bgRes.arrayBuffer();
          const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpeg' : 'png';
          bgSrc = `data:image/${ext};base64,${Buffer.from(buf).toString('base64')}`;
        } else {
          console.warn(`[OG-API] Image fetch failed or not an image: ${bgRes.status}`);
        }
      }
    } catch {
      // fallback to gradient
    }
  }

  const isMinimal = pattern === 'minimal';
  const isNeon = pattern === 'neon';
  const isGlass = pattern === 'glass';
  const isFull = pattern === 'full';
  const isColumns = pattern === 'columns';

  // Layout: full width for most patterns, constrained for glass
  const contentWidth = isGlass ? 900 : isColumns ? 720 : 1100;
  const textAreaWidth = contentWidth - 100;

  // Auto font sizes
  const titleFontSize = calcTitleFontSize(title, textAreaWidth);
  const typeFontSize = calcTypeFontSize(type);
  const infoFontSize = calcInfoFontSize(info);

  const overlayBg = bgSrc
    ? (isDark
        ? 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.75))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.8))')
    : 'transparent';

  // === COLUMNS layout: left text + right accent panel ===
  if (isColumns) {
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', display: 'flex', background: theme.bg, position: 'relative', fontFamily: fontFamily }}>
          {bgSrc && <img src={bgSrc} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />}
          {bgSrc && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: overlayBg }} />}
          {/* Left: Text content */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 720, padding: '60px 70px', position: 'relative' }}>
            {type && <div style={{ fontSize: typeFontSize, fontWeight: 700, color: theme.badgeText, marginBottom: 20, display: 'flex', alignItems: 'center', padding: '8px 24px', borderRadius: 8, backgroundColor: theme.badgeBg, letterSpacing: 2 }}>{type}</div>}
            <div style={{ fontSize: titleFontSize, fontWeight: 900, color: theme.textPrimary, lineHeight: 1.3, marginBottom: 24, display: 'flex', flexWrap: 'wrap', textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : 'none', maxWidth: 580 }}>{title}</div>
            {info && <div style={{ fontSize: infoFontSize, fontWeight: 500, color: theme.textSecondary, display: 'flex' }}>{info}</div>}
          </div>
          {/* Right: Accent panel */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 4, height: '60%', background: `linear-gradient(180deg, transparent, ${theme.accent}, transparent)`, position: 'absolute', left: 0, display: 'flex' }} />
            <div style={{ width: 200, height: 200, borderRadius: 9999, background: `radial-gradient(circle, ${theme.accent}33, transparent 70%)`, display: 'flex' }} />
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts: [{ name: fontFamily, data: fontData, style: 'normal' as const, weight: 400 }] },
    );
  }

  // === FULL layout: bottom-bar text with heavy gradient overlay ===
  if (isFull) {
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, position: 'relative', fontFamily: fontFamily }}>
          {bgSrc && <img src={bgSrc} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />}
          {/* Top gradient fade */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: isDark ? 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.85) 100%)' : 'linear-gradient(180deg, transparent 20%, rgba(255,255,255,0.9) 100%)', display: 'flex' }} />
          {/* Decorative orbs */}
          {!bgSrc && isDark && <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: 9999, background: `radial-gradient(circle, ${theme.accent}22, transparent 70%)`, display: 'flex' }} />}
          {/* Bottom content bar */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '50px 80px', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {type && <div style={{ fontSize: typeFontSize - 4, fontWeight: 700, color: theme.badgeText, padding: '6px 20px', borderRadius: 6, backgroundColor: theme.badgeBg, letterSpacing: 2, display: 'flex' }}>{type}</div>}
              {info && <div style={{ fontSize: infoFontSize - 4, fontWeight: 500, color: theme.textSecondary, display: 'flex' }}>{info}</div>}
            </div>
            <div style={{ fontSize: titleFontSize, fontWeight: 900, color: theme.textPrimary, lineHeight: 1.25, display: 'flex', flexWrap: 'wrap', textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none', maxWidth: 1040 }}>{title}</div>
          </div>
          {/* Bottom accent line */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}44, transparent)`, display: 'flex' }} />
        </div>
      ),
      { width: 1200, height: 630, fonts: [{ name: fontFamily, data: fontData, style: 'normal' as const, weight: 400 }] },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.bg,
          position: 'relative',
          fontFamily: fontFamily,
        }}
      >
        {/* Background Image */}
        {bgSrc && (
          <img
            src={bgSrc}
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: 'cover',
            }}
          />
        )}

        {/* Overlay for readability */}
        {bgSrc && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: overlayBg,
            }}
          />
        )}

        {/* Decorative glow orbs (gradient mode + dark) */}
        {!bgSrc && isDark && (
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${theme.accent}22, transparent 70%)`,
            display: 'flex',
          }} />
        )}
        {!bgSrc && isDark && (
          <div style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${theme.accent}18, transparent 70%)`,
            display: 'flex',
          }} />
        )}

        {/* Content Area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMinimal ? 'flex-start' : 'center',
            justifyContent: 'center',
            width: contentWidth,
            height: isGlass ? 500 : 550,
            backgroundColor: isGlass ? theme.glassBg : 'transparent',
            borderRadius: isGlass ? 32 : 0,
            padding: isGlass ? '40px 60px' : '60px 50px',
            textAlign: isMinimal ? 'left' : 'center',
            border: isGlass ? `1px solid ${theme.glassBorder}` : 'none',
          }}
        >
          {/* Type Label */}
          {type && (
            <div
              style={{
                fontSize: typeFontSize,
                fontWeight: 700,
                color: isNeon ? theme.neonAccent : theme.badgeText,
                marginBottom: 24,
                letterSpacing: isMinimal ? 1 : 3,
                display: 'flex',
                alignItems: 'center',
                padding: isMinimal ? '0' : '10px 28px',
                borderRadius: 10,
                backgroundColor: isMinimal ? 'transparent' : theme.badgeBg,
                textShadow: isNeon ? `${theme.neonGlow}` : 'none',
              }}
            >
              {type}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 900,
              color: theme.textPrimary,
              lineHeight: 1.3,
              marginBottom: 28,
              display: 'flex',
              flexWrap: 'wrap',
              textShadow: isNeon
                ? theme.neonGlow
                : isDark
                  ? '0 3px 10px rgba(0,0,0,0.4)'
                  : 'none',
              maxWidth: textAreaWidth,
            }}
          >
            {title}
          </div>

          {/* Info */}
          {info && (
            <div
              style={{
                fontSize: infoFontSize,
                fontWeight: 500,
                color: theme.textSecondary,
                display: 'flex',
                alignItems: 'center',
                borderLeft: isMinimal ? `4px solid ${theme.accent}` : 'none',
                paddingLeft: isMinimal ? 16 : 0,
              }}
            >
              {info}
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        {!isGlass && !isNeon && !bgSrc && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 4,
            background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
            display: 'flex',
          }} />
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: fontFamily,
          data: fontData,
          style: 'normal' as const,
          weight: 400,
        },
      ],
    },
  );
}
