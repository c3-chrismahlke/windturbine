import * as React from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const value = i18n.language?.split('-')[0] || 'en';

  const onChange = (e: SelectChangeEvent<string>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch {}
  };

  return (
    <Select
      size="small"
      value={value}
      onChange={onChange}
      aria-label={t('app.title')}
    >
      <MenuItem value="en">{t('lang.english')}</MenuItem>
      <MenuItem value="es">{t('lang.spanish')}</MenuItem>
      <MenuItem value="zh">{t('lang.mandarin')}</MenuItem>
      <MenuItem value="ar">{t('lang.arabic')}</MenuItem>
    </Select>
  );
}


