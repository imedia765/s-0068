import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'collector' | 'member' | null;

const ROLE_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useRoleAccess = () => {
  const { data: userRole, isLoading: roleLoading, error } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      console.log('Fetching user role from central hook...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('No session found in central role check');
        return null;
      }

      console.log('Session user in central role check:', session.user.id);

      try {
        // First check if user is an admin
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (adminError) throw adminError;

        if (adminRole?.role === 'admin') {
          console.log('User is an admin');
          return 'admin' as UserRole;
        }

        // Then check if user is a collector
        const { data: collectorData, error: collectorError } = await supabase
          .from('members_collectors')
          .select('name')
          .eq('member_profile_id', session.user.id)
          .eq('active', true)
          .maybeSingle();

        if (collectorError) throw collectorError;

        if (collectorData?.name) {
          console.log('User is a collector:', collectorData.name);
          return 'collector' as UserRole;
        }

        // Finally check if user is a member
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (memberError) throw memberError;

        if (memberData?.id) {
          console.log('User is a member');
          return 'member' as UserRole;
        }

        console.log('No role found for user');
        return null;

      } catch (error) {
        console.error('Error determining user role:', error);
        return null;
      }
    },
    staleTime: ROLE_STALE_TIME,
    retry: 1
  });

  const canAccessTab = (tab: string): boolean => {
    console.log('Checking access for tab:', tab, 'User role:', userRole);
    
    if (!userRole) return false;

    switch (userRole) {
      case 'admin':
        return true;
      case 'collector':
        return ['dashboard', 'users'].includes(tab);
      case 'member':
        return tab === 'dashboard';
      default:
        return false;
    }
  };

  return {
    userRole,
    roleLoading,
    error,
    canAccessTab,
  };
};