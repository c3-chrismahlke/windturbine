import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import GridLayout from '@layouts/GridLayout';

const RedocStandalone = dynamic(
  () => import('redoc').then((m) => m.RedocStandalone),
  { ssr: false }
);

export default function ApiDocs() {
  // Point this to your backend spec URL. If your server serves /api/openapi.json, use that.
  const specUrl = 'http://localhost:3000/api/openapi.json';

  return (
    <GridLayout>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        API Documentation
      </Typography>
      <Box sx={{ height: 'calc(100vh - 160px)' }}>
        <RedocStandalone
          specUrl={specUrl}
          options={{
            scrollYOffset: 60,
            theme: { colors: { primary: { main: '#2563eb' } } },
          }}
        />
      </Box>
    </GridLayout>
  );
}
