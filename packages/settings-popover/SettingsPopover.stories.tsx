import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsPopover from './src/index';
import ThemeToggle from '../../src/components/theme/ThemeToggle';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';
import ColorModeProvider from '../../src/components/theme/ColorModeProvider';
import { useTranslation } from 'react-i18next';
import '../../src/lib/i18n';

const meta = {
  title: 'Components/SettingsPopover',
  component: SettingsPopover,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SettingsPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

function StoryShell() {
  const { t } = useTranslation('common');
  return (
    <ColorModeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 700 }}>Wind Turbine Platform</Box>
            <Box>
              <SettingsPopover
                trigger={
                  <IconButton aria-label="Settings">
                    <SettingsIcon />
                  </IconButton>
                }
                ThemeControl={<ThemeToggle />}
                LanguageControl={<LanguageSwitcher />}
                titleTheme={t('nav.theme', { defaultValue: 'Theme' })}
                titleLanguage={t('nav.language', { defaultValue: 'Language' })}
              />
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, color: 'text.secondary' }}>Content area</Box>
      </Box>
    </ColorModeProvider>
  );
}

export const Basic: Story = {
  render: () => <StoryShell />,
};


