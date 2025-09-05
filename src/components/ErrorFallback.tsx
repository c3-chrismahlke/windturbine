import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  alpha,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  ErrorOutlineRounded,
  RefreshRounded,
  CloudOffRounded,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { isBackendError } from '@lib/api';

interface ErrorFallbackProps {
  error: Error;
  retry?: () => void;
  title?: string;
  description?: string;
  showContactInfo?: boolean;
  compact?: boolean;
}

export default function ErrorFallback({
  error,
  retry,
  title,
  description,
  showContactInfo = false,
  compact = false,
}: ErrorFallbackProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');

  const isBackendDown = isBackendError(error);
  const errorTitle = title || (isBackendDown ? t('error.backendDown.title') : t('error.general.title'));
  const errorDescription = description || (isBackendDown ? t('error.backendDown.description') : t('error.general.description'));

  if (compact) {
    return (
      <Alert 
        severity={isBackendDown ? "error" : "warning"}
        sx={{ borderRadius: 1 }}
      >
        <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isBackendDown ? (
            <CloudOffRounded sx={{ fontSize: 16 }} />
          ) : (
            <ErrorOutlineRounded sx={{ fontSize: 16 }} />
          )}
          {errorTitle}
        </AlertTitle>
        <Typography variant="body2" sx={{ mb: retry ? 1 : 0 }}>
          {errorDescription}
        </Typography>
        {retry && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRounded />}
            onClick={retry}
            sx={{ mt: 1 }}
          >
            {t('error.actions.retry')}
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.error.main, 0.05),
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: 'error.main',
          }}
        >
          {isBackendDown ? (
            <CloudOffRounded sx={{ fontSize: 32 }} />
          ) : (
            <ErrorOutlineRounded sx={{ fontSize: 32 }} />
          )}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {errorTitle}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          {errorDescription}
        </Typography>

        {retry && (
          <Button
            variant="contained"
            startIcon={<RefreshRounded />}
            onClick={retry}
            sx={{ mt: 1 }}
          >
            {t('error.actions.retry')}
          </Button>
        )}

        {showContactInfo && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('error.contact.title')}: {t('error.contact.email')}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
