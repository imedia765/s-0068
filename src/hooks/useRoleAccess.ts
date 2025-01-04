import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'member' | 'collector' | 'admin' | null;

const ROLE_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useRoleAccess = () => {
  const { toast } = useToast();

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
        // First check if user is an admin in user_roles
        const { data: adminRoleData, error: adminRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (adminRoleError && adminRoleError.code !== 'PGRST116') {
          console.error('Error checking admin role:', adminRoleError);
          throw adminRoleError;
        }

        if (adminRoleData?.role === 'admin') {
          console.log('User is an admin');
          return 'admin' as UserRole;
        }

        // Check if user is a collector in members_collectors
        const { data: collectorData, error: collectorError } = await supabase
          .from('members_collectors')
          .select('name')
          .eq('member_profile_id', session.user.id)
          .eq('active', true)
          .maybeSingle();

        if (collectorError && collectorError.code !== 'PGRST116') {
          console.error('Error checking collector status:', collectorError);
          throw collectorError;
        }

        console.log('Collector status result:', collectorData);

        if (collectorData?.name) {
          console.log('User is a collector:', collectorData.name);
          return 'collector' as UserRole;
        }

        // Check if user has an explicit member role
        const { data: memberRoleData, error: memberRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'member')
          .maybeSingle();

        if (memberRoleError && memberRoleError.code !== 'PGRST116') {
          console.error('Error checking member role:', memberRoleError);
          throw memberRoleError;
        }

        if (memberRoleData?.role === 'member') {
          console.log('User has explicit member role');
          return 'member' as UserRole;
        }

        // Finally check if user exists in members table
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (memberError && memberError.code !== 'PGRST116') {
          console.error('Error checking members table:', memberError);
          throw memberError;
        }

        if (memberData?.id) {
          console.log('User found in members table');
          return 'member' as UserRole;
        }

        console.log('No role found for user');
        return null;

      } catch (error) {
        console.error('Error determining user role:', error);
        toast({
          title: "Error determining user role",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: ROLE_STALE_TIME,
    retry: 2,
    meta: {
      errorMessage: "Failed to fetch user role"
    }
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