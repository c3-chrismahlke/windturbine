import { fetchWeather } from '@your-scope/weather-api';

async function main() {
  const lat = 51.5072;
  const lon = -0.1276;
  const days = 3;

  const forecast = await fetchWeather({ lat, lon, days });
  console.log(JSON.stringify(forecast, null, 2));
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});