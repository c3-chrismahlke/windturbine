import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { CssBaseline } from '@mui/material';
import i18n from '@lib/i18n';
import { getDesignTokens } from '../../shared-theme/themePrimitives';

type Mode = 'light' | 'dark' | 'custom';

const ColorModeCtx = createContext<{
  mode: Mode;
  toggle: () => void;
  set: (mode: Mode) => void;
}>({
  mode: 'light',
  toggle: () => {},
  set: () => {},
});

export function useColorMode() {
  return useContext(ColorModeCtx);
}

export default function ColorModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? (localStorage.getItem('mode') as Mode | null)
        : null;
    if (stored) setMode(stored);
  }, []);

  const toggle = () => {
    setMode((m) => {
      let next: Mode;
      if (m === 'light') next = 'dark';
      else if (m === 'dark') next = 'custom';
      else next = 'light';
      
      if (typeof window !== 'undefined') localStorage.setItem('mode', next);
      return next;
    });
  };

  const set = (m: Mode) => {
    setMode(() => {
      if (typeof window !== 'undefined') localStorage.setItem('mode', m);
      return m;
    });
  };

  const isRtl = (i18n.language || 'en').startsWith('ar');

  const cache = useMemo(() => {
    if (isRtl) {
      return createCache({ key: 'mui-rtl', stylisPlugins: [prefixer, rtlPlugin] });
    }
    // LTR: use default cache without custom plugins
    return createCache({ key: 'mui' });
  }, [isRtl]);

  const theme = useMemo(() => {
    const themeType = mode === 'custom' ? 'custom' : 'default';
    const paletteMode = mode === 'custom' ? 'light' : mode; // Custom theme uses light mode as base
    
    const designTokens = getDesignTokens(paletteMode, themeType);
    
    return createTheme({
      direction: isRtl ? 'rtl' : 'ltr',
      ...designTokens,
      // Override for custom theme dark mode
      ...(mode === 'custom' && {
        palette: {
          ...designTokens.palette,
          mode: 'dark', // Force dark mode for custom theme
        },
      }),
    });
  }, [mode, isRtl]);

  return (
    <ColorModeCtx.Provider value={{ mode, toggle, set }}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div dir={isRtl ? 'rtl' : 'ltr'}>{children}</div>
        </ThemeProvider>
      </CacheProvider>
    </ColorModeCtx.Provider>
  );
}
