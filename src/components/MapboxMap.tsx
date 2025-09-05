import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Fade, 
  Alert,
  AlertTitle,
  Button,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ErrorOutlineRounded,
  RefreshRounded,
  CloudOffRounded,
} from '@mui/icons-material';
import type { RootState } from '@lib/store';
import { apiFetch, isBackendError, getErrorMessage } from '@lib/api';

type Turbine = { id: string; name: string; latitude: number; longitude: number; active?: boolean };

export default function MapboxMap({ height }: { height?: number }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<any>(null);
  const { i18n, t } = useTranslation('common');
  const theme = useTheme();
  const appLang = (i18n.language || 'en').split('-')[0];
  const selected = useSelector((s: RootState) => s.selection.selected);
  const turbineOverrides = useSelector((s: RootState) => s.turbines.overrides);
  const [mapReady, setMapReady] = React.useState(false);
  const [turbines, setTurbines] = React.useState<Turbine[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = React.useState(false);

  const loadTurbines = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load ALL turbines to match the table data
      const all: Turbine[] = [];
      let page = 1;
      const limit = 500;
      for (;;) {
        const res = await apiFetch(`/1/windturbines?limit=${limit}&page=${page}`);
        const items: Turbine[] = Array.isArray(res as unknown as unknown[])
          ? (res as unknown as Turbine[])
          : (((res as unknown as { data?: Turbine[] }).data) ?? []);
        
        if (items?.length) all.push(...items);
        
        const hasNextFromApi = !Array.isArray(res)
          ? Boolean((res as unknown as { pagination?: { hasNext?: boolean } }).pagination?.hasNext)
          : undefined;
        const hasNext = hasNextFromApi ?? (items ? items.length === limit : false);
        if (!hasNext) break;
        page += 1;
      }

      setTurbines(all);
      return all;
    } catch (err) {
      const errorMessage = getErrorMessage(err, t('error.general.description'));
      setError(errorMessage);
      console.error('Failed to load turbines:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t]);

  const addTurbinesToMap = React.useCallback((turbinesData: Turbine[]) => {
    if (!mapRef.current) return;

    const features = turbinesData
      .filter((t) => typeof t.longitude === 'number' && typeof t.latitude === 'number')
      .map((t) => ({
        type: 'Feature',
        properties: {
          id: t.id,
          name: t.name,
          color: t.active ? '#2e7d32' : '#d32f2f',
          active: Boolean(t.active),
        },
        geometry: { type: 'Point', coordinates: [t.longitude, t.latitude] },
      }));

    try {
      // Check if source exists and update it, otherwise create it
      if (mapRef.current.getSource('turbines')) {
        // Update existing source data
        (mapRef.current.getSource('turbines') as any).setData({ 
          type: 'FeatureCollection', 
          features 
        });
      } else {
        // Create new source
        mapRef.current.addSource('turbines', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        } as any);

        // Add circle layer for turbines
        if (!mapRef.current.getLayer('turbine-points')) {
          mapRef.current.addLayer({
            id: 'turbine-points',
            type: 'circle',
            source: 'turbines',
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                3, 3,
                6, 4.5,
                10, 6,
                14, 7
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff',
            },
          });
        }

        // Add labels for turbine names
        if (!mapRef.current.getLayer('turbine-labels')) {
          mapRef.current.addLayer({
            id: 'turbine-labels',
            type: 'symbol',
            source: 'turbines',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
              'text-size': 12,
              'text-allow-overlap': false,
              'text-ignore-placement': false,
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1,
            },
          });
        }
      }
    } catch (err) {
      console.error('Error adding turbines to map:', err);
    }
  }, []);

  // Function to update map language
  const updateMapLanguage = React.useCallback((language: string) => {
    if (!mapRef.current) return;

    try {
      // List of common label layers that need language updates
      const labelLayers = [
        'country-label',
        'state-label', 
        'settlement-label',
        'settlement-subdivision-label',
        'airport-label',
        'poi-label',
        'water-point-label',
        'water-line-label',
        'natural-point-label',
        'natural-line-label',
        'waterway-label',
        'road-label'
      ];

      // Update each label layer to use the new language
      labelLayers.forEach(layerId => {
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.setLayoutProperty(layerId, 'text-field', [
            'get',
            `name_${language}`
          ]);
        }
      });
    } catch (err) {
      console.warn('Failed to update map language:', err);
    }
  }, []);

  // Handle turbine creation events
  React.useEffect(() => {
    const handleTurbineCreated = (e: Event) => {
      const detail = (e as CustomEvent).detail as { 
        id: string; 
        name: string; 
        latitude: number; 
        longitude: number; 
        manufacturer: string; 
        capacityKW: number; 
        active: boolean; 
      };
      
      if (detail?.id && detail?.latitude && detail?.longitude) {
        console.log('Turbine created event received in map:', detail);
        
        // Add the new turbine to the local state
        const newTurbine: Turbine = {
          id: detail.id,
          name: detail.name,
          latitude: detail.latitude,
          longitude: detail.longitude,
          active: detail.active,
        };
        
        setTurbines(prev => [...prev, newTurbine]);
        
        // Zoom to the new turbine location
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [detail.longitude, detail.latitude],
            zoom: 12,
            duration: 2000,
          });
        }
      }
    };

    const handleTurbineUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail as { 
        id: string; 
        name: string; 
        latitude: number; 
        longitude: number; 
        manufacturer: string; 
        capacityKW: number; 
        active: boolean; 
      };
      
      if (detail?.id) {
        console.log('Turbine updated event received in map:', detail);
        setTurbines(prev => 
          prev.map(turbine => 
            turbine.id === detail.id 
              ? { ...turbine, name: detail.name, latitude: detail.latitude, longitude: detail.longitude, active: detail.active }
              : turbine
          )
        );
      }
    };

    const handleTurbineDeleted = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string };
      if (detail?.id) {
        console.log('Turbine deleted event received in map:', detail.id);
        setTurbines(prev => prev.filter(turbine => turbine.id !== detail.id));
      }
    };

    window.addEventListener('turbine:created', handleTurbineCreated);
    window.addEventListener('turbine:updated', handleTurbineUpdated);
    window.addEventListener('turbine:deleted', handleTurbineDeleted);
    
    return () => {
      window.removeEventListener('turbine:created', handleTurbineCreated);
      window.removeEventListener('turbine:updated', handleTurbineUpdated);
      window.removeEventListener('turbine:deleted', handleTurbineDeleted);
    };
  }, []);

  // Initialize map only once
  React.useEffect(() => {
    if (mapInitialized || typeof window === 'undefined' || !ref.current) return;
    
    const initializeMap = async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!token) {
        console.error('Mapbox: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is missing. Set it in your .env and restart the dev server.');
        setError('Mapbox token is missing. Please check configuration.');
        setLoading(false);
        return;
      }
      
      const mapboxgl = (await import('mapbox-gl')).default;
      (mapboxgl as any).accessToken = token;

      const map = new mapboxgl.Map({
        container: ref.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-98.5, 39.8],
        zoom: 3,
        pitch: 45,
        attributionControl: true,
      });
      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

      // Set map ready when loaded
      map.on('load', async () => {
        setMapReady(true);
        setMapInitialized(true);
        
        // Update map language after map loads
        updateMapLanguage(appLang);
        
        const turbinesData = await loadTurbines();
        if (turbinesData.length > 0) {
          addTurbinesToMap(turbinesData);
        }
      });

      // Atmosphere / fog styling
      map.on('style.load', () => {
        try {
          if (map.getSource('mapbox-dem')) {
            map.setFog({
              color: 'rgb(186, 210, 235)',
              'high-color': 'rgb(36, 92, 223)',
              'horizon-blend': 0.02,
            });
            map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
          }
        } catch (e) {
          console.warn('Mapbox: Could not set fog/terrain:', e);
        }
      });

      // Add click handler for turbines
      map.on('click', 'turbine-points', async (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const turbineId = feature.properties?.id;
        if (!turbineId) return;

        // Dispatch custom event for turbine selection
        try {
          window.dispatchEvent(new CustomEvent('turbine:selected', { 
            detail: { 
              id: turbineId,
              name: feature.properties?.name,
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
            } 
          }));
        } catch (err) {
          console.warn('Failed to dispatch turbine selection event:', err);
        }
      });

      // Change cursor on hover
      map.on('mouseenter', 'turbine-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'turbine-points', () => {
        map.getCanvas().style.cursor = '';
      });

      return () => {
        map.remove();
      };
    };

    initializeMap();
  }, [mapInitialized, loadTurbines, addTurbinesToMap, appLang, updateMapLanguage]);

  // Update map language when locale changes
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    updateMapLanguage(appLang);
  }, [appLang, mapReady, updateMapLanguage]);

  // Handle turbine selection changes
  React.useEffect(() => {
    if (!mapRef.current || !selected) return;

    const { latitude, longitude } = selected;
    console.log('Map zooming to:', { latitude, longitude }); // Debug log
    
    // Validate coordinates before zooming
    if (typeof latitude === 'number' && typeof longitude === 'number' && 
        latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        duration: 1000,
      });
    } else {
      console.warn('Invalid coordinates for map zoom:', { latitude, longitude });
    }
  }, [selected]);

  // Handle turbine overrides (live data updates)
  React.useEffect(() => {
    if (!mapRef.current || !turbines.length) return;

    const updatedTurbines = turbines.map(turbine => {
      const override = turbineOverrides[turbine.id];
      return override ? { ...turbine, ...override } : turbine;
    });

    addTurbinesToMap(updatedTurbines);
  }, [turbines, turbineOverrides, addTurbinesToMap]);

  const handleRetry = () => {
    loadTurbines().then(turbinesData => {
      if (turbinesData.length > 0) {
        addTurbinesToMap(turbinesData);
      }
    });
  };

  return (
    <Box sx={{ position: 'relative', height: height || '100%', width: '100%' }}>
      {/* Map Container */}
      <Box
        ref={ref}
        sx={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <Fade in={loading}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                {t('map.loading')}
              </Typography>
            </Stack>
          </Box>
        </Fade>
      )}

      {/* Error Overlay */}
      {error && !loading && (
        <Fade in={!!error}>
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Alert 
              severity={isBackendError(error) ? "error" : "warning"}
              sx={{
                borderRadius: 2,
                boxShadow: theme.shadows[4],
              }}
            >
              <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isBackendError(error) ? (
                  <CloudOffRounded sx={{ fontSize: 20 }} />
                ) : (
                  <ErrorOutlineRounded sx={{ fontSize: 20 }} />
                )}
                {isBackendError(error) ? t('error.backendDown.title') : t('error.network.title')}
              </AlertTitle>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshRounded />}
                onClick={handleRetry}
                sx={{ mt: 1 }}
              >
                {t('error.actions.retry')}
              </Button>
            </Alert>
          </Box>
        </Fade>
      )}

      {/* Map Ready Indicator (Development Only) */}
      {process.env.NODE_ENV === 'development' && mapReady && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: alpha(theme.palette.success.main, 0.9),
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
            zIndex: 1000,
          }}
        >
          {t('map.ready')} ({turbines.length} {t('map.turbines')})
        </Box>
      )}
    </Box>
  );
}
