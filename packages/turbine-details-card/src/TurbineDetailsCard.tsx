import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Tooltip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FactoryIcon from '@mui/icons-material/Factory';
import PlaceIcon from '@mui/icons-material/Place';
import TimelineIcon from '@mui/icons-material/Timeline';
import PublicIcon from '@mui/icons-material/Public';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTranslation } from 'react-i18next';

export interface Manufacturer {
  name: string;
  country: string;
}

export interface WindTurbine {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  manufacturer: Manufacturer;
  builtDate: string;
  installationDate: string;
  active: boolean;
  ratedCapacityKW: number;
  createdAt: string;
  updatedAt: string;
}

export interface TurbineDetailsCardProps {
  selectedId?: string | null;
  height?: number | string;
  turbine?: WindTurbine | null;
  loading?: boolean;
  powerData?: number[];
  onCopyId?: (id: string) => void;
  t?: (key: string) => string;
  children?: React.ReactNode; // For work orders or other content
}

/**
 * TurbineDetailsCard — Beautiful, principle‑driven UI/UX
 * Design notes (inspired by *Universal Principles of Design*):
 * • Hierarchy & Contrast: big numeric, quiet meta; accent chips for status & deltas.
 * • Proximity & Chunking: information grouped into Live, Identity, Specs, Dates, System.
 * • Consistency & Alignment: repeated label→value pattern; iconography aids scannability.
 * • Feedback: live sparkline, utilization hint, copy‑to‑clipboard toast, save/cancel affordances.
 * • Progressive disclosure: edit mode reveals inline fields with subtle focus rings and rules.
 */
