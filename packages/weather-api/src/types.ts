export type Units = 'metric' | 'imperial';

export interface WeatherForecastRequest {
  lat: number;
  lon: number;
  days?: number; // default 3
}

export interface WeatherDay {
  /** ISO date in provider timezone (00:00 local) */
  date: string;
  /** Celsius, normalized */
  tempMaxC: number;
  /** Celsius, normalized */
  tempMinC: number;
  /** m/s, normalized (if available) */
  windMaxMS?: number;
  /** speed, normalized (if available) */
  windDirDeg?: number;
  /** 0-100 (if available) */
  precipProb?: number;
  /** Provider-specific weather code (e.g., Open-Meteo weathercode) */
  weatherCode?: number;
}

export interface WeatherForecast {
  source: string;
  fetchedAt: string; // ISO
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