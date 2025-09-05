import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Chip,
  Box,
  Typography,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Snackbar,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import EditLocationRoundedIcon from '@mui/icons-material/EditLocationRounded';
import { useTranslation } from 'react-i18next';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';

export interface EditorShape {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  manufacturer?: string;
  manufacturerCountry?: string;
  capacityKW?: number;
  active?: boolean;
  builtDate?: string;
  installationDate?: string;
}

export interface TurbineEditDialogProps {
  open: boolean;
  editing: EditorShape | null;
  busy?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (data: EditorShape) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onFieldChange: (key: keyof EditorShape, value: any) => void;
  t?: (key: string) => string;
  isCreating?: boolean;
}

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

// Location Map Component
function LocationMap({ 
  latitude, 
  longitude, 
  onLocationChange, 
  height = 300,
  disabled = false 
}: {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: number;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<mapboxgl.Map | null>(null);
  const crosshairRef = React.useRef<HTMLDivElement>(null);
  const isUpdatingFromProps = React.useRef(false);

  // Initialize map
  React.useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    const initializeMap = async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!token) {
        console.error('Mapbox: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is missing');
        return;
      }

      const mapboxgl = (await import('mapbox-gl')).default;
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [longitude || -98.5, latitude || 39.8],
        zoom: 8,
        interactive: !disabled,
      });

      mapInstanceRef.current = map;

      // Add crosshair overlay
      if (crosshairRef.current) {
        crosshairRef.current.style.display = 'block';
      }

      // Handle map movement
      const updateLocation = () => {
        // Only update if we're not currently updating from props
        if (!isUpdatingFromProps.current) {
          const center = map.getCenter();
          onLocationChange(center.lat, center.lng);
        }
      };

      map.on('moveend', updateLocation);
      map.on('dragend', updateLocation);

      return () => {
        map.remove();
      };
    };

    initializeMap();
  }, [disabled, onLocationChange]);

  // Update map center when coordinates change externally (but prevent infinite loops)
  React.useEffect(() => {
    if (mapInstanceRef.current && latitude !== 0 && longitude !== 0) {
      isUpdatingFromProps.current = true;
      mapInstanceRef.current.setCenter([longitude, latitude]);
      // Reset the flag after a short delay to allow the map to settle
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 100);
    }
  }, [latitude, longitude]);

  return (
    <Box sx={{ position: 'relative', height, width: '100%' }}>
      {/* Map Container */}
      <Box
        ref={mapRef}
        sx={{
          height: '100%',
          width: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
        }}
      />

      {/* Crosshair Overlay */}
      <Box
        ref={crosshairRef}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 10,
          display: 'none',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: theme.palette.primary.main,
              transform: 'translateY(-50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: theme.palette.primary.main,
              transform: 'translateX(-50%)',
            },
          }}
        >
          {/* Center dot */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 8,
              height: 8,
              backgroundColor: theme.palette.primary.main,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        </Box>
      </Box>

      {/* Coordinates Display */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          borderRadius: 1,
          p: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {t('turbineEdit.location.mapTitle')}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
        </Typography>
      </Box>

      {/* Helper Text */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          right: 8,
          backgroundColor: alpha(theme.palette.primary.main, 0.9),
          color: 'white',
          borderRadius: 1,
          p: 1,
        }}
      >
        <Typography variant="caption" sx={{ display: 'block' }}>
          {t('turbineEdit.location.mapHelper')}
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * TurbineEditDialog — Beautiful, principle‑driven UI/UX
 * Design goals (Universal Principles of Design):
 * - **Hierarchy & legibility:** clear section headings, larger title, quiet metadata.
 * - **Grouping & proximity:** fields organized into Identity, Location, Specifications, Lifecycle, Status.
 * - **Affordance:** buttons clearly indicate their purpose, form fields are obvious.
 * - **Feedback:** immediate validation, clear error states, success confirmations.
 * - **Consistency:** uniform spacing, typography, and interaction patterns.
 * - **Accessibility:** proper labels, keyboard navigation, screen reader support.
 */
export default function TurbineEditDialog({
  open,
  editing,
  busy = false,
  error = null,
  onClose,
  onSave,
  onDelete,
  onFieldChange,
  t = (key: string) => key,
  isCreating = false,
}: TurbineEditDialogProps) {
  const { i18n } = useTranslation('common');
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = React.useState(0);

  // Form state
  const [formData, setFormData] = React.useState<EditorShape>({
    id: '',
    name: '',
    latitude: 0,
    longitude: 0,
    manufacturer: '',
    manufacturerCountry: '',
    capacityKW: 0,
    active: true,
    builtDate: '',
    installationDate: '',
  });

  // Update form data when editing changes
  React.useEffect(() => {
    if (editing) {
      setFormData({
        id: editing.id || '',
        name: editing.name || '',
        latitude: editing.latitude || 0,
        longitude: editing.longitude || 0,
        manufacturer: editing.manufacturer || '',
        manufacturerCountry: editing.manufacturerCountry || '',
        capacityKW: editing.capacityKW || 0,
        active: editing.active ?? true,
        builtDate: editing.builtDate || '',
        installationDate: editing.installationDate || '',
      });
    }
  }, [editing]);

  // Validation functions
  const validateField = (key: keyof EditorShape, value: any): string => {
    switch (key) {
      case 'name':
        return !value || value.trim() === '' ? t('turbineEdit.validation.nameRequired') : '';
      case 'latitude':
        if (!value && value !== 0) return t('turbineEdit.validation.latitudeRequired');
        if (typeof value !== 'number' || value < -90 || value > 90) return t('turbineEdit.validation.latitudeRange');
        return '';
      case 'longitude':
        if (!value && value !== 0) return t('turbineEdit.validation.longitudeRequired');
        if (typeof value !== 'number' || value < -180 || value > 180) return t('turbineEdit.validation.longitudeRange');
        return '';
      case 'capacityKW':
        if (!value && value !== 0) return t('turbineEdit.validation.capacityRequired');
        if (typeof value !== 'number' || value <= 0) return t('turbineEdit.validation.capacityPositive');
        return '';
      case 'manufacturer':
        return !value || value.trim() === '' ? t('turbineEdit.validation.manufacturerRequired') : '';
      case 'builtDate':
        if (value && !dayjs(value).isValid()) return t('turbineEdit.validation.builtDateInvalid');
        return '';
      case 'installationDate':
        if (value && !dayjs(value).isValid()) return t('turbineEdit.validation.installationDateInvalid');
        if (value && formData.builtDate && dayjs(value).isBefore(dayjs(formData.builtDate))) {
          return t('turbineEdit.validation.installationBeforeBuilt');
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const fieldsToValidate: (keyof EditorShape)[] = ['name', 'latitude', 'longitude', 'capacityKW', 'manufacturer', 'builtDate', 'installationDate'];
    
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = React.useCallback((key: keyof EditorShape, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    onFieldChange(key, value);

    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [onFieldChange, validationErrors]);

  const handleLocationChange = React.useCallback((lat: number, lng: number) => {
    handleFieldChange('latitude', lat);
    handleFieldChange('longitude', lng);
  }, [handleFieldChange]);

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onSave(formData);
      setSnackbar({
        open: true,
        message: isCreating ? t('turbineEdit.notifications.createSuccess') : t('turbineEdit.notifications.saveSuccess'),
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: isCreating ? t('turbineEdit.errors.failedToCreate') : t('turbineEdit.errors.failedToSave'),
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!formData.id || isCreating) return;

    try {
      await onDelete(formData.id);
      setSnackbar({
        open: true,
        message: t('turbineEdit.notifications.deleteSuccess'),
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: t('turbineEdit.errors.failedToDelete'),
        severity: 'error',
      });
    }
  };

  const handleClose = () => {
    setValidationErrors({});
    setActiveTab(0);
    onClose();
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const fieldsNeedAttention = Object.keys(validationErrors).length;
  const attentionText = fieldsNeedAttention === 1 
    ? t('turbineEdit.fieldsNeedAttention')
    : t('turbineEdit.fieldsNeedAttentionPlural');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BuildRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {isCreating ? t('turbineEdit.createTitle') : t('turbineEdit.title')}
              </Typography>
              {editing?.id && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('turbineEdit.recordId')}: {editing.id}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          {/* Validation Alert */}
          {hasValidationErrors && (
            <Alert 
              severity="warning" 
              icon={<WarningAmberRoundedIcon />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {attentionText}
              </Typography>
              <Stack spacing={0.5}>
                {Object.entries(validationErrors).map(([field, message]) => (
                  <Typography key={field} variant="body2" sx={{ fontSize: '0.875rem' }}>
                    • {message}
                  </Typography>
                ))}
              </Stack>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" icon={<ErrorRoundedIcon />} sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Tabs for different sections */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab 
                icon={<BadgeRoundedIcon />} 
                label={t('turbineEdit.identity.title')} 
                iconPosition="start"
              />
              <Tab 
                icon={<MapRoundedIcon />} 
                label={t('turbineEdit.location.title')} 
                iconPosition="start"
              />
              <Tab 
                icon={<BoltRoundedIcon />} 
                label={t('turbineEdit.specifications.title')} 
                iconPosition="start"
              />
              <Tab 
                icon={<CalendarMonthRoundedIcon />} 
                label={t('turbineEdit.lifecycle.title')} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t('turbineEdit.identity.name')}
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!validationErrors.name}
                helperText={validationErrors.name || t('turbineEdit.identity.nameHelper')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FactoryRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label={t('turbineEdit.identity.manufacturer')}
                  value={formData.manufacturer}
                  onChange={(e) => handleFieldChange('manufacturer', e.target.value)}
                  error={!!validationErrors.manufacturer}
                  helperText={validationErrors.manufacturer || t('turbineEdit.identity.manufacturerHelper')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FactoryRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label={t('turbineEdit.identity.manufacturerCountry')}
                  value={formData.manufacturerCountry}
                  onChange={(e) => handleFieldChange('manufacturerCountry', e.target.value)}
                  helperText={t('turbineEdit.identity.manufacturerCountryHelper')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>
          )}

          {activeTab === 1 && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                {t('turbineEdit.location.title')}
              </Typography>
              
              {/* Interactive Map */}
              <LocationMap
                latitude={formData.latitude || 0}
                longitude={formData.longitude || 0}
                onLocationChange={handleLocationChange}
                height={300}
                disabled={busy}
              />

              {/* Manual coordinate inputs as backup */}
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label={t('turbineEdit.location.latitude')}
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || 0)}
                  error={!!validationErrors.latitude}
                  helperText={validationErrors.latitude || t('turbineEdit.location.latitudeHelper')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label={t('turbineEdit.location.longitude')}
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || 0)}
                  error={!!validationErrors.longitude}
                  helperText={validationErrors.longitude || t('turbineEdit.location.longitudeHelper')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>
          )}

          {activeTab === 2 && (
            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t('turbineEdit.specifications.capacity')}
                type="number"
                value={formData.capacityKW}
                onChange={(e) => handleFieldChange('capacityKW', parseFloat(e.target.value) || 0)}
                error={!!validationErrors.capacityKW}
                helperText={validationErrors.capacityKW || t('turbineEdit.specifications.capacityHelper')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BoltRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => handleFieldChange('active', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PowerSettingsNewRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {t('turbineEdit.specifications.active')}
                    </Typography>
                  </Stack>
                }
              />
            </Stack>
          )}

          {activeTab === 3 && (
            <Stack direction="row" spacing={2}>
              <DatePicker
                label={t('turbineEdit.lifecycle.builtDate')}
                value={formData.builtDate ? dayjs(formData.builtDate) : null}
                onChange={(date: Dayjs | null) => handleFieldChange('builtDate', date?.format('YYYY-MM-DD') || '')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!validationErrors.builtDate,
                    helperText: validationErrors.builtDate || t('turbineEdit.lifecycle.optional'),
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
              <DatePicker
                label={t('turbineEdit.lifecycle.installationDate')}
                value={formData.installationDate ? dayjs(formData.installationDate) : null}
                onChange={(date: Dayjs | null) => handleFieldChange('installationDate', date?.format('YYYY-MM-DD') || '')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!validationErrors.installationDate,
                    helperText: validationErrors.installationDate || t('turbineEdit.lifecycle.optional'),
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Stack>
          )}

          {/* Danger Zone - Only for editing existing turbines */}
          {!isCreating && formData.id && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <WarningAmberRoundedIcon sx={{ fontSize: 20, color: 'error.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                    {t('turbineEdit.dangerZone.title')}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha('#f44336', 0.05),
                    border: `1px solid ${alpha('#f44336', 0.1)}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('turbineEdit.dangerZone.description')}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={handleDelete}
                    disabled={busy}
                    sx={{ borderRadius: 2 }}
                  >
                    {t('turbineEdit.dangerZone.deleteButton')}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            startIcon={<CloseRoundedIcon />}
            disabled={busy}
            sx={{ borderRadius: 2 }}
          >
            {t('turbineEdit.actions.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={busy ? <CircularProgress size={16} /> : <SaveRoundedIcon />}
            disabled={busy || hasValidationErrors}
            sx={{ borderRadius: 2 }}
          >
            {busy 
              ? (isCreating ? t('turbineEdit.actions.creating') : t('turbineEdit.actions.saving'))
              : (isCreating ? t('turbineEdit.actions.create') : t('turbineEdit.actions.save'))
            }
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}
