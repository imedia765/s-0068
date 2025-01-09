import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Verifying user token...')

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !user) {
      console.error('User verification failed:', userError)
      throw new Error('Invalid token')
    }

    console.log('Checking admin role...')
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (rolesError || roles?.role !== 'admin') {
      console.error('Admin check failed:', rolesError)
      throw new Error('Unauthorized - Admin access required')
    }

    const { token: githubToken } = await req.json()
    if (!githubToken) {
      throw new Error('No token provided')
    }

    console.log('Verifying GitHub token...')
    const githubResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Supabase-Edge-Function'
      }
    })

    if (!githubResponse.ok) {
      console.error('GitHub token verification failed:', await githubResponse.text())
      throw new Error('Invalid GitHub token')
    }

    console.log('GitHub token verified successfully')

    // Use Deno.env.set to update the secret directly
    try {
      Deno.env.set('GITHUB_PAT', githubToken)
      console.log('GitHub token updated in environment')
      
      // Log the successful update
      await supabaseClient.from('git_operations_logs').insert({
        operation_type: 'token_update',
        status: 'completed',
        created_by: user.id,
        message: 'GitHub token updated successfully'
      })

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } catch (envError) {
      console.error('Failed to update environment variable:', envError)
      throw new Error('Failed to update GitHub token')
    }
  } catch (error) {
    console.error('Error in update-github-token:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})