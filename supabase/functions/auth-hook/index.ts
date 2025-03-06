
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const sendEmailFunctionUrl = `${supabaseUrl}/functions/v1/send-email`
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const appUrl = Deno.env.get('APP_URL') || 'https://bleacherbanter.com'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { type, email } = payload

    // We're only handling login emails in this hook
    if (type === 'MAGICLINKLOGIN') {
      if (!payload.data?.link) {
        throw new Error('Magic link not found in payload')
      }

      // Make sure the link redirects to the app instead of Supabase
      const magicLink = payload.data.link
      
      // Forward to our custom email function
      const response = await fetch(sendEmailFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({
          email,
          template: 'magic_link',
          data: {
            magicLink
          }
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(`Error sending email: ${result.error || response.statusText}`)
      }

      // Return success to indicate we've handled the email
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // For all other event types, just pass through
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing auth hook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
