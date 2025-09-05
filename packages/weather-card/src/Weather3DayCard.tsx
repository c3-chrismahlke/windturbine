import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  Typography,
  Stack,
  Skeleton,
  Grid,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useTranslation } from 'react-i18next';

// Local minimal weather types and helpers to avoid hard dependency on weather-api
export type Units = 'metric' | 'imperial';

export interface WeatherDay {
  /** ISO date in provider timezone (00:00 local) */
  date: string;
  /** Celsius, normalized */
  tempMaxC: number;
  /** Celsius, normalized */
  tempMinC: number;
  /** m/s, normalized (if available) */
  windMaxMS?: number;
  /** direction in degrees (if available) */
  windDirDeg?: number;
  /** 0-100 (if available) */
  precipProb?: number;
  /** Provider-specific weather code */
  weatherCode?: number;
}

export interface WeatherForecast {
  source: string;
  fetchedAt: string; // ISO
  location: { lat: number; lon: number; timezone?: string };
  days: WeatherDay[];
}

// Unit helpers (duplicated locally to keep package independent)
function cToF(c: number) {
  return (c * 9) / 5 + 32;
}
function msToMph(ms: number) {
  return ms * 2.236936;
}
function msToKmh(ms: number) {
  return ms * 3.6;
}

export interface Weather3DayCardProps {
  title?: string;
  forecast?: WeatherForecast;
  lat?: number;
  lon?: number;
  days?: number; // defaults to 3
  units?: Units; // display units; default metric
  apiUrl?: string; // override; defaults to '/api/weather'
  compact?: boolean; // makes layout tighter
  showTimezone?: boolean; // show timezone under the header
}

import defaults from './config/defaults.json';

// Icon mapping is configurable via config.iconForCode(); fallback to simple mapping below if config overridden improperly
function IconFromToken(token: 'sunny' | 'cloud' | 'rain' | 'snow' | 'storm' | 'unknown') {
  switch (token) {
    case 'sunny':
      return <WbSunnyIcon color="warning" fontSize="small" />;
    case 'rain':
      return <UmbrellaIcon color="primary" fontSize="small" />;
    case 'snow':
      return <AcUnitIcon color="info" fontSize="small" />;
    case 'storm':
      return <ThunderstormIcon color="error" fontSize="small" />;
    case 'cloud':
      return <CloudIcon color="disabled" fontSize="small" />;
    default:
      return <CloudIcon color="action" fontSize="small" />;
  }
}
function iconTokenForCode(
  code: number | undefined
): 'sunny' | 'cloud' | 'rain' | 'snow' | 'storm' | 'unknown' {
  if (code == null) return 'unknown';
  if (code === 0) return 'sunny';
  if ([1, 2, 3].includes(code)) return 'cloud';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloud';
}

function formatTemps(
  day: WeatherDay,
  units: Units,
  t: any
) {
  if (units === 'imperial') {
    return {
      max: Math.round(cToF(day.tempMaxC)),
      min: Math.round(cToF(day.tempMinC)),
      symbol: t('weather.units.temperature.imperialSymbol'),
    };
  }
  return {
    max: Math.round(day.tempMaxC),
    min: Math.round(day.tempMinC),
    symbol: t('weather.units.temperature.metricSymbol'),
  };
}

function formatWind(
  ms: number | undefined,
  units: Units,
  t: any
) {
  if (ms == null || !Number.isFinite(ms))
    return { value: t('weather.labels.dash'), unit: units === 'imperial' ? t('weather.units.windSpeed.imperialUnit') : t('weather.units.windSpeed.metricUnit') };
  if (units === 'imperial')
    return { value: Math.round(msToMph(ms)), unit: t('weather.units.windSpeed.imperialUnit') };
  return { value: Math.round(msToKmh(ms)), unit: t('weather.units.windSpeed.metricUnit') };
}

function degToCompass(deg: number | undefined, t: any) {
  if (deg == null || !Number.isFinite(deg)) return t('weather.labels.dash');
  const compassDirs = t('weather.compassDirs', { returnObjects: true }) as string[];
  const i = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return compassDirs[i];
}

function formatDayLabel(dateISO: string, idx: number, t: any, locale?: string) {
  if (idx === 0) return t('weather.labels.today');
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat(locale ?? undefined, { weekday: 'short' }).format(d);
}