export default function TurbineDetailsCard({
  selectedId,
  height = '100%',
  turbine,
  loading = false,
  powerData = [],
  onCopyId,
  t: tProp,
  children,
}: TurbineDetailsCardProps) {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { t: tHook } = useTranslation('common');
  const t = tProp || tHook;
  const theme = useTheme();

  // Number formatters - these are hooks and must be called consistently
  const nf0 = React.useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }),
    [],
  );
  const nf1 = React.useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }),
    [],
  );
  const nf2 = React.useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
    [],
  );

  // Callback hook - must be called consistently
  const handleCopyId = React.useCallback(async () => {
    if (turbine?.id) {
      if (onCopyId) {
        onCopyId(turbine.id);
      } else {
        try {
          await navigator.clipboard.writeText(turbine.id);
        } catch {
          // Ignore clipboard errors
        }
      }
    }
  }, [turbine?.id, onCopyId]);

  // ---------- Derived UI metrics (view-only) ----------
  const last = powerData.length ? powerData[powerData.length - 1] : undefined;
  const prev = powerData.length > 1 ? powerData[powerData.length - 2] : undefined;
  const delta = last != null && prev != null ? last - prev : undefined;
  const capacityKW = turbine?.ratedCapacityKW ?? 0;
  const utilizationPct =
    last != null && capacityKW > 0 ? Math.max(0, Math.min(100, (last / capacityKW) * 100)) : 0;
  const accent =
    delta == null ? theme.palette.text.secondary : delta >= 0 ? theme.palette.success.main : theme.palette.error.main;

  const displayData = powerData.length ? powerData : [0];
  // Mini bar chart metrics
  const maxForBars = Math.max(1, ...displayData.map((v) => (typeof v === 'number' ? v : 0)));
  const barWidthPx = 4;
  const barGapPx = 1;

  // ---------- Early returns AFTER all hooks ----------
  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{
          height,
          borderRadius: 0,
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CardHeader
          title={<Skeleton variant="text" width={160} height={20} />}
          subheader={<Skeleton variant="text" width={220} height={16} />}
          sx={{ py: 1, px: 2 }}
        />
        <CardContent sx={{ pt: 0.5, pb: 1.25, px: 2, display: 'flex', flexDirection: 'column', gap: 1.25, minHeight: 0, minWidth: 0, overflowX: 'hidden' }}>
          <Box sx={{ borderRadius: 0.5, px: 1.25, py: 1, border: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Skeleton variant="text" width={100} height={16} />
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 10 }} />
                <Skeleton variant="rectangular" width={120} height={20} sx={{ borderRadius: 10 }} />
              </Stack>
            </Stack>
            <Box sx={{ mt: 1, width: '100%', height: 70, overflow: 'hidden' }}>
              <Skeleton variant="rectangular" width="100%" height={70} />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 0.75 }} alignItems="center" flexWrap="wrap">
              <Skeleton variant="text" width={100} height={14} />
              <Skeleton variant="text" width={100} height={14} />
              <Skeleton variant="rectangular" width={140} height={20} sx={{ borderRadius: 10 }} />
            </Stack>
          </Box>
          
          

          <Box sx={{ mt: 0.25 }}>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
              <BuildCircleIcon fontSize="small" color="primary" />
              <Typography variant="overline" sx={{ letterSpacing: 0.6, fontWeight: 600 }}>
                {t('turbine.system.title')}
              </Typography>
            </Stack>
          </Box>
      
          {children && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ mt: 0.25, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                {children}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
  
  if (!turbine) {
    return (
      <Card
        variant="outlined"
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 0,
        }}
      >
        <CardHeader
          title={
            <Typography variant="subtitle2" fontWeight={700}>
              {t('turbine.details.title')}
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {t('turbine.details.selectPrompt')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const active = turbine?.active as unknown as boolean;

  return (
    <Card
      variant="outlined"
      sx={{
        height,
        borderRadius: 0,
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      aria-labelledby="turbine-title"
    >
      {/* HEADER */}
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography id="turbine-title" variant="subtitle1" fontWeight={800} lineHeight={1.2}>
              {turbine?.name}
            </Typography>
            <Tooltip title={t('turbine.copyId')} enterDelay={600}>
              <IconButton
                size="small"
                onClick={handleCopyId}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Chip
              size="small"
              label={active ? t('turbine.status.active') : t('turbine.status.inactive')}
              color={active ? 'success' : 'default'}
              variant="outlined"
              sx={{ ml: 0.5, fontWeight: 600 }}
            />
          </Stack>
        }
        subheader={
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Meta icon={<FactoryIcon fontSize="small" />} text={turbine?.manufacturer?.name ?? t('turbine.manufacturer.unknown')} />
            <Meta icon={<PlaceIcon fontSize="small" />} text={turbine?.manufacturer?.country ?? '—'} />
          </Stack>
        }
        action={undefined}
        sx={{
          py: 1,
          px: 2,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
      />

      <CardContent
        sx={{
          pt: 0.5,
          pb: 1.25,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          minHeight: 0,
          minWidth: 0,
          overflowX: 'hidden',
          flex: 1,
        }}
      >

        {/* LIVE — Contrast & Feedback */}
        <Box
          sx={{
            borderRadius: 0.5,
            px: 1.25,
            py: 1,
            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <BoltIcon fontSize="small" color="primary" />
              <Typography variant="body2" color="text.secondary">
                {t('turbine.liveOutput')}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.25} alignItems="baseline" flexWrap="wrap">
              <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1, letterSpacing: '-0.02em' }}>
                {last != null ? nf2.format(last / 1000) : '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                MW
              </Typography>

              <Tooltip
                placement="top"
                title={delta == null ? t('turbine.noChange') : `${delta >= 0 ? '+' : ''}${nf2.format(delta)} kW ${t('turbine.sinceLast')}`}
              >
                <Chip
                  size="small"
                  icon={delta == null ? <TimelineIcon /> : delta >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={delta == null ? '—' : `${delta >= 0 ? '+' : ''}${nf1.format(delta)} kW`}
                  sx={{
                    ml: 0.5,
                    fontWeight: 600,
                    color: accent,
                    borderColor: alpha(accent, 0.4),
                  }}
                  variant="outlined"
                />
              </Tooltip>

            </Stack>
          </Stack>

          {/* Mini bar chart — newest at right; thin bars; no overflow */}
          <Box sx={{ mt: 1, width: '100%', height: 70, overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                gap: `${barGapPx}px`,
                height: '100%',
                minWidth: 0,
              }}
            >
              {displayData.map((v, i) => {
                const value = typeof v === 'number' ? v : 0;
                const prev = i > 0 && typeof displayData[i - 1] === 'number' ? (displayData[i - 1] as number) : undefined;
                const isUp = prev == null ? undefined : value >= prev;
                const color = isUp == null ? theme.palette.text.secondary : isUp ? theme.palette.success.main : theme.palette.error.main;
                const h = Math.max(1, Math.round((value / maxForBars) * 70));
                return (
                  <Box
                    key={`bar-${i}`}
                    sx={{
                      width: `${barWidthPx}px`,
                      height: `${h}px`,
                      bgcolor: color,
                      flex: '0 0 auto',
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 0.75 }} alignItems="center" flexWrap="wrap">
            <Meta
              icon={<AccessTimeIcon fontSize="small" />}
              text={turbine?.updatedAt ? new Date(turbine.updatedAt as unknown as string).toLocaleTimeString() : '—'}
              ariaLabel="Last updated time"
            />
            <Meta icon={<TimelineIcon fontSize="small" />} text={`${displayData.length} ${t('turbine.samples')}`} />
            <Chip
              size="small"
              icon={<PublicIcon />}
              label={`${t('turbine.utilization')} ${nf0.format(utilizationPct)}%`}
              variant="outlined"
            />
            <Info label={t('turbine.ratedCapacity')} value={`${nf0.format(turbine?.ratedCapacityKW ?? 0)} kW`} />
          </Stack>
        </Box>

        {/* SYSTEM */}
        <Section title={t('turbine.system.title')} icon={<CalendarTodayIcon />} iconColor="primary">
          <Stack spacing={0.5} sx={{ width: '100%' }}>
            {[
              turbine.builtDate ? { label: t('turbine.system.built'), date: new Date(turbine.builtDate).toLocaleDateString(), color: 'success.main' } : null,
              turbine.installationDate ? { label: t('turbine.system.installed'), date: new Date(turbine.installationDate).toLocaleDateString(), color: 'info.main' } : null,
              turbine.updatedAt ? { label: t('turbine.system.updated'), date: new Date(turbine.updatedAt).toLocaleDateString(), color: 'secondary.main' } : null,
            ]
              .filter(Boolean)
              .map((ev, idx, arr) => (
                <Box key={`${(ev as any).label}`} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: '0 0 20%', pr: 1, textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">{(ev as any).date}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: (ev as any).color }} />
                      {idx < (arr as any).length - 1 ? (
                        <Box sx={{ width: 1, height: 12, bgcolor: 'divider' }} />
                      ) : null}
                    </Box>
                    <Typography variant="caption">{(ev as any).label}</Typography>
                  </Box>
                </Box>
              ))}
          </Stack>
        </Section>

        {/* Custom content (e.g., work orders) */}
        {children && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ mt: 0.25, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
              {children}
            </Box>
          </>
        )}

      </CardContent>
    </Card>
  );
}

/** Small labeled value with consistent typography */
function Info({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <Box
      sx={{
        minWidth: 180,
        pr: 1,
        py: 0.5,
        borderRadius: 1,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value ?? '—'}
      </Typography>
    </Box>
  );
}

/** Tiny inline meta with icon (low visual weight, high scannability) */
function Meta({
  icon,
  text,
  ariaLabel,
}: {
  icon?: React.ReactNode;
  text: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" aria-label={ariaLabel}>
      {icon ? <Box sx={{ color: 'text.secondary' }}>{icon}</Box> : null}
      <Typography variant="caption" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}

/** Section shell with subtle visual anchor */
function Section({
  title,
  icon,
  children,
  iconColor = 'text.secondary',
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  iconColor?: 'text.secondary' | 'primary';
}) {
  return (
    <Box sx={{ mt: 0.25 }}>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
        {icon ? (
          <Box sx={{ color: iconColor === 'primary' ? 'primary.main' : 'text.secondary' }}>
            {icon}
          </Box>
        ) : null}
        <Typography variant="overline" sx={{ letterSpacing: 0.6, fontWeight: iconColor === 'primary' ? 600 : 400 }}>
          {title}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {children}
      </Stack>
    </Box>
  );
}
