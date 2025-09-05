## @your-scope/weather-api

Lightweight, provider-agnostic weather fetching library. It normalizes provider responses into a consistent shape for easy consumption across apps and UI components.

### Features
- Normalized forecast types (`WeatherForecast`, `WeatherDay`)
- Built-in Open‑Meteo provider
- Pluggable provider registry (add your own providers)
- Works in Node and the browser

### Installation
```bash
npm install @your-scope/weather-api
# or
yarn add @your-scope/weather-api
```

### API docs
Generate static API docs from TypeScript types with:
```bash
npm run docs
```
Docs will be output to `packages/weather-api/docs`.

### Quick start
Fetch a normalized forecast using the default provider (Open‑Meteo):
```ts
import { fetchWeather } from '@your-scope/weather-api';

const forecast = await fetchWeather({ lat: 51.5072, lon: -0.1276, days: 3 });
console.log(forecast.days[0].tempMaxC);
```

### Examples
Run a Node example that prints a forecast to stdout:
```bash
npm run examples
```
Example source: `packages/weather-api/examples/node/fetch.ts`.

Choose a specific provider by id:
```ts
import { fetchWeather } from '@your-scope/weather-api';

const forecast = await fetchWeather({ lat: 40.7128, lon: -74.006, days: 5 }, 'open-meteo');
```

### Types
```ts
export type Units = 'metric' | 'imperial';

export interface WeatherForecastRequest {
  lat: number;
  lon: number;
  days?: number; // default 3
}

export interface WeatherDay {
  date: string;       // ISO YYYY-MM-DD (provider timezone)
  tempMaxC: number;   // Celsius (normalized)
  tempMinC: number;   // Celsius (normalized)
  windMaxMS?: number; // meters/second (normalized)
  windDirDeg?: number; // 0-360
  precipProb?: number; // 0-100
  weatherCode?: number; // provider-specific code
}

export interface WeatherForecast {
  source: string; // provider id
  fetchedAt: string; // ISO timestamp
  location: { lat: number; lon: number; timezone?: string };
  days: WeatherDay[];
}

export interface WeatherProvider {
  id: string;
  label: string;
  fetchForecast(req: WeatherForecastRequest): Promise<WeatherForecast>;
}

// Unit helpers
export const cToF = (c: number) => (c * 9) / 5 + 32;
export const msToMph = (ms: number) => ms * 2.236936;
export const msToKmh = (ms: number) => ms * 3.6;
```

### Provider registry
Use the built-in provider(s), or register your own at runtime.

```ts
import { registerProvider, getWeatherProvider, fetchWeather, type WeatherProvider } from '@your-scope/weather-api';

const myProvider: WeatherProvider = {
  id: 'my-provider',
  label: 'My Provider',
  async fetchForecast(req) {
    // 1) call your external API
    // 2) normalize to WeatherForecast
    return {
      source: 'my-provider',
      fetchedAt: new Date().toISOString(),
      location: { lat: req.lat, lon: req.lon, timezone: 'UTC' },
      days: [
        {
          date: new Date().toISOString().slice(0, 10),
          tempMaxC: 20,
          tempMinC: 10,
          windMaxMS: 6.5,
          windDirDeg: 180,
          precipProb: 30,
          weatherCode: 2,
        },
      ],
    };
  },
};

registerProvider(myProvider);

// use it by id
const forecast = await fetchWeather({ lat: 48.8566, lon: 2.3522, days: 3 }, 'my-provider');
```

### Node/SSR usage (Next.js example)
You can expose a simple HTTP endpoint that proxies the provider and centralizes caching.

```ts
// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchWeather } from '@your-scope/weather-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
```

### Browser usage
You can call `fetchWeather` directly in the browser, but most apps proxy through an API route to:
- centralize provider credentials (if needed)
- add caching headers
- avoid CORS issues

### Response example
```json
{
  "source": "open-meteo",
  "fetchedAt": "2025-01-01T12:00:00.000Z",
  "location": { "lat": 51.5072, "lon": -0.1276, "timezone": "Europe/London" },
  "days": [
    {
      "date": "2025-01-01",
      "tempMaxC": 8,
      "tempMinC": 2,
      "windMaxMS": 5.1,
      "windDirDeg": 200,
      "precipProb": 20,
      "weatherCode": 2
    }
  ]
}
```

### Error handling
- Unknown provider id → error thrown by `getWeatherProvider`
- Network/HTTP errors → throw with provider status/message
- Validate inputs (`lat`, `lon`, `days`) before calling

### Normalization notes
- Temperatures are in Celsius; use helpers to convert to °F
- Wind speeds are in m/s; use helpers to convert to mph/km/h
- `weatherCode` is provider-specific and may need mapping to icons/messages

### License
MIT

