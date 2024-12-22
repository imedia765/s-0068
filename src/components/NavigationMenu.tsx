import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Users, Database, MessageSquare, CreditCard, Home } from "lucide-react";

export const NavigationMenu = () => {
  const { isLoggedIn } = useAuth();

  const { data: userRole, error: roleError } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!isLoggedIn) return null;
      
      // First get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        return null;
      }
      
      if (!user) {
        console.log("No user found");
        return null;
      }

      console.log("Fetching role for user:", user.id);
      
      // Then fetch their profile using their ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }

      console.log("Profile data:", profile);
      return profile?.role || null;
    },
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (roleError) {
      console.error("Error fetching user role:", roleError);
    }
  }, [roleError]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/admin/profile" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link to="/admin/members" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Members</span>
                </Link>
                <Link to="/admin/collectors" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Collectors</span>
                </Link>
                <Link to="/admin/finance" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Finance</span>
                </Link>
                <Link to="/admin/support" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Support</span>
                </Link>
                <Link to="/admin/database" className="text-gray-800 hover:text-gray-600 flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database</span>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                {userRole && (
                  <Badge variant="outline" className="capitalize">
                    {userRole}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-800 hover:text-gray-600">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};