import type {
    WeatherForecastRequest,
    WeatherForecast,
    WeatherProvider,
  } from './types';
  import { fetchOpenMeteo } from './providers/openMeteo';
  
  const registry: Record<string, WeatherProvider> = {
    'open-meteo': {
      id: 'open-meteo',
      label: 'Open‑Meteo',
      fetchForecast: fetchOpenMeteo,
    },
    // add more providers here later
  };
  
  export function getWeatherProvider(id = 'open-meteo'): WeatherProvider {
    const p = registry[id];
    if (!p) throw new Error(`Unknown weather provider: ${id}`);
    return p;
  }
  
  export async function fetchWeather(
    req: WeatherForecastRequest,
    providerId = 'open-meteo'
  ): Promise<WeatherForecast> {
    return getWeatherProvider(providerId).fetchForecast(req);
  }
  
  export function registerProvider(provider: WeatherProvider) {
    registry[provider.id] = provider;
  }
  
  export * from './types';