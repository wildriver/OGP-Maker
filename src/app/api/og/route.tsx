import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') || 'Untitled';
  const type = searchParams.get('type') || '';
  const info = searchParams.get('info') || '';
  const pattern = searchParams.get('pattern') || 'classic';
  const seed = searchParams.get('seed') || '42';
  const source = searchParams.get('source') || 'pollinations';
  const query = searchParams.get('query') || title;

  // Background URL selection
  let bgUrl = '';
  if (source === 'unsplash') {
    // We use Unsplash Source-like URL for random keyword images
    bgUrl = `https://images.unsplash.com/featured/1200x630/?${encodeURIComponent(query)}&sig=${seed}`;
  } else {
    // Pollinations AI
    const prompt = encodeURIComponent(`high quality background for article: ${query || title}, minimalist, abstract, high resolution, digital art`);
    bgUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true&seed=${seed}`;
  }

  const isMinimal = pattern === 'minimal';
  const isNeon = pattern === 'neon';
  const isGlass = pattern === 'glass';

  const containerStyle: any = {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Inter", sans-serif',
  };

  const centerBoxStyle: any = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMinimal ? 'flex-start' : 'center',
    justifyContent: 'center',
    width: 630,
    height: 630,
    backgroundColor: isGlass ? 'rgba(0, 0, 0, 0.45)' : 'transparent',
    borderRadius: isGlass ? 48 : 0,
    backdropFilter: isGlass ? 'blur(16px)' : 'none',
    padding: 60,
    textAlign: isMinimal ? 'left' : 'center',
    boxSizing: 'border-box',
    border: isGlass ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
    boxShadow: isGlass ? '0 20px 50px rgba(0,0,0,0.3)' : 'none',
  };

  const typeStyle: any = {
    fontSize: isMinimal ? 24 : 28,
    fontWeight: 800,
    color: isNeon ? '#ff00ff' : (isMinimal ? '#00d2ff' : '#ff3366'),
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: isMinimal ? 1 : 4,
    background: isMinimal ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
    padding: isMinimal ? '0' : '6px 16px',
    borderRadius: 8,
    textShadow: isNeon ? '0 0 10px #ff00ff' : 'none',
  };

  const titleStyle: any = {
    fontSize: isMinimal ? 72 : 64,
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: isMinimal ? 20 : 40,
    textShadow: isNeon ? '0 0 20px #00d2ff, 0 0 40px #00d2ff' : '0 4px 15px rgba(0,0,0,0.6)',
    fontFamily: '"Inter", sans-serif',
  };

  const infoStyle: any = {
    fontSize: 30,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: isMinimal ? 0 : 'auto',
    borderLeft: isMinimal ? '4px solid #00d2ff' : 'none',
    paddingLeft: isMinimal ? 20 : 0,
  };

  return new ImageResponse(
    (
      <div style={containerStyle}>
        {/* Background Image */}
        <img
          src={bgUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: 'cover',
          }}
        />
        
        {/* Semi-transparent overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: isMinimal ? 'rgba(0,0,0,0.6)' : 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
          }}
        />

        {/* Center 630x630 Area (Visible via container alignment) */}
        <div style={centerBoxStyle}>
          {type && <div style={typeStyle}>{type}</div>}
          <div style={titleStyle}>{title}</div>
          {info && <div style={infoStyle}>{info}</div>}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
