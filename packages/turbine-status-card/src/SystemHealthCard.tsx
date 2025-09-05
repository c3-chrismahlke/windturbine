import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { 
  ScheduleRounded, 
  CheckCircleRounded,
  RefreshRounded,
  InfoOutlined,
  HealthAndSafetyRounded,
  TrendingUpRounded
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface SystemHealthCardProps {
  /** Work order progress percentage */
  workOrderProgress: number;
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
 * SystemHealthCard - A clean, compact card component displaying system health metrics
 */
export default function SystemHealthCard({
  workOrderProgress,
  loading = false,
  error = false,
  className,
  sx,
}: SystemHealthCardProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');

  // Determine health status
  const getHealthStatus = (progress: number) => {
    if (progress >= 90) return { status: 'Excellent', color: theme.palette.success.main };
    if (progress >= 75) return { status: 'Good', color: theme.palette.success.light };
    if (progress >= 50) return { status: 'Fair', color: theme.palette.warning.main };
    return { status: 'Poor', color: theme.palette.error.main };
  };

  const healthStatus = getHealthStatus(workOrderProgress);

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
                {t('analytics.systemHealth.title')}
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
                backgroundColor: theme.palette.info.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ScheduleRounded sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {t('analytics.systemHealth.title')}
            </Typography>
          </Stack>
          <Tooltip title="Refresh data">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <RefreshRounded sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Health Status */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <HealthAndSafetyRounded sx={{ fontSize: 18, color: healthStatus.color }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: healthStatus.color,
                fontSize: '1.25rem',
              }}>
                {healthStatus.status}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {t('analytics.systemHealth.systemHealth')}
            </Typography>
          </Box>
          <Chip 
            label={`${workOrderProgress.toFixed(1)}%`}
            size="small"
            sx={{ 
              backgroundColor: alpha(healthStatus.color, 0.1),
              color: healthStatus.color,
              fontWeight: 700,
            }}
          />
        </Stack>

        {/* Work Order Progress */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('analytics.systemHealth.workOrderProgress')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
              }}>
                {workOrderProgress.toFixed(1)}%
              </Typography>
              <Tooltip title="Current work order completion progress">
                <InfoOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Tooltip>
            </Stack>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={workOrderProgress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: healthStatus.color,
              },
            }}
          />
        </Box>

        {/* System Status Indicators */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            borderRadius: 1, 
            backgroundColor: alpha(healthStatus.color, 0.05),
            border: `1px solid ${alpha(healthStatus.color, 0.1)}`,
          }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <TrendingUpRounded sx={{ fontSize: 16, color: healthStatus.color }} />
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: healthStatus.color,
                fontSize: '0.75rem',
              }}>
                {t('analytics.systemHealth.progress')}
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: healthStatus.color,
              fontSize: '1rem',
            }}>
              {workOrderProgress.toFixed(1)}%
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
                {t('analytics.systemHealth.status')}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              color: 'success.main',
              fontSize: '0.875rem',
            }}>
              {t('analytics.systemHealth.normal')}
            </Typography>
          </Box>
        </Stack>

        {/* Health Summary */}
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
                backgroundColor: healthStatus.color,
              }}
            />
            <Typography variant="body2" sx={{ 
              fontWeight: 500, 
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}>
              {healthStatus.status === 'Excellent' ? 'System operating at peak performance' :
               healthStatus.status === 'Good' ? 'System health is stable and operational' :
               healthStatus.status === 'Fair' ? 'System shows minor issues but remains functional' :
               'System requires attention to prevent potential issues'}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
