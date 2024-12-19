import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProfileFormFields } from "./ProfileFormFields";
import { PasswordFields } from "./PasswordFields";

export const PasswordChangeForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          throw new Error("No authenticated user found");
        }

        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('email', user.email)
          .single();

        if (memberError) {
          console.error("Member data fetch error:", memberError);
          throw memberError;
        }
        
        console.log("Fetched member data:", memberData);
        setUserData(memberData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      
      const updatedData = {
        full_name: String(formData.get('fullName') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        address: String(formData.get('address') || ''),
        town: String(formData.get('town') || ''),
        postcode: String(formData.get('postcode') || ''),
        date_of_birth: String(formData.get('dob') || ''),
        gender: String(formData.get('gender') || ''),
        marital_status: String(formData.get('maritalStatus') || ''),
        password_changed: true,
        profile_updated: true
      };

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) throw passwordError;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { error: updateError } = await supabase
          .from('members')
          .update(updatedData)
          .eq('email', user.email);

        if (updateError) throw updateError;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      navigate("/admin");
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileFormFields userData={userData} isLoading={isLoading} />
        <PasswordFields
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Card>
  );
};