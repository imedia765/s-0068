import { supabase } from "@/integrations/supabase/client";

export const signUpUser = async (email: string, password: string) => {
  console.log("Attempting to sign up user with email:", email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/admin`,
    },
  });

  if (error) {
    console.error("Sign up error:", error);
    throw error;
  }

  console.log("Sign up successful:", data);
  return data;
};

export const createUserProfile = async (userId: string, email: string) => {
  console.log("Creating user profile for:", userId);
  
  // First check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (existingProfile) {
    console.log("Profile already exists for user:", userId);
    return existingProfile;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert([{ 
      id: userId, 
      email, 
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Profile creation error:", error);
    throw error;
  }
  console.log("Profile created successfully:", data);
  return data;
};

export const createMember = async (memberData: any, collectorId: string) => {
  console.log("Creating member with data:", { memberData, collectorId });
  
  const memberObject = {
    collector_id: collectorId,
    full_name: memberData.fullName,
    email: memberData.email,
    phone: memberData.mobile,
    address: memberData.address,
    town: memberData.town,
    postcode: memberData.postCode,
    date_of_birth: memberData.dob,
    gender: memberData.gender,
    marital_status: memberData.maritalStatus,
    status: 'pending',
    profile_updated: true
  };

  const { data, error } = await supabase
    .from('members')
    .insert(memberObject)
    .select()
    .single();

  if (error) {
    console.error("Member creation error:", error);
    throw error;
  }

  console.log("Member created successfully:", data);
  return data;
};

export const createRegistration = async (memberId: string) => {
  console.log("Creating registration for member:", memberId);
  
  // Check if registration already exists
  const { data: existingRegistration } = await supabase
    .from('registrations')
    .select()
    .eq('member_id', memberId)
    .single();

  if (existingRegistration) {
    console.log("Registration already exists for member:", memberId);
    return existingRegistration;
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert([{
      member_id: memberId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Registration creation error:", error);
    throw error;
  }
  console.log("Registration created successfully:", data);
  return data;
};