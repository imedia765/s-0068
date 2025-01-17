import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

export const useEnhancedRoleAccess = () => {
  const { toast } = useToast();

  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log('No authenticated session found');
          return null;
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching roles:', roleError);
          throw roleError;
        }

        console.log('Fetched roles:', roleData);
        return roleData?.role as UserRole | null;
      } catch (err) {
        console.error('Role fetch error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: 'Failed to load user roles',
      onError: (error: Error) => {
        console.error('Role loading error:', error);
        toast({
          title: "Error loading roles",
          description: "There was a problem loading user roles. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  return {
    userRole: roles,
    isLoading,
    error,
  };
};