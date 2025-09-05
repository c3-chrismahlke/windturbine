import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AnchorPopover from '@your-scope/anchor-popover';

export type UserInfo = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
};

export type UserPopoverProps = {
  trigger: React.ReactNode;
  user: UserInfo;
  signOutLabel?: string;
  onSignOut?: () => void;
  width?: number;
};

const roleColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  admin: 'error',
  manager: 'warning',
  operator: 'info',
  technician: 'primary',
  viewer: 'default',
};

export default function UserPopover({
  trigger,
  user,
  signOutLabel = 'Sign out',
  onSignOut,
  width = 280,
}: UserPopoverProps) {
  const name = user.name || user.email || 'User';
  const role = user.role || 'viewer';
  
  return (
    <AnchorPopover
      id="user-popover"
      trigger={trigger}
      paperSx={{ p: 2, width, borderRadius: 0.0, mt: 2 }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={user.image || undefined} alt={name || 'User'} sx={{ width: 64, height: 64 }}>
          {!user.image && (name || 'U').charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {name}
          </Typography>
          {user.email && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                mb: 0.5
              }}
            >
              {user.email}
            </Typography>
          )}
          <Chip
            label={role}
            size="small"
            color={roleColors[role] || 'default'}
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={1}>
        <Button variant="outlined" size="small" onClick={onSignOut}>
          {signOutLabel}
        </Button>
      </Stack>
    </AnchorPopover>
  );
}
