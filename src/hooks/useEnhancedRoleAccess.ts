import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

export const useEnhancedRoleAccess = () => {
  const { toast } = useToast();

  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      console.log('Fetching user roles...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('No authenticated session found');
        return null;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }

      console.log('Fetched roles:', data);
      return data?.role as UserRole | null;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    meta: {
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