import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AnchorPopover from '@your-scope/anchor-popover';

export type SettingsPopoverProps = {
  trigger: React.ReactNode;
  ThemeControl: React.ReactNode;
  LanguageControl: React.ReactNode;
  width?: number;
  titleTheme?: string;
  titleLanguage?: string;
};

export default function SettingsPopover({
  trigger,
  ThemeControl,
  LanguageControl,
  width = 300,
  titleTheme = 'Theme',
  titleLanguage = 'Language',
}: SettingsPopoverProps) {
  return (
    <AnchorPopover
      id="settings-popover"
      trigger={<Box>{trigger}</Box>}
      paperSx={{ p: 2, width, borderRadius: 0.0, mt: 2 }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{titleTheme}</Typography>
        {ThemeControl}
        <Divider />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{titleLanguage}</Typography>
        {LanguageControl}
      </Stack>
    </AnchorPopover>
  );
}


