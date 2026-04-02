import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Verified direct TTF URLs from Google Fonts CDN (fetched via CSS API with browser UA)
const FONT_URLS: Record<string, string> = {
  'noto-sans-jp': 'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf',
  'noto-serif-jp': 'https://fonts.gstatic.com/s/notoserifjp/v33/xn71YHs72GKoTvER4Gn3b5eMRtWGkp6o7MjQ2bzWPebA.ttf',
  'm-plus-rounded': 'https://fonts.gstatic.com/s/mplusrounded1c/v20/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsK.ttf',
  'inter': 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
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
  const source = searchParams.get('source') || 'pollinations';
  const query = searchParams.get('query') || title;
  const fontKey = searchParams.get('font') || 'noto-sans-jp';

  // Load the font
  const fontData = await loadFont(fontKey);
  const fontFamily = 'CustomFont';

  // Background URL
  let bgUrl = '';
  if (source === 'unsplash') {
    bgUrl = `https://images.unsplash.com/featured/?${encodeURIComponent(query)}&w=1200&h=630&fit=crop&sig=${seed}`;
  } else {
    const prompt = encodeURIComponent(
      `high quality abstract background for: ${query}, minimalist, wide aspect ratio, no text, digital art`
    );
    bgUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true&seed=${seed}`;
  }

  // Fetch background image as ArrayBuffer for Satori
  let bgImageData: ArrayBuffer | null = null;
  try {
    const bgRes = await fetch(bgUrl);
    if (bgRes.ok) {
      bgImageData = await bgRes.arrayBuffer();
    }
  } catch {
    // Background fetch failed, will use gradient fallback
  }

  // Convert to base64 if available
  let bgSrc = '';
  if (bgImageData) {
    const base64 = Buffer.from(bgImageData).toString('base64');
    bgSrc = `data:image/png;base64,${base64}`;
  }

  const isMinimal = pattern === 'minimal';
  const isNeon = pattern === 'neon';
  const isGlass = pattern === 'glass';

  // Dynamic font sizes based on title length
  let titleFontSize = 64;
  if (title.length > 30) titleFontSize = 48;
  if (title.length > 50) titleFontSize = 40;
  if (title.length > 80) titleFontSize = 32;
  if (isMinimal) titleFontSize = Math.min(titleFontSize + 8, 72);

  // Overlay gradient
  const overlayBg = isMinimal
    ? 'rgba(0,0,0,0.65)'
    : isNeon
      ? 'rgba(0,0,10,0.75)'
      : 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75))';

  // Glass center box bg
  const glassBg = isGlass ? 'rgba(0, 0, 0, 0.5)' : 'transparent';

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
          backgroundColor: '#111',
          position: 'relative',
          fontFamily: fontFamily,
        }}
      >
        {/* Background Image */}
        {bgSrc ? (
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
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
            }}
          />
        )}

        {/* Overlay */}
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

        {/* Center 630x630 Content Area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMinimal ? 'flex-start' : 'center',
            justifyContent: 'center',
            width: 630,
            height: 550,
            backgroundColor: glassBg,
            borderRadius: isGlass ? 40 : 0,
            padding: '50px 50px',
            textAlign: isMinimal ? 'left' : 'center',
            border: isGlass ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
          }}
        >
          {/* Type Label */}
          {type && (
            <div
              style={{
                fontSize: isMinimal ? 22 : 26,
                fontWeight: 700,
                color: isNeon ? '#ff00ff' : isMinimal ? '#00d2ff' : '#ff3366',
                marginBottom: 20,
                textTransform: 'uppercase',
                letterSpacing: isMinimal ? 1 : 4,
                display: 'flex',
                alignItems: 'center',
                padding: isMinimal ? '0' : '6px 20px',
                borderRadius: 8,
                backgroundColor: isMinimal ? 'transparent' : 'rgba(255,255,255,0.08)',
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
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: 30,
              display: 'flex',
              flexWrap: 'wrap',
              textShadow: isNeon
                ? '0 0 20px #00d2ff, 0 0 40px #00d2ff'
                : '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </div>

          {/* Info */}
          {info && (
            <div
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                borderLeft: isMinimal ? '4px solid #00d2ff' : 'none',
                paddingLeft: isMinimal ? 16 : 0,
              }}
            >
              {info}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: fontFamily,
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
