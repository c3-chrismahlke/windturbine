import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchWeather } from '@your-scope/weather-api';

function cors(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const days = req.query.days ? Math.min(7, Math.max(1, Number(req.query.days))) : 3;
  const provider = typeof req.query.provider === 'string' ? req.query.provider : 'open-meteo';

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: 'lat and lon query params are required numbers' });
  }

  try {
    const data = await fetchWeather({ lat, lon, days }, provider);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}


