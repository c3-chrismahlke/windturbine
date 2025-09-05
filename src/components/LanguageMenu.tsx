import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';

const languages: Array<{ code: string; labelKey: string }> = [
  { code: 'en', labelKey: 'lang.english' },
  { code: 'es', labelKey: 'lang.spanish' },
  { code: 'zh', labelKey: 'lang.mandarin' },
  { code: 'ar', labelKey: 'lang.arabic' },
];

export default function LanguageMenu() {
  const { i18n, t } = useTranslation('common');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const current = (i18n.language || 'en').split('-')[0];

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const selectLang = (code: string) => {
    i18n.changeLanguage(code);
    try { localStorage.setItem('i18nextLng', code); } catch {}
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('nav.language', { defaultValue: 'Language' })}>
        <IconButton
          aria-label={t('nav.language', { defaultValue: 'Language' })}
          aria-controls={open ? 'lang-menu' : undefined}
          aria-haspopup
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpen}
          size="small"
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {languages.map((lng) => {
          const selected = current === lng.code;
          return (
            <MenuItem key={lng.code} onClick={() => selectLang(lng.code)} selected={selected}>
              <ListItemIcon>{selected ? <CheckIcon fontSize="small" /> : <span style={{ width: 24 }} />}</ListItemIcon>
              <ListItemText>{t(lng.labelKey)}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}


