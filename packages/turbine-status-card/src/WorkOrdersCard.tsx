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
  AssignmentRounded, 
  TrendingUpRounded,
  RefreshRounded,
  InfoOutlined,
  ScheduleRounded,
  CheckCircleRounded,
  WarningRounded
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface WorkOrdersCardProps {
  /** Total number of work orders */
  totalWorkOrders: number;
  /** Number of open work orders */
  openWorkOrders: number;
  /** Number of work orders in progress */
  inProgressWorkOrders: number;
  /** Optional custom completion percentage, calculated if not provided */
  completionPercentage?: number;
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
 * WorkOrdersCard - A clean, compact card component displaying work order metrics
 */
export default function WorkOrdersCard({
  totalWorkOrders,
  openWorkOrders,
  inProgressWorkOrders,
  completionPercentage,
  loading = false,
  error = false,
  className,
  sx,
}: WorkOrdersCardProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');
  
  // Calculate completion percentage if not provided
  const calculatedCompletion = completionPercentage ?? 
    (totalWorkOrders > 0 ? ((totalWorkOrders - openWorkOrders) / totalWorkOrders) * 100 : 0);

  // Calculate completed work orders
  const completedWorkOrders = totalWorkOrders - openWorkOrders - inProgressWorkOrders;

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
                {t('analytics.workOrders.title')}
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
                backgroundColor: theme.palette.secondary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AssignmentRounded sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {t('analytics.workOrders.title')}
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
              {totalWorkOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('analytics.workOrders.totalOrders')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              mb: 0.5,
            }}>
              {calculatedCompletion.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {t('analytics.workOrders.completionRate')}
            </Typography>
          </Box>
        </Stack>

        {/* Status Breakdown */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            icon={<WarningRounded sx={{ fontSize: 14 }} />}
            label={`${openWorkOrders} ${t('analytics.workOrders.open')}`}
            size="small"
            sx={{ 
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
              fontWeight: 500,
              fontSize: '0.75rem',
              '& .MuiChip-icon': { color: 'error.main' },
            }}
          />
          <Chip 
            icon={<ScheduleRounded sx={{ fontSize: 14 }} />}
            label={`${inProgressWorkOrders} ${t('analytics.workOrders.active')}`}
            size="small"
            sx={{ 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              color: 'warning.main',
              fontWeight: 500,
              fontSize: '0.75rem',
              '& .MuiChip-icon': { color: 'warning.main' },
            }}
          />
          <Chip 
            icon={<CheckCircleRounded sx={{ fontSize: 14 }} />}
            label={`${completedWorkOrders} ${t('analytics.workOrders.done')}`}
            size="small"
            sx={{ 
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: 'success.main',
              fontWeight: 500,
              fontSize: '0.75rem',
              '& .MuiChip-icon': { color: 'success.main' },
            }}
          />
        </Stack>

        {/* Completion Progress */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('analytics.workOrders.progress')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
              }}>
                {calculatedCompletion.toFixed(1)}%
              </Typography>
              <Tooltip title="Work order completion percentage">
                <InfoOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Tooltip>
            </Stack>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={calculatedCompletion}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: calculatedCompletion >= 80 ? theme.palette.success.main : 
                                calculatedCompletion >= 60 ? theme.palette.warning.main : 
                                theme.palette.error.main,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
