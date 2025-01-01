import { supabase } from "@/integrations/supabase/client";
import { getMemberByMemberId } from "@/utils/memberAuth";

export const handleMemberIdLogin = async (memberId: string) => {
  try {
    console.log("Login attempt with:", { memberId });

    // Get member details from the database
    const member = await getMemberByMemberId(memberId);
    
    if (!member) {
      throw new Error("Member ID not found");
    }

    // Use the member number for authentication
    const email = `${member.member_number.toLowerCase()}@temp.pwaburton.org`;
    
    console.log("Attempting member ID login with:", { memberId, email });

    // Check if user exists
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError && userError.message !== "Auth session missing!") {
      console.error("Error checking user:", userError);
      throw userError;
    }

    if (!user) {
      // If no user exists, sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: member.member_number, // Use member number as password
        options: {
          data: {
            member_id: member.id,
            full_name: member.full_name,
            email_verified: true
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("Failed to create user");
    }

    // Sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: member.member_number
    });

    if (signInError) throw signInError;
    if (!signInData.user) throw new Error("Failed to sign in");

    // Update member record with auth user id if not already set
    if (!member.auth_user_id) {
      const { error: updateError } = await supabase
        .from('members')
        .update({ 
          auth_user_id: signInData.user.id,
          email_verified: true
        })
        .eq('id', member.id);

      if (updateError) {
        console.error("Error updating member auth_user_id:", updateError);
      }
    }

    console.log("Sign in successful");
    return signInData;

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};