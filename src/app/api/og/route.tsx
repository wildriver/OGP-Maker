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

// Color themes: [bg gradient, accent, text primary, text secondary, type badge bg]
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
    badgeBg: 'rgba(255,255,255,0.1)',
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
    badgeBg: 'rgba(37,99,235,0.1)',
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
    badgeBg: 'rgba(5,150,105,0.1)',
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
    badgeBg: 'rgba(194,65,12,0.1)',
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
    badgeBg: 'rgba(124,58,237,0.1)',
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

  // Background: try external image if requested, fallback to gradient
  let bgSrc = '';
  if (source === 'pollinations' || source === 'unsplash') {
    try {
      let bgUrl = '';
      if (source === 'unsplash') {
        bgUrl = `https://source.unsplash.com/1200x630/?${encodeURIComponent(query || title)}`;
      } else {
        const prompt = encodeURIComponent(
          `abstract background: ${query || title}, minimalist, no text, digital art`
        );
        bgUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true&seed=${seed}`;
      }
      const bgRes = await fetch(bgUrl, { redirect: 'follow' });
      const contentType = bgRes.headers.get('content-type') || '';
      if (bgRes.ok && contentType.startsWith('image/')) {
        const buf = await bgRes.arrayBuffer();
        const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpeg' : 'png';
        bgSrc = `data:image/${ext};base64,${Buffer.from(buf).toString('base64')}`;
      }
    } catch {
      // fallback to gradient
    }
  }

  const isMinimal = pattern === 'minimal';
  const isNeon = pattern === 'neon';
  const isGlass = pattern === 'glass';

  // Dynamic font sizes: use full width (1200px) minus padding
  let titleFontSize = 72;
  if (title.length > 15) titleFontSize = 64;
  if (title.length > 25) titleFontSize = 52;
  if (title.length > 40) titleFontSize = 44;
  if (title.length > 60) titleFontSize = 36;
  if (title.length > 80) titleFontSize = 30;

  // Glass pattern: a card in the center
  // Other patterns: full-width layout
  const useFullWidth = !isGlass;
  const contentWidth = useFullWidth ? 1100 : 900;
  const contentPadding = useFullWidth ? '60px 50px' : '40px 60px';

  // Accent colors for the overlay when image bg is present
  const overlayBg = bgSrc
    ? (isDark
        ? 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.75))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.8))')
    : 'transparent';

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
        {/* Background Image (if available) */}
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

        {/* Overlay for readability on image bg */}
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

        {/* Decorative Elements for gradient mode */}
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
            padding: contentPadding,
            textAlign: isMinimal ? 'left' : 'center',
            border: isGlass ? `1px solid ${theme.glassBorder}` : 'none',
          }}
        >
          {/* Type Label */}
          {type && (
            <div
              style={{
                fontSize: isMinimal ? 22 : 24,
                fontWeight: 700,
                color: isNeon ? theme.neonAccent : theme.badgeText,
                marginBottom: 24,
                letterSpacing: isMinimal ? 1 : 3,
                display: 'flex',
                alignItems: 'center',
                padding: isMinimal ? '0' : '8px 24px',
                borderRadius: 8,
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
              lineHeight: 1.25,
              marginBottom: 28,
              display: 'flex',
              flexWrap: 'wrap',
              textShadow: isNeon
                ? theme.neonGlow
                : isDark
                  ? '0 3px 10px rgba(0,0,0,0.4)'
                  : 'none',
              maxWidth: contentWidth - 100,
            }}
          >
            {title}
          </div>

          {/* Info */}
          {info && (
            <div
              style={{
                fontSize: 24,
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

        {/* Bottom accent line for classic/minimal */}
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
