// src/pages/index.tsx
import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSession, signOut } from 'next-auth/react';
import UserPopover from '@components/UserPopover';
import SettingsPopover from '@components/SettingsPopover';
import AppsPopover from '@components/AppsPopover';
import RoleGuard from '@components/RoleGuard';
import CrudTable from '@components/CrudTable';
import MapboxMap from '@components/MapboxMap';
import { Weather3DayCard } from '@your-scope/weather-card';
import TurbineDetailsCard from '@components/TurbineDetailsCard';
import UserManagement from '@components/UserManagement';
import AnalyticsDashboard from '@components/AnalyticsDashboard';
import { useSelector } from 'react-redux';
import type { RootState } from '@lib/store';
// import ModelViewer from '@components/ModelViewer';

// settings intentionally unused for now
// const settings: string[] = [];

export default function Home() {
  const { data: session } = useSession();
  const selectedId = useSelector((s: RootState) => s.selection.selected?.id || null);
  const selectedTurbine = useSelector((s: RootState) => s.selection.selected);
  // user menu not used for now
  // const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  // Show analytics dashboard only on initial load (when no turbine is selected)
  const [showAnalytics, setShowAnalytics] = React.useState(!selectedId);
  
  // Hide analytics when a turbine is selected
  React.useEffect(() => {
    if (selectedId) {
      setShowAnalytics(false);
    }
  }, [selectedId]);

  // Get user roles from session for UserPopover
  const userRoles = (session?.user as any)?.roles || [];
  const primaryRole = userRoles[0] || 'viewer';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth={false}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Wind Turbine Platform</Typography>
            </Box>
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              <RoleGuard allow={['admin', 'manager']}>
                <AppsPopover>
                  <IconButton size="large" color="inherit" aria-label="Apps">
                    <AppsIcon />
                  </IconButton>
                </AppsPopover>
              </RoleGuard>
              <SettingsPopover>
                <IconButton size="large" color="inherit" aria-label="Settings">
                  <SettingsIcon />
                </IconButton>
              </SettingsPopover>
              <UserPopover
                trigger={
                  <IconButton size="large" color="inherit" aria-label="User menu">
                    <Avatar sx={{ width: 32, height: 32 }} src={session?.user?.image || undefined}>
                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                }
                user={{
                  name: session?.user?.name || 'User',
                  email: session?.user?.email || '',
                  image: session?.user?.image || '',
                  role: primaryRole,
                }}
                onSignOut={() => signOut()}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Navigation</Typography>
          <Divider sx={{ mb: 2 }} />
          {/* Add navigation items here if needed */}
        </Box>
      </Drawer>

      <Container maxWidth={false} sx={{ py: 1 }}>
        <Box sx={{ height: 'calc(100vh - 64px - 16px)', display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1fr' }, gridTemplateRows: { xs: '1fr 220px', md: '1fr 300px' } }}>
          {/* Left combined: spans top+bottom (same width) */}
          <Box sx={{ gridColumn: { xs: '1', md: '1' }, gridRow: '1 / span 2', p: 0, height: '100%', display: 'flex', overflow: 'hidden' }}>
            <Box sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
              {showAnalytics ? (
                <AnalyticsDashboard visible={showAnalytics} />
              ) : (
                <TurbineDetailsCard selectedId={selectedId} />
              )}
            </Box>
          </Box>

          {/* Top middle: Map */}
          <Box sx={{ gridColumn: { xs: '1', md: '2' }, gridRow: '1', border: '1px solid', borderColor: 'divider', p: 0, display: 'flex', height: '100%', overflow: 'hidden' }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <MapboxMap />
            </Box>
          </Box>

          {/* Top right: User Management */}
          <Box sx={{ gridColumn: { xs: '1', md: '3' }, gridRow: '1', border: '1px solid', borderColor: 'divider', height: '100%', overflow: 'hidden' }}>
            <UserManagement />
          </Box>

          {/* Bottom middle: table */}
          <Box sx={{ gridColumn: { xs: '1', md: '2' }, gridRow: '2', height: '100%', display: 'flex', overflow: 'hidden' }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <CrudTable />
            </Box>
          </Box>

          {/* Bottom right: weather */}
          <Box sx={{ gridColumn: { xs: '1', md: '3' }, gridRow: '2', height: '100%', overflow: 'hidden', display: 'flex' }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <Weather3DayCard
                compact
                showTimezone={false}
                days={3}
                lat={selectedTurbine?.latitude ?? 39.8}
                lon={selectedTurbine?.longitude ?? -98.5}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
