import type {
    WeatherForecastRequest,
    WeatherForecast,
    WeatherDay,
  } from '../types';
  
  type OMResponse = {
    timezone?: string;
    daily?: {
      time: string[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      windspeed_10m_max?: number[];
      winddirection_10m_dominant?: number[]; // ← NEW
      precipitation_probability_mean?: (number | null)[];
      weathercode?: number[];
    };
  };
  
  const BASE = 'https://api.open-meteo.com/v1/forecast';
  
  export async function fetchOpenMeteo(
    req: WeatherForecastRequest
  ): Promise<WeatherForecast> {
    const { lat, lon, days = 3 } = req;
  
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      timezone: 'auto',
      forecast_days: String(days),
      temperature_unit: 'celsius',
      windspeed_unit: 'ms',
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'windspeed_10m_max',
        'winddirection_10m_dominant', // ← NEW
        'precipitation_probability_mean',
        'weathercode',
      ].join(','),
    });
  
    const url = `${BASE}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as OMResponse;
    const d = data.daily;
  
    const safeArr = <T>(arr: T[] | undefined, len: number, fallback: T) =>
      Array.from({ length: len }, (_, i) => arr?.[i] ?? fallback);
  
    const len = d?.time?.length ?? days;
    const time = safeArr(d?.time, len, new Date().toISOString().slice(0, 10));
    const tMax = safeArr(d?.temperature_2m_max, len, NaN);
    const tMin = safeArr(d?.temperature_2m_min, len, NaN);
    const wMax = safeArr(d?.windspeed_10m_max, len, NaN);
    const pProb = safeArr(d?.precipitation_probability_mean, len, null);
    const wCode = safeArr(d?.weathercode, len, undefined as unknown as number);
  
    const wDir = safeArr(
      d?.winddirection_10m_dominant,
      len,
      undefined as unknown as number
    );
  
    const daysOut: WeatherDay[] = time.map((date, i) => ({
      date,
      tempMaxC: tMax[i],
      tempMinC: tMin[i],
      windMaxMS: Number.isFinite(wMax[i] as number)
        ? (wMax[i] as number)
        : undefined,
      windDirDeg: Number.isFinite(wDir[i] as number)
        ? (wDir[i] as number)
        : undefined, // ← NEW
      precipProb: pProb[i] == null ? undefined : (pProb[i] as number),
      weatherCode: wCode[i],
    }));
  
    return {
      source: 'open-meteo',
      fetchedAt: new Date().toISOString(),
      location: { lat, lon, timezone: data.timezone },
      days: daysOut,
    };
  }