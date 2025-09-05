import { alpha, PaletteMode } from '@mui/material/styles';

// Cargill Corporate Theme - Inspired by Cargill's brand identity
// Professional green and black color scheme representing agriculture, sustainability, and corporate excellence

export const cargillGreen = {
  50: 'hsl(150, 100%, 97%)',   // Very light green
  100: 'hsl(150, 100%, 94%)',  // Light green
  200: 'hsl(150, 100%, 88%)',  // Lighter green
  300: 'hsl(150, 100%, 80%)',  // Light green
  400: 'hsl(150, 100%, 70%)',  // Medium green
  500: '#008544',              // Cargill Primary Green (Pantone 348 C)
  600: 'hsl(150, 100%, 35%)',  // Darker green
  700: 'hsl(150, 100%, 28%)',  // Dark green
  800: 'hsl(150, 100%, 22%)',  // Very dark green
  900: 'hsl(150, 100%, 15%)',  // Darkest green
};

export const cargillBlack = {
  50: 'hsl(0, 0%, 95%)',       // Very light gray
  100: 'hsl(0, 0%, 90%)',      // Light gray
  200: 'hsl(0, 0%, 80%)',      // Lighter gray
  300: 'hsl(0, 0%, 65%)',      // Light gray
  400: 'hsl(0, 0%, 45%)',      // Medium gray
  500: 'hsl(0, 0%, 30%)',      // Primary gray
  600: 'hsl(0, 0%, 20%)',      // Darker gray
  700: 'hsl(0, 0%, 15%)',      // Dark gray
  800: 'hsl(0, 0%, 8%)',       // Very dark gray
  900: '#000000',              // Cargill Black (Pantone Black 6 C)
};

export const cargillNeutral = {
  50: 'hsl(0, 0%, 98%)',       // Very light neutral
  100: 'hsl(0, 0%, 95%)',      // Light neutral
  200: 'hsl(0, 0%, 90%)',      // Lighter neutral
  300: 'hsl(0, 0%, 80%)',      // Light neutral
  400: 'hsl(0, 0%, 65%)',      // Medium neutral
  500: 'hsl(0, 0%, 50%)',      // Primary neutral
  600: 'hsl(0, 0%, 40%)',      // Darker neutral
  700: 'hsl(0, 0%, 30%)',      // Dark neutral
  800: 'hsl(0, 0%, 15%)',      // Very dark neutral
  900: 'hsl(0, 0%, 8%)',       // Darkest neutral
};

export const cargillSuccess = {
  50: 'hsl(150, 100%, 97%)',
  100: 'hsl(150, 100%, 94%)',
  200: 'hsl(150, 100%, 88%)',
  300: 'hsl(150, 100%, 80%)',
  400: 'hsl(150, 100%, 70%)',
  500: '#008544',              // Cargill Green for success
  600: 'hsl(150, 100%, 35%)',
  700: 'hsl(150, 100%, 28%)',
  800: 'hsl(150, 100%, 22%)',
  900: 'hsl(150, 100%, 15%)',
};

export const cargillWarning = {
  50: 'hsl(45, 100%, 97%)',
  100: 'hsl(45, 100%, 94%)',
  200: 'hsl(45, 100%, 88%)',
  300: 'hsl(45, 100%, 80%)',
  400: 'hsl(45, 100%, 70%)',
  500: 'hsl(45, 100%, 60%)',
  600: 'hsl(45, 100%, 50%)',
  700: 'hsl(45, 100%, 40%)',
  800: 'hsl(45, 100%, 30%)',
  900: 'hsl(45, 100%, 20%)',
};

export const cargillError = {
  50: 'hsl(0, 70%, 97%)',
  100: 'hsl(0, 70%, 94%)',
  200: 'hsl(0, 70%, 88%)',
  300: 'hsl(0, 70%, 80%)',
  400: 'hsl(0, 70%, 70%)',
  500: 'hsl(0, 70%, 60%)',
  600: 'hsl(0, 70%, 50%)',
  700: 'hsl(0, 70%, 40%)',
  800: 'hsl(0, 70%, 30%)',
  900: 'hsl(0, 70%, 20%)',
};

