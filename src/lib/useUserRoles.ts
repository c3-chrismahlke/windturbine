import { useSession } from 'next-auth/react';

export type Role = 'admin' | 'manager' | 'operator' | 'technician' | 'viewer' | string;

export function useUserRoles() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return { 
      roles: [], 
      isLoading: true, 
      hasRole: () => false,
      canEdit: () => false,
      canDelete: () => false,
    };
  }
  
  const roles = ((session?.user as any)?.roles ?? []) as Role[];
  
  const hasRole = (requiredRoles: Role | Role[]): boolean => {
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.some((role) => rolesArray.includes(role));
  };
  
  const canEdit = (): boolean => {
    return hasRole(['admin', 'manager', 'operator', 'technician']);
  };
  
  const canDelete = (): boolean => {
    return hasRole(['admin', 'manager']);
  };
  
  return {
    roles,
    isLoading: false,
    hasRole,
    canEdit,
    canDelete,
  };
}
