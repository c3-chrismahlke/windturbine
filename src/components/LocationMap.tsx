import * as React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: number;
  disabled?: boolean;
}

export default function LocationMap({ 
  latitude, 
  longitude, 
  onLocationChange, 
  height = 300,
  disabled = false 
}: LocationMapProps) {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<mapboxgl.Map | null>(null);
  const crosshairRef = React.useRef<HTMLDivElement>(null);

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
        const center = map.getCenter();
        onLocationChange(center.lat, center.lng);
      };

      map.on('moveend', updateLocation);
      map.on('dragend', updateLocation);

      // Set initial location if provided
      if (latitude !== 0 && longitude !== 0) {
        map.setCenter([longitude, latitude]);
      }

      return () => {
        map.remove();
      };
    };

    initializeMap();
  }, [disabled, latitude, longitude, onLocationChange]);

  // Update map center when coordinates change externally
  React.useEffect(() => {
    if (mapInstanceRef.current && latitude !== 0 && longitude !== 0) {
      mapInstanceRef.current.setCenter([longitude, latitude]);
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
