import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { GitHubIcon, SitemarkIcon } from './CustomIcons';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const { t } = useTranslation('common');
  // Email/password removed — GitHub OAuth only

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        {t('signin.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<GitHubIcon />}
          onClick={() => signIn('github', { callbackUrl: '/' })}
        >
          Sign in with GitHub
        </Button>
      </Box>
      <Divider />
    </Card>
  );
}
