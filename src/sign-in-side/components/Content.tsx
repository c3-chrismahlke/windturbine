import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { SitemarkIcon } from './CustomIcons';
import { useTranslation } from 'react-i18next';

const itemsKeys = [
  { title: 'content.items.0.title', desc: 'content.items.0.desc', Icon: SettingsSuggestRoundedIcon },
  { title: 'content.items.1.title', desc: 'content.items.1.desc', Icon: ConstructionRoundedIcon },
  { title: 'content.items.2.title', desc: 'content.items.2.desc', Icon: ThumbUpAltRoundedIcon },
  { title: 'content.items.3.title', desc: 'content.items.3.desc', Icon: AutoFixHighRoundedIcon },
];

export default function Content() {
  const { t } = useTranslation('common');
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {itemsKeys.map(({ title, desc, Icon }, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          <Icon sx={{ color: 'text.secondary' }} />
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {t(title)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t(desc)}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
