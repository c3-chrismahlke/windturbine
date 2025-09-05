import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LanguageMenu from './LanguageMenu';
import ThemeToggle from './theme/ThemeToggle';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import { useSession, signOut } from 'next-auth/react';
import UserPopoverPkg from '@your-scope/user-popover';

export default function AppNav() {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const name = session?.user?.name || session?.user?.email || '';
  const role = (session?.user as any)?.role || ((session?.user as any)?.roles?.[0]) || t('nav.roleUnknown', { defaultValue: 'User' });
  const img = (session?.user as any)?.image as string | undefined;

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', width: '100%', left: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 600 }}>
          {t('app.title')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <LanguageMenu />
          <Tooltip title={t('nav.theme', { defaultValue: 'Theme' })}>
            <ThemeToggle />
          </Tooltip>
          {session ? (
            <UserPopoverPkg
              user={{ name, email: session.user?.email, role, image: img }}
              trigger={
                <Avatar src={img} alt={name || 'User'} sx={{ width: 32, height: 32 }}>
                  {!img && (name || 'U').charAt(0)}
                </Avatar>
              }
              signOutLabel={t('welcome.signOut', { defaultValue: 'Sign out' })}
              onSignOut={() => signOut({ callbackUrl: '/sign-in' })}
            />
          ) : null}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}


