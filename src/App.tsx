import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useAuthSession } from "@/hooks/useAuthSession";
import ProtectedRoutes from "@/components/routing/ProtectedRoutes";
import { useEnhancedRoleAccess } from "@/hooks/useEnhancedRoleAccess";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { session, loading: sessionLoading } = useAuthSession();
  const { isLoading: rolesLoading, error: rolesError } = useEnhancedRoleAccess();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const logState = useCallback(() => {
    console.log('App render state:', { 
      sessionLoading, 
      rolesLoading, 
      hasSession: !!session,
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [sessionLoading, rolesLoading, session, location.pathname]);

  useEffect(() => {
    logState();
  }, [logState]);

  const handleSessionCheck = useCallback(() => {
    if (!sessionLoading) {
      console.log('Session check complete:', {
        hasSession: !!session,
        currentPath: location.pathname,
        timestamp: new Date().toISOString()
      });

      if (!session && location.pathname !== '/login') {
        console.log('No session detected, redirecting to login');
        navigate('/login', { replace: true });
      } else if (session && location.pathname === '/login') {
        console.log('Session detected on login page, redirecting to dashboard');
        navigate('/', { replace: true });
      }
    }
  }, [session, sessionLoading, navigate, location.pathname]);

  useEffect(() => {
    handleSessionCheck();
  }, [handleSessionCheck]);

  useEffect(() => {
    if (session) {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    }
  }, [session]);

  const showError = useCallback(() => {
    if (rolesError) {
      console.error('Role loading error:', rolesError);
      toast({
        title: "Error loading roles",
        description: "There was a problem loading user roles. Please try again.",
        variant: "destructive",
      });
    }
  }, [rolesError, toast]);

  useEffect(() => {
    showError();
  }, [showError]);

  const showLoading = useMemo(() => 
    (sessionLoading || (session && rolesLoading)) && location.pathname !== '/login',
    [sessionLoading, session, rolesLoading, location.pathname]
  );
  
  if (showLoading) {
    console.log('Showing loading state:', {
      sessionLoading,
      rolesLoading,
      pathname: location.pathname
    });
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark">
        <Loader2 className="w-8 h-8 animate-spin text-dashboard-accent1" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedRoutes session={session} />} />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;