import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source') || 'pollinations';
  const query = searchParams.get('query') || 'abstract';
  const seed = searchParams.get('seed') || '42';

  let bgUrl = '';

  console.log(`[API-BG] source=${source}, query=${query}, seed=${seed}`);

  try {
    if (source === 'unsplash') {
      const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
      if (unsplashKey) {
        const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query || 'abstract')}&orientation=landscape&per_page=30&client_id=${unsplashKey}`;
        const res = await fetch(searchUrl, {
          headers: { 'Accept-Version': 'v1' }
        });
        if (res.ok) {
          const data = await res.json();
          const results = data.results || [];
          if (results.length > 0) {
            const idx = Math.abs(parseInt(seed) || 0) % results.length;
            bgUrl = results[idx].urls?.regular || '';
          }
        } else {
          console.error(`[API-BG] Unsplash failed: ${res.status}`);
        }
      }
    } else if (source === 'pollinations') {
      const prompt = encodeURIComponent(`abstract background: ${query || 'abstract'}, minimalist, no text, digital art`);
      bgUrl = `https://gen.pollinations.ai/image/${prompt}?width=1200&height=630&nologo=true&seed=${seed}&model=flux`;
    }

    console.log(`[API-BG] Final URL: ${bgUrl}`);
    return NextResponse.json({ url: bgUrl });
  } catch (err) {
    console.error(`[API-BG] Error:`, err);
    return NextResponse.json({ error: 'Failed to fetch background URL' }, { status: 500 });
  }
}
