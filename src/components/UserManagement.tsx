import * as React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Stack,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText as MuiListItemText,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  PeopleRounded as PeopleIcon,
  RefreshRounded as RefreshIcon,
  AdminPanelSettingsRounded as AdminIcon,
  SupervisorAccountRounded as ManagerIcon,
  EngineeringRounded as OperatorIcon,
  BuildRounded as TechnicianIcon,
  VisibilityRounded as ViewerIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@lib/api';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  roles: string[];
  createdAt: string;
}

const roleColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  admin: 'error',
  manager: 'warning',
  operator: 'info',
  technician: 'success',
  viewer: 'default',
};

const roleIcons: Record<string, React.ReactElement> = {
  admin: <AdminIcon fontSize="small" />,
  manager: <ManagerIcon fontSize="small" />,
  operator: <OperatorIcon fontSize="small" />,
  technician: <TechnicianIcon fontSize="small" />,
  viewer: <ViewerIcon fontSize="small" />,
};

const availableRoles = ['admin', 'manager', 'operator', 'technician', 'viewer'];

export default function UserManagement() {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [updating, setUpdating] = React.useState(false);

  // Check permissions
  const userRoles = (session?.user as { roles?: string[] })?.roles || [];
  const canViewUsers = userRoles.includes('admin') || userRoles.includes('manager');
  const canEditRoles = userRoles.includes('admin');
  const canDeleteUsers = userRoles.includes('admin');

  const fetchUsers = React.useCallback(async () => {
    if (!canViewUsers) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<User[]>('/users');
      setUsers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('userManagement.failedToFetch');
      setError(message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [canViewUsers, t]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditRoles = () => {
    if (selectedUser) {
      setSelectedRoles([...selectedUser.roles]);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    console.log('Saving roles for user:', selectedUser.id, 'with roles:', selectedRoles);
    setUpdating(true);
    try {
      console.log('API call payload:', { userId: selectedUser.id, roles: selectedRoles });
      
      const updatedUser = await apiFetch<User>('/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          userId: selectedUser.id,
          roles: selectedRoles
        })
      });
      
      console.log('Updated user received:', updatedUser);

      // Update the user in the local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? updatedUser! : user
      ));

      setEditDialogOpen(false);
      setSelectedUser(null);
      setSelectedRoles([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('userManagement.failedToUpdate');
      setError(message);
      console.error('Error updating user roles:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setUpdating(true);
    try {
      await apiFetch('/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUser.id })
      });
      
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('userManagement.failedToDelete');
      setError(message);
      console.error('Error deleting user:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!canViewUsers) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t('userManagement.noPermission')}
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('userManagement.title')}
        </Typography>
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            <RefreshIcon />
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          {t('userManagement.title')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          size="small"
        >
          {t('userManagement.refresh')}
        </Button>
      </Box>

      {users.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('userManagement.noUsers')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('userManagement.noUsersDescription')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ p: 0 }}>
          {users.map((user) => (
            <ListItem key={user.id} sx={{ px: 2, py: 1.5 }}>
              <ListItemAvatar>
                <Avatar
                  src={user.image || undefined}
                  alt={user.name || user.email || t('userManagement.unknownUser')}
                  sx={{ width: 40, height: 40 }}
                >
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.name || t('userManagement.unknownUser')}
                    </Typography>
                    {(canEditRoles || canDeleteUsers) && (
                      <Tooltip title={t('userManagement.userActions')}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                          sx={{ ml: 'auto' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                }
                secondary={
                  <Box component="div">
                    <Stack spacing={0.5}>
                      {user.email && (
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {t('userManagement.joined')}: {formatDate(user.createdAt)}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {user.roles.map((role) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            color={roleColors[role] || 'default'}
                            icon={roleIcons[role]}
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {canEditRoles && (
          <MenuItem onClick={handleEditRoles}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            {t('userManagement.editRoles')}
          </MenuItem>
        )}
        {canDeleteUsers && (
          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {t('userManagement.deleteUser')}
          </MenuItem>
        )}
      </Menu>

      {/* Edit Roles Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('userManagement.editRolesFor', { name: selectedUser?.name || selectedUser?.email || t('userManagement.unknownUser') })}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>{t('userManagement.roles')}</InputLabel>
            <Select
              multiple
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value as string[])}
              input={<OutlinedInput label={t('userManagement.roles')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      color={roleColors[value] || 'default'}
                      icon={roleIcons[value]}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  <Checkbox checked={selectedRoles.includes(role)} />
                  <MuiListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {roleIcons[role]}
                        <span style={{ textTransform: 'capitalize' }}>{role}</span>
                      </Stack>
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>{t('userManagement.cancel')}</Button>
          <Button 
            onClick={handleSaveRoles} 
            variant="contained" 
            disabled={updating || selectedRoles.length === 0}
          >
            {updating ? t('userManagement.saving') : t('userManagement.saveChanges')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          {t('userManagement.deleteUserTitle')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('userManagement.deleteUserConfirm', { name: selectedUser?.name || selectedUser?.email || t('userManagement.thisUser') })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{t('userManagement.cancel')}</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={updating}
          >
            {updating ? t('userManagement.deleting') : t('userManagement.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
