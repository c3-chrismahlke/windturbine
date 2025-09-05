import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  useTheme,
  alpha,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  ErrorOutlineRounded,
  RefreshRounded,
  SupportAgentRounded,
  EmailRounded,
  PhoneRounded,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation('common');

  const isApiError = error.message.includes('API error');
  const isNetworkError = error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
  const isBackendDown = isApiError && error.message.includes('500');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Error Icon */}
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
            }}
          >
            <ErrorOutlineRounded sx={{ fontSize: 48 }} />
          </Box>

          {/* Error Title */}
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {isBackendDown ? t('error.backendDown.title') : t('error.general.title')}
          </Typography>

          {/* Error Description */}
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
            {isBackendDown 
              ? t('error.backendDown.description')
              : isNetworkError 
                ? t('error.network.description')
                : t('error.general.description')
            }
          </Typography>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Alert severity="info" sx={{ textAlign: 'left', maxWidth: 500 }}>
              <AlertTitle>Technical Details</AlertTitle>
              <Typography variant="body2" component="pre" sx={{ 
                fontSize: '0.75rem', 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
              }}>
                {error.message}
              </Typography>
            </Alert>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshRounded />}
              onClick={retry}
              sx={{ px: 3 }}
            >
              {t('error.actions.retry')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ px: 3 }}
            >
              {t('error.actions.reload')}
            </Button>
          </Stack>

          {/* Contact Information */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              width: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              {t('error.contact.title')}
            </Typography>
            <Stack spacing={1} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <SupportAgentRounded sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {t('error.contact.support')}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailRounded sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {t('error.contact.email')}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneRounded sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {t('error.contact.phone')}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, clearError };
}

export default ErrorBoundaryClass;
