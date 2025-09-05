import * as React from 'react';
import { useSession } from 'next-auth/react';

type Role = 'admin' | 'manager' | 'operator' | 'technician' | 'viewer' | string;

export default function RoleGuard({
  allow,
  children,
  fallback = null,
}: {
  allow: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const roles = ((session?.user as any)?.roles ?? []) as Role[];
  const ok = roles.some((r) => allow.includes(r));
  return <>{ok ? children : fallback}</>;
}


