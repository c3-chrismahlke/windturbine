import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import UserPopover from './src/index';
import ColorModeProvider from '../../src/components/theme/ColorModeProvider';
import '../../src/lib/i18n';

const meta = {
  title: 'Components/UserPopover',
  component: UserPopover,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UserPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

function StoryShell() {
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Admin',
    image: '',
  };
  const [openKey, setOpenKey] = React.useState(0);
  return (
    <ColorModeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 700 }}>Wind Turbine Platform</Box>
            <Box>
              <UserPopover
                trigger={
                  <IconButton aria-label="User">
                    <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                  </IconButton>
                }
                user={user}
                signOutLabel={'Sign out'}
                onSignOut={() => setOpenKey((k) => k + 1)}
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


