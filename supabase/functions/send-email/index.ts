
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { renderAsync } from 'npm:@react-email/render@0.0.7'
import { Resend } from 'npm:resend@1.0.0'
import { MagicLinkEmail } from './_templates/magic-link.tsx'

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const domain = Deno.env.get('APP_DOMAIN') || 'bleacherbanter.com'
const fromEmail = `noreply@${domain}`

const resend = resendApiKey ? new Resend(resendApiKey) : null

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Verify this is a POST request
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Check if Resend API key is configured
  if (!resendApiKey || !resend) {
    console.error('Resend API key not configured')
    return new Response(
      JSON.stringify({ 
        error: 'Email service not configured', 
        message: 'Please configure the RESEND_API_KEY in Supabase secrets'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Parse the request body
    const {
      email,
      template,
      data
    } = await req.json()

    if (!email || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email and template' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let html = ''
    let subject = ''

    // Handle different email templates
    if (template === 'magic_link') {
      if (!data.magicLink) {
        return new Response(
          JSON.stringify({ error: 'Missing required data: magicLink' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Render the magic link email template
      html = await renderAsync(
        MagicLinkEmail({
          magicLink: data.magicLink,
          host: domain
        })
      )
      subject = 'Login to Bleacher Banter'
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported template: ${template}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send the email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `Bleacher Banter <${fromEmail}>`,
      to: [email],
      subject,
      html
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return new Response(
        JSON.stringify({ error: emailError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
