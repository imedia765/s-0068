import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get the JWT token from the authorization header
    const token = authHeader.replace('Bearer ', '')

    // Verify the JWT token and get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !user) {
      console.error('User verification failed:', userError)
      throw new Error('Invalid token')
    }

    // Check if user has admin role
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (rolesError || roles?.role !== 'admin') {
      console.error('Admin check failed:', rolesError)
      throw new Error('Unauthorized - Admin access required')
    }

    // Get the token from the request body
    const { token: githubToken } = await req.json()
    if (!githubToken) {
      throw new Error('No token provided')
    }

    console.log('Verifying GitHub token...')

    // Verify the token works with GitHub API
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

    // Update the secret using the admin API
    const projectRef = Deno.env.get('SUPABASE_PROJECT_REF')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!projectRef || !serviceRoleKey) {
      console.error('Missing required environment variables:', { projectRef: !!projectRef, serviceRoleKey: !!serviceRoleKey })
      throw new Error('Missing required environment variables')
    }

    const secretsApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/secrets`
    console.log('Updating secret at:', secretsApiUrl)
    
    const secretsResponse = await fetch(secretsApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        name: 'GITHUB_PAT',
        value: githubToken
      }])
    })

    const secretsResponseText = await secretsResponse.text()
    console.log('Secrets API response:', secretsResponseText)

    if (!secretsResponse.ok) {
      console.error('Failed to update secret:', secretsResponseText)
      throw new Error('Failed to update GitHub token in Supabase')
    }

    // Log the update
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