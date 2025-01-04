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
        // First check if user is an admin
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (adminRole?.role === 'admin') {
          console.log('User is an admin');
          return 'admin' as UserRole;
        }

        // Then check if user is a collector
        const { data: collectorData } = await supabase
          .from('members_collectors')
          .select('name')
          .eq('member_profile_id', session.user.id)
          .eq('active', true)
          .maybeSingle();

        if (collectorData?.name) {
          console.log('User is a collector:', collectorData.name);
          return 'collector' as UserRole;
        }

        // Finally check if user is a member
        const { data: memberData } = await supabase
          .from('members')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (memberData?.id) {
          console.log('User is a member');
          return 'member' as UserRole;
        }

        console.log('No specific role found, defaulting to member');
        return 'member' as UserRole;

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