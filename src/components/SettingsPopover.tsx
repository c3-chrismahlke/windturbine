import * as React from 'react';
import Box from '@mui/material/Box';
import ThemeToggle from './theme/ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import SettingsPopoverPkg from '@your-scope/settings-popover';

export default function SettingsPopover({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');
  return (
    <SettingsPopoverPkg
      trigger={<Box>{children}</Box>}
      ThemeControl={<ThemeToggle />}
      LanguageControl={<LanguageSwitcher />}
      titleTheme={t('nav.theme', { defaultValue: 'Theme' })}
      titleLanguage={t('nav.language', { defaultValue: 'Language' })}
    />
  );
}


