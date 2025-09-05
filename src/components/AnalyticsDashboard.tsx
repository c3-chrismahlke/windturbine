import * as React from 'react';
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Fade,
  useTheme,
  alpha,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import { 
  ErrorRounded, 
  CloudOffRounded, 
  RefreshRounded,
  SupportAgentRounded,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSystemSummary } from '@lib/analytics';
import { isBackendError } from '@lib/api';
import { 
  TurbineStatusCard, 
  WorkOrdersCard, 
  PowerOutputCard, 
  SystemHealthCard 
} from '@your-scope/turbine-status-card';

interface AnalyticsDashboardProps {
  visible: boolean;
}

/**
 * Analytics Dashboard - Inspired by Don Norman & Jonathan Ive Design Principles
 * 
 * Design Philosophy:
 * - Simplicity & Clarity: Clean, uncluttered interface with clear visual hierarchy
 * - Affordance: Interactive elements clearly indicate their purpose
 * - Feedback: Real-time data updates with smooth animations
 * - Accessibility: High contrast, readable typography, semantic structure
 * - Emotional Design: Delightful micro-interactions and visual polish
 * - Human-Centered: Data presented in context that humans can understand
 */
export default function AnalyticsDashboard({ visible }: AnalyticsDashboardProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const { data: summary, error, isLoading, mutate } = useSystemSummary({ refreshMs: 30000 });
  
  // Calculate derived metrics
  const turbineUptime = summary ? (summary.activeTurbines / summary.totalTurbines) * 100 : 0;
  const workOrderCompletion = summary ? ((summary.totalWorkOrders - summary.openWorkOrders) / summary.totalWorkOrders) * 100 : 0;
  const workOrderProgress = summary ? (summary.inProgressWorkOrders / summary.totalWorkOrders) * 100 : 0;

  const handleRetry = () => {
    mutate();
  };

  if (!visible) return null;

  return (
    <Fade in={visible} timeout={800}>
      <Box
        sx={{
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            mb: 1,
          }}>
            {t('analytics.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('analytics.subtitle')}
          </Typography>
        </Box>

        {/* Content */}
        <Box>
          {isLoading ? (
            // Loading State - Skeleton placeholders
            <Stack spacing={2}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Box key={index} sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" width={200} height={24} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={100} height={32} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Stack>
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3 }} />
                </Box>
              ))}
            </Stack>
          ) : error ? (
            // Error State - Professional error handling
            <Box>
              <Alert 
                severity={isBackendError(error) ? "error" : "warning"}
                sx={{
                  borderRadius: 2,
                  mb: 3,
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {isBackendError(error) ? (
                    <CloudOffRounded sx={{ fontSize: 20 }} />
                  ) : (
                    <ErrorRounded sx={{ fontSize: 20 }} />
                  )}
                  {isBackendError(error) ? t('error.backendDown.title') : t('error.general.title')}
                </AlertTitle>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {isBackendError(error) 
                    ? t('error.backendDown.description')
                    : error.message || t('error.general.description')
                  }
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshRounded />}
                    onClick={handleRetry}
                  >
                    {t('error.actions.retry')}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<SupportAgentRounded />}
                    onClick={() => {
                      // In a real app, this would open a support ticket or contact form
                      window.open('mailto:support@windturbine.com?subject=Analytics Dashboard Error', '_blank');
                    }}
                  >
                    {t('error.contact.support')}
                  </Button>
                </Stack>
              </Alert>

              {/* Fallback: Show empty state with helpful message */}
              <Box 
                sx={{ 
                  borderRadius: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <CloudOffRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  {t('analytics.error.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('error.backendDown.description')}
                </Typography>
              </Box>
            </Box>
          ) : summary ? (
            // Data State - Beautiful metrics display using card components
            <Stack spacing={2}>
              {/* Turbine Status Card */}
              <TurbineStatusCard
                activeTurbines={summary.activeTurbines}
                totalTurbines={summary.totalTurbines}
                uptimePercentage={turbineUptime}
              />

              {/* Work Orders Card */}
              <WorkOrdersCard
                totalWorkOrders={summary.totalWorkOrders}
                openWorkOrders={summary.openWorkOrders}
                inProgressWorkOrders={summary.inProgressWorkOrders}
                completionPercentage={workOrderCompletion}
              />

              {/* Power Output Card */}
              <PowerOutputCard
                avgPowerOutput={summary.avgPowerOutput}
              />

              {/* System Health Card */}
              <SystemHealthCard
                workOrderProgress={workOrderProgress}
              />
            </Stack>
          ) : null}
        </Box>
      </Box>
    </Fade>
  );
}
