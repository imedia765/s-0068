import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { SupportSection } from "@/components/profile/SupportSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [memberNumber, setMemberNumber] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const userEmail = session.user.email;
      if (!userEmail) {
        console.error('No email found in session');
        return;
      }

      // Extract member number from email (assuming format: memberNumber@temp.pwaburton.org)
      const memberNumberMatch = userEmail.match(/^([^@]+)@temp\.pwaburton\.org$/);
      if (memberNumberMatch) {
        const extractedMemberNumber = memberNumberMatch[1].toUpperCase();
        console.log('Extracted member number:', extractedMemberNumber);
        setMemberNumber(extractedMemberNumber);
      } else {
        console.error('Could not extract member number from email:', userEmail);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        const userEmail = session.user.email;
        if (userEmail) {
          const memberNumberMatch = userEmail.match(/^([^@]+)@temp\.pwaburton\.org$/);
          if (memberNumberMatch) {
            setMemberNumber(memberNumberMatch[1].toUpperCase());
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Fetch member profile data using member number
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['member-profile', memberNumber],
    enabled: !!memberNumber,
    queryFn: async () => {
      console.log('Fetching profile for member number:', memberNumber);
      
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          family_members (*),
          collector:collectors (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('member_number', memberNumber)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      if (!data) {
        console.log('No profile found for member number:', memberNumber);
        toast({
          title: "Profile not found",
          description: "No member profile found for this member number.",
          variant: "destructive",
        });
        return null;
      }

      console.log('Found profile:', data);
      return data;
    },
  });

  if (memberLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Member Profile
      </h1>

      <div className="space-y-6">
        <AccountSettingsSection memberData={memberData} />
        <PaymentHistorySection 
          memberId={memberData?.id || ''}
          searchDate={searchDate}
          searchAmount={searchAmount}
          onSearchDateChange={setSearchDate}
          onSearchAmountChange={setSearchAmount}
        />
        <SupportSection />
      </div>
    </div>
  );
}