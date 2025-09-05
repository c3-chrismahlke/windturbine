import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchMapboxPlace(lat: number, lon: number, opts?: {
  language?: string;
  country?: string; // ISO2, comma‑separated
  types?: string;   // comma‑separated mapbox place types
  proximity?: string; // "lon,lat"
}) {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) throw new Error('MAPBOX_ACCESS_TOKEN is not configured');
  const lngLat = `${encodeURIComponent(lon)},${encodeURIComponent(lat)}`;
  const url = new URL('https://api.mapbox.com/search/geocode/v6/reverse');
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('limit', '1');
  if (opts?.language) url.searchParams.set('language', opts.language);
  if (opts?.country) url.searchParams.set('country', opts.country);
  if (opts?.types) url.searchParams.set('types', opts.types);
  if (opts?.proximity) url.searchParams.set('proximity', opts.proximity);
  url.searchParams.set('access_token', token);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`mapbox revgeo ${res.status}`);
  const json = await res.json();
  const features = Array.isArray(json?.features) ? json.features : [];
  if (!features.length) return undefined;
  const f = features[0];
  // Mapbox v6: prefer place_formatted, otherwise build from name + context
  const props = (f?.properties ?? {}) as Record<string, any>;
  const ctx = (props.context ?? {}) as Record<string, any>;
  const name: string | undefined = props.place_formatted || props.name || f?.text;
  const placeName = ctx.place?.name || ctx.locality?.name || undefined;
  const regionName = ctx.region?.name || undefined;
  const countryName = ctx.country?.name || ctx.country || undefined;
  const label = [name, placeName, regionName, countryName].filter(Boolean).join(', ');
  return label || undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: 'lat and lon required' });
  }
  try {
    // Optional tuning
    const language = typeof req.query.language === 'string'
      ? req.query.language
      : (req.headers['accept-language']?.split(',')[0] || 'en');
    const country = typeof req.query.country === 'string' ? req.query.country : undefined; // e.g., "US,CA"
    const types = typeof req.query.types === 'string' ? req.query.types : undefined; // no default to allow global coverage
    // no default proximity to avoid biasing results — client can supply if desired
    const token = process.env.MAPBOX_ACCESS_TOKEN;
    if (!token) throw new Error('MAPBOX_ACCESS_TOKEN is not configured');

    // Build upstream URL
    const upstream = new URL('https://api.mapbox.com/search/geocode/v6/reverse');
    upstream.searchParams.set('longitude', String(lon));
    upstream.searchParams.set('latitude', String(lat));
    upstream.searchParams.set('limit', '1');
    if (language) upstream.searchParams.set('language', language);
    if (country) upstream.searchParams.set('country', country);
    if (types) upstream.searchParams.set('types', types);
    if (typeof req.query.proximity === 'string') upstream.searchParams.set('proximity', req.query.proximity);
    upstream.searchParams.set('access_token', token);

    const uRes = await fetch(upstream, { headers: { Accept: 'application/json' } });
    if (!uRes.ok) throw new Error(`mapbox revgeo ${uRes.status}`);
    const raw = await uRes.json();
    const feats = Array.isArray(raw?.features) ? raw.features : [];
    const first = feats[0] ?? null;
    const props = (first?.properties ?? {}) as Record<string, any>;
    const ctx = (props.context ?? {}) as Record<string, any>;
    const name: string | undefined = props.place_formatted || props.name || first?.text;
    const placeName = ctx.place?.name || ctx.locality?.name || undefined;
    const regionName = ctx.region?.name || undefined;
    const countryName = ctx.country?.name || ctx.country || undefined;
    const place = [name, placeName, regionName, countryName].filter(Boolean).join(', ') || undefined;

    // Cache for 5 minutes at the edge/CDN
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    // Raw pass-through if requested
    if (req.query.raw === '1' || req.query.raw === 'true') {
      return res.status(200).json(raw);
    }
    // Convenience wrapper: keep existing 'place' while exposing Mapbox structure
    return res.status(200).json({ place, feature: first, features: feats, attribution: raw?.attribution });
  } catch (e) {
    return res.status(200).json({ place: undefined });
  }
}


