import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  PowerSettingsNewRounded, 
  TrendingUpRounded,
  RefreshRounded,
  InfoOutlined 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface TurbineStatusCardProps {
  /** Number of active turbines */
  activeTurbines: number;
  /** Total number of turbines */
  totalTurbines: number;
  /** Optional custom uptime percentage, calculated from active/total if not provided */
  uptimePercentage?: number;
  /** Optional loading state */
  loading?: boolean;
  /** Optional error state */
  error?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Custom sx prop for styling */
  sx?: any;
}

/**
 * TurbineStatusCard - A clean, compact card component displaying turbine status metrics
 */
export default function TurbineStatusCard({
  activeTurbines,
  totalTurbines,
  uptimePercentage,
  loading = false,
  error = false,
  className,
  sx,
}: TurbineStatusCardProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');
  
  // Calculate uptime percentage if not provided
  const calculatedUptime = uptimePercentage ?? (totalTurbines > 0 ? (activeTurbines / totalTurbines) * 100 : 0);

  if (loading) {
    return (
      <Card 
        className={className}
        sx={{ 
          borderRadius: 0.5,
          border: `1px solid ${theme.palette.divider}`,
          ...sx,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'grey.300' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('analytics.turbineStatus.title')}
              </Typography>
            </Stack>
            <Box sx={{ height: 40, bgcolor: 'grey.200', borderRadius: 1 }} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        className={className}
        sx={{ 
          borderRadius: 0.5,
          border: `1px solid ${theme.palette.error.main}`,
          backgroundColor: alpha(theme.palette.error.main, 0.05),
          ...sx,
        }}
      >
        <CardContent sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="error">
            {t('analytics.error.title')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={className}
      sx={{ 
        borderRadius: 0.5,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PowerSettingsNewRounded sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {t('analytics.turbineStatus.title')}
            </Typography>
          </Stack>
          <Tooltip title="Refresh data">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <RefreshRounded sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Main Metrics */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              lineHeight: 1,
            }}>
              {activeTurbines}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('analytics.turbineStatus.active')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip 
              label={`${totalTurbines} ${t('analytics.turbineStatus.total')}`}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: theme.palette.divider,
                color: 'text.secondary',
                fontWeight: 500,
                mb: 0.5,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ 
                fontWeight: 500, 
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}>
                {calculatedUptime.toFixed(1)}% {t('analytics.turbineStatus.uptime')}
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Uptime Progress */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('analytics.turbineStatus.systemUptime')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
              }}>
                {calculatedUptime.toFixed(1)}%
              </Typography>
              <Tooltip title="System reliability percentage">
                <InfoOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Tooltip>
            </Stack>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={calculatedUptime}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: calculatedUptime >= 90 ? theme.palette.success.main : 
                                calculatedUptime >= 70 ? theme.palette.warning.main : 
                                theme.palette.error.main,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