// Cargill Corporate Theme design tokens
export const getCustomDesignTokens = (mode: PaletteMode) => {
  const isDark = mode === 'dark';
  
  return {
    palette: {
      mode,
      primary: {
        light: cargillGreen[300],
        main: cargillGreen[500], // Cargill Primary Green
        dark: cargillGreen[700],
        contrastText: isDark ? cargillNeutral[50] : cargillNeutral[900],
      },
      secondary: {
        light: cargillBlack[300],
        main: cargillBlack[600], // Cargill Black as secondary
        dark: cargillBlack[800],
        contrastText: isDark ? cargillNeutral[50] : cargillNeutral[900],
      },
      info: {
        light: cargillGreen[300],
        main: cargillGreen[500],
        dark: cargillGreen[700],
        contrastText: isDark ? cargillNeutral[50] : cargillNeutral[900],
      },
      warning: {
        light: cargillWarning[300],
        main: cargillWarning[500],
        dark: cargillWarning[700],
        contrastText: isDark ? cargillNeutral[50] : cargillNeutral[900],
      },
      error: {
        light: cargillError[300],
        main: cargillError[500],
        dark: cargillError[700],
        contrastText: isDark ? cargillNeutral[50] : cargillNeutral[900],
      },
      success: {
        light: cargillSuccess[300],
        main: cargillSuccess[500], // Cargill Green for success
        dark: cargillSuccess[700],
        contrastText: isDark ? cargillNeutral[50] : cargillNeutral[900],
      },
      grey: {
        ...cargillNeutral,
      },
      divider: isDark 
        ? alpha(cargillNeutral[700], 0.6) 
        : alpha(cargillNeutral[300], 0.4),
      background: {
        default: isDark ? cargillNeutral[900] : cargillNeutral[50],
        paper: isDark ? cargillNeutral[800] : cargillNeutral[100],
      },
      text: {
        primary: isDark ? cargillNeutral[50] : cargillNeutral[900],
        secondary: isDark ? cargillNeutral[400] : cargillNeutral[600],
      },
      action: {
        hover: isDark 
          ? alpha(cargillGreen[500], 0.1) 
          : alpha(cargillGreen[500], 0.05),
        selected: isDark 
          ? alpha(cargillGreen[500], 0.2) 
          : alpha(cargillGreen[500], 0.1),
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.5px',
        color: isDark ? cargillGreen[300] : cargillGreen[600],
      },
      h2: {
        fontSize: '2.25rem',
        fontWeight: 600,
        lineHeight: 1.2,
        color: isDark ? cargillGreen[300] : cargillGreen[600],
      },
      h3: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.2,
        color: isDark ? cargillGreen[400] : cargillGreen[700],
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.5,
        color: isDark ? cargillGreen[400] : cargillGreen[700],
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: isDark ? cargillGreen[400] : cargillGreen[700],
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: isDark ? cargillGreen[500] : cargillGreen[800],
      },
      subtitle1: {
        fontSize: '1.125rem',
        fontWeight: 500,
        color: isDark ? cargillNeutral[300] : cargillNeutral[700],
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: isDark ? cargillNeutral[400] : cargillNeutral[600],
      },
      body1: {
        fontSize: '0.875rem',
        color: isDark ? cargillNeutral[200] : cargillNeutral[800],
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        color: isDark ? cargillNeutral[300] : cargillNeutral[700],
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: isDark ? cargillNeutral[400] : cargillNeutral[600],
      },
    },
    shape: {
      borderRadius: 6, // Cargill's more conservative, professional corner radius
    },
    shadows: isDark 
      ? [
          'none',
          `0 4px 20px ${alpha(cargillGreen[500], 0.25)}`,
          `0 8px 24px ${alpha(cargillGreen[500], 0.15)}`,
          `0 12px 32px ${alpha(cargillGreen[500], 0.1)}`,
          `0 16px 40px ${alpha(cargillGreen[500], 0.08)}`,
        ]
      : [
          'none',
          `0 4px 20px ${alpha(cargillGreen[500], 0.12)}`,
          `0 8px 24px ${alpha(cargillGreen[500], 0.08)}`,
          `0 12px 32px ${alpha(cargillGreen[500], 0.06)}`,
          `0 16px 40px ${alpha(cargillGreen[500], 0.04)}`,
        ],
  };
};
