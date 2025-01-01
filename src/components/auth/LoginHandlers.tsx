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

    // Try to sign in first since most users will be returning users
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: member.member_number
    });

    if (!signInError && signInData.user) {
      console.log("Sign in successful");
      return signInData;
    }

    // If sign in failed because user doesn't exist, create the account
    if (signInError?.message?.includes("Invalid login credentials")) {
      console.log("User doesn't exist, creating account");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: member.member_number,
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

      // Update member record with auth user id
      const { error: updateError } = await supabase
        .from('members')
        .update({ 
          auth_user_id: signUpData.user.id,
          email_verified: true
        })
        .eq('id', member.id);

      if (updateError) {
        console.error("Error updating member auth_user_id:", updateError);
      }

      // Sign in after signup
      const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({
        email,
        password: member.member_number
      });

      if (finalSignInError) throw finalSignInError;
      if (!finalSignInData.user) throw new Error("Failed to sign in after signup");

      console.log("Account created and signed in successfully");
      return finalSignInData;
    }

    // If it's some other error, throw it
    throw signInError;

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};