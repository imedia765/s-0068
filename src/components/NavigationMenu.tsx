import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import { NavLogo } from "./navigation/NavLogo";
import { NavLinks } from "./navigation/NavLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { MobileNav } from "./navigation/MobileNav";

export function NavigationMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(!!session);
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === "SIGNED_IN" && session) {
        setIsLoggedIn(true);
        try {
          const { data: memberData, error: memberError } = await supabase
            .from('members')
            .select('full_name, email')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();

          if (memberError) {
            console.error("Error fetching member data:", memberError);
            throw memberError;
          }

          const userName = memberData?.full_name || memberData?.email || 'User';
          toast({
            title: "Signed in successfully",
            description: `Welcome back, ${userName}!`,
            duration: 3000,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
            duration: 3000,
          });
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        toast({
          title: "Logged out successfully",
          description: "Come back soon!",
          duration: 3000,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <NavLogo />
          <ThemeToggle />
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <NavLogo />
          <NavLinks />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <AuthButtons isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <AuthButtons 
            isLoggedIn={isLoggedIn} 
            handleLogout={handleLogout} 
            className="mr-2"
          />
          <ThemeToggle />
          <MobileNav 
            isLoggedIn={isLoggedIn} 
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
}