import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { 
  TrendingUpRounded, 
  CheckCircleRounded,
  RefreshRounded,
  InfoOutlined,
  BoltRounded
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface PowerOutputCardProps {
  /** Average power output value */
  avgPowerOutput: number;
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
 * PowerOutputCard - A clean, compact card component displaying power output metrics
 */
export default function PowerOutputCard({
  avgPowerOutput,
  loading = false,
  error = false,
  className,
  sx,
}: PowerOutputCardProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');

  // Determine performance level
  const getPerformanceLevel = (output: number) => {
    if (output >= 2000) return 'High';
    if (output >= 1500) return 'Good';
    if (output >= 1000) return 'Moderate';
    return 'Low';
  };

  const performanceLevel = getPerformanceLevel(avgPowerOutput);

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
                {t('analytics.powerOutput.title')}
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
                backgroundColor: theme.palette.success.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUpRounded sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {t('analytics.powerOutput.title')}
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
              {avgPowerOutput.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('analytics.powerOutput.avg24h')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip 
              label={performanceLevel}
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
                mb: 0.5,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BoltRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ 
                fontWeight: 500, 
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}>
                {t('analytics.powerOutput.performance')}
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Status Indicators */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            borderRadius: 1, 
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <BoltRounded sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                fontSize: '0.75rem',
              }}>
                {t('analytics.powerOutput.output')}
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              fontSize: '1rem',
            }}>
              {avgPowerOutput.toLocaleString()} kW
            </Typography>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            borderRadius: 1, 
            backgroundColor: alpha(theme.palette.success.main, 0.05),
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
          }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <CheckCircleRounded sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: 'success.main',
                fontSize: '0.75rem',
              }}>
                {t('analytics.powerOutput.status')}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              color: 'success.main',
              fontSize: '0.875rem',
            }}>
              {t('analytics.powerOutput.operational')}
            </Typography>
          </Box>
        </Stack>

        {/* Performance Summary */}
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 1, 
          backgroundColor: alpha(theme.palette.grey[100], 0.5),
          border: `1px solid ${theme.palette.divider}`,
        }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
              }}
            />
            <Typography variant="body2" sx={{ 
              fontWeight: 500, 
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}>
              {performanceLevel === 'High' ? 'Generating power at maximum efficiency' :
               performanceLevel === 'Good' ? 'High power output with excellent performance' :
               performanceLevel === 'Moderate' ? 'Steady power generation' :
               'Power output below optimal levels'}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