function classifyWind(ms: number | undefined, t: any) {
  if (ms == null || !Number.isFinite(ms)) return { label: t('weather.windLabels.unknown'), color: 'disabled' as const };
  const t_thresholds = defaults.thresholds;
  if (ms < t_thresholds.cutInMS) return { label: t('weather.windLabels.belowCutIn'), color: 'error' as const };
  if (ms >= t_thresholds.cutOutMS) return { label: t('weather.windLabels.cutOutRisk'), color: 'error' as const };
  if (ms >= t_thresholds.highWindMinMS && ms < t_thresholds.highWindMaxMS) return { label: t('weather.windLabels.high'), color: 'warning' as const };
  if (ms >= t_thresholds.nearRatedMinMS && ms < t_thresholds.nearRatedMaxMS) return { label: t('weather.windLabels.nearRated'), color: 'success' as const };
  if (ms >= t_thresholds.optimalMinMS && ms < t_thresholds.optimalMaxMS) return { label: t('weather.windLabels.optimal'), color: 'success' as const };
  return { label: t('weather.windLabels.lowModerate'), color: 'info' as const };
}

// Energy index removed per requirements

// wind classification and energy index are provided via config

export const Weather3DayCard: React.FC<Weather3DayCardProps> = ({
  title,
  forecast: forecastProp,
  lat,
  lon,
  days,
  units,
  apiUrl,
  compact,
  showTimezone,
}) => {
  const { t } = useTranslation('common');
  const resolvedTitle = title || t('weather.defaults.title');
  const resolvedDays = days ?? defaults.defaults.days;
  const resolvedUnits = (units ?? defaults.defaults.units) as Units;
  const resolvedApiUrl = apiUrl ?? defaults.defaults.apiUrl;
  const resolvedCompact = compact ?? defaults.defaults.compact;
  const resolvedShowTimezone = showTimezone ?? defaults.defaults.showTimezone;
  const [loading, setLoading] = React.useState(
    !forecastProp && lat != null && lon != null
  );
  const [forecast, setForecast] = React.useState<WeatherForecast | undefined>(
    forecastProp
  );
  const [error, setError] = React.useState<string | undefined>();
  const [place, setPlace] = React.useState<string | undefined>();
  const resolvedLat = lat ?? forecast?.location?.lat;
  const resolvedLon = lon ?? forecast?.location?.lon;

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      if (forecastProp || lat == null || lon == null) return;
      setLoading(true);
      setError(undefined);
      try {
        const origin = typeof window === 'undefined' ? defaults.fetch.ssrBaseOrigin : window.location.origin;
        const urlObj = new URL(resolvedApiUrl, origin);
        urlObj.searchParams.set('lat', String(lat));
        urlObj.searchParams.set('lon', String(lon));
        urlObj.searchParams.set('days', String(resolvedDays));
        const url = urlObj.toString();
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${t('weather.labels.errorPrefix')} ${res.status}`);
        const data = (await res.json()) as WeatherForecast;
        if (!ignore) setForecast(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : t('weather.labels.unknownError'));
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [resolvedApiUrl, resolvedDays, lat, lon, forecastProp, t]);

  // Reverse geocode to a human‑readable place (city/region/country)
  const lastRevGeoKeyRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    async function reverseGeocode() {
      if (resolvedLat == null || resolvedLon == null) { setPlace(undefined); return; }
      const key = `${Number(resolvedLat).toFixed(5)},${Number(resolvedLon).toFixed(5)}`;
      if (lastRevGeoKeyRef.current === key) return; // avoid duplicate fetch for same coords
      lastRevGeoKeyRef.current = key;
      try {
        const origin = typeof window === 'undefined' ? defaults.fetch.ssrBaseOrigin : window.location.origin;
        const urlObj = new URL('/api/revgeo', origin);
        urlObj.searchParams.set('lat', String(resolvedLat));
        urlObj.searchParams.set('lon', String(resolvedLon));
        const res = await fetch(urlObj.toString());
        if (!res.ok) return;
        const data = (await res.json()) as { place?: string; feature?: { properties?: { place_formatted?: string } } } | undefined;
        const formatted = (data as any)?.feature?.properties?.place_formatted as string | undefined;
        const label = formatted ?? data?.place;
        if (!cancelled) setPlace(label);
      } catch {
        if (!cancelled) setPlace(undefined);
      }
    }
    void reverseGeocode();
    return () => { cancelled = true; };
  }, [resolvedLat, resolvedLon]);

  const content = loading ? (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={resolvedCompact ? 1 : 2}
      sx={{ mt: 1 }}
    >
      {[0, 1, 2].map((i) => (
        <Box key={i} sx={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" height={18} />
          <Skeleton variant="rounded" height={resolvedCompact ? 96 : 120} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      ))}
    </Stack>
  ) : error ? (
    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
      {error}
    </Typography>
  ) : !forecast || !forecast.days || forecast.days.length === 0 ? (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      {t('weather.labels.noDataFriendly')}
    </Typography>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: resolvedCompact ? 1.5 : 2.5, mt: 0.5 }}>
      {forecast.days.slice(0, resolvedDays).map((d, idx) => {
        const temp = formatTemps(d, resolvedUnits, t);
        const wind = formatWind(d.windMaxMS, resolvedUnits, t);
        const windClass = classifyWind(d.windMaxMS, t); // drives icon color
        const label = formatDayLabel(d.date, idx, t);

        const dir = degToCompass(d.windDirDeg, t);
        const dirDeg =
          d.windDirDeg != null && Number.isFinite(d.windDirDeg)
            ? Math.round(d.windDirDeg)
            : t('weather.labels.dash');

        // Map to a valid MUI icon color
        const iconColor: 'disabled' | 'error' | 'warning' | 'success' | 'info' = windClass.color;

        return (
          <Card
            key={d.date}
            variant="outlined"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none', boxShadow: 'none' }}
          >
            <CardHeader
              avatar={IconFromToken(iconTokenForCode(d.weatherCode))}
              title={
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {label}
                </Typography>
              }
              subheader={undefined}
              sx={{
                py: resolvedCompact ? 0.5 : 1,
                px: resolvedCompact ? 1 : 2,
                '& .MuiCardHeader-content': { overflow: 'hidden' },
              }}
            />
            <CardContent
              sx={{
                pt: resolvedCompact ? 1 : 1.5,
                pb: resolvedCompact ? 1 : 1.5,
                px: resolvedCompact ? 1 : 2,
                display: 'flex',
                flexDirection: 'column',
                gap: resolvedCompact ? 0.75 : 1,
              }}
            >
              <Box>
                <Typography
                  variant={resolvedCompact ? 'h5' : 'h4'}
                  sx={{ lineHeight: 1 }}
                >
                  {temp.max}
                  {temp.symbol}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('weather.labels.low')} {temp.min}
                  {temp.symbol}
                </Typography>
              </Box>

              <Divider />

              <Stack>
                {/* Wind speed with colored icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AirIcon fontSize="small" color={iconColor} />
                  <Typography variant="body2">
                    {wind.value} {wind.unit}
                  </Typography>
                </Box>

                {/* Wind direction */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <NavigationIcon
                    sx={{
                      transform:
                        d.windDirDeg != null
                          ? `rotate(${d.windDirDeg}deg)`
                          : 'none',
                    }}
                    fontSize="small"
                  />
                  <Typography variant="body2">{dir}</Typography>
                </Box>

                {/* Precip */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WaterDropIcon fontSize="small" />
                    <Typography variant="body2">
                      {t('weather.labels.precip')}:{' '}
                      {typeof d.precipProb === 'number'
                        ? `${d.precipProb}%`
                        : t('weather.labels.dash')}
                    </Typography>
                  </Box>
                </Box>

                {/* Energy Index removed */}
              </Stack>

              {/* Risk chips removed as requested */}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );

  return (
    <Card variant="outlined" sx={{ p: 0, overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
      {resolvedTitle ? (
        <CardHeader
          title={
            <Typography variant="subtitle1" fontWeight={600}>
              {resolvedTitle}
            </Typography>
          }
          sx={{ py: resolvedCompact ? 0.75 : 1, px: resolvedCompact ? 1 : 2, textAlign: 'center' }}
        />
      ) : null}
      <CardContent
        sx={{
          pt: resolvedCompact ? 1 : 1.5,
          pb: resolvedCompact ? 1.25 : 2,
          px: resolvedCompact ? 1 : 2,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Location / timezone header */}
          {(() => {
            const loc = forecast?.location;
            const tz = resolvedShowTimezone ? (loc?.timezone ?? undefined) : undefined;
            const latVal = resolvedLat;
            const lonVal = resolvedLon;
            const labelText = place || (latVal != null && lonVal != null ? `${Number(latVal).toFixed(2)}, ${Number(lonVal).toFixed(2)}` : undefined);
            if (labelText || tz) {
              const label = tz ? `${labelText ?? ''}${labelText ? ' • ' : ''}${tz}` : labelText;
              return (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textAlign: 'center' }}>
                  {label}
                </Typography>
              );
            }
            return null;
          })()}

          {content}

          {loading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)'),
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Weather3DayCard;
