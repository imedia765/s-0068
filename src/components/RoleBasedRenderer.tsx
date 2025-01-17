import { ReactNode } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

interface RoleBasedRendererProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAllRoles?: boolean;
  fallback?: ReactNode;
}

const RoleBasedRenderer = ({
  children,
  allowedRoles = [],
  requireAllRoles = false,
  fallback = null
}: RoleBasedRendererProps) => {
  const { hasRole, hasAnyRole } = useRoleAccess();

  // If no roles specified, render children
  if (!allowedRoles.length) return <>{children}</>;

  // Check role access based on requirements
  const hasAccess = requireAllRoles
    ? allowedRoles.every(role => hasRole(role))
    : hasAnyRole(allowedRoles);

  console.log('RoleBasedRenderer access check:', {
    allowedRoles,
    requireAllRoles,
    hasAccess
  });

  return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedRenderer;