import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hrnmzjkmwiblzaeojety.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE3MzQzMywiZXhwIjoyMDc4NzQ5NDMzfQ.TgYhWKAhoz131B3dtGb50bNA1gEuTCwt4EMp3Ugqbbo'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-crm-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Validate API Key - NO JWT validation, but Authorization header is required by Supabase gateway
  const crmApiKey = req.headers.get("x-crm-api-key");
  const EXPECTED_API_KEY = Deno.env.get("CRM_API_KEY") ?? "x7mbOpMYxMAlHeFF";

  if (!crmApiKey || crmApiKey !== EXPECTED_API_KEY) {
    return new Response(
      JSON.stringify({ error: "unauthorized", message: "Invalid or missing X-CRM-API-KEY header" }),
      { status: 401, headers: corsHeaders }
    );
  }

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Only handle POST /api/leads
    if (req.method === "POST" && pathname.endsWith("/api/leads")) {
      try {
        const body = await req.json()
        const { phone, name, source, status, notes } = body

        if (!phone) {
          return new Response(
            JSON.stringify({ error: 'Phone is required' }),
            { status: 400, headers: corsHeaders }
          )
        }

        const { data: existingLead, error: findError } = await supabase
          .from('leads')
          .select('id, status')
          .eq('phone', phone)
          .single()

        if (findError && findError.code !== 'PGRST116') {
          return new Response(
            JSON.stringify({ error: findError.message }),
            { status: 500, headers: corsHeaders }
          )
        }

        // Garantir status default - nunca permitir null
        const leadStatus = status ?? 'novo'

        const leadData = {
          phone,
          name: name || null,
          status: leadStatus,
          updated_at: new Date().toISOString(),
        }

        let leadId
        let result
        let isNewLead = false

        if (existingLead) {
          const { data, error } = await supabase
            .from('leads')
            .update(leadData)
            .eq('id', existingLead.id)
            .select()
            .single()

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 500, headers: corsHeaders }
            )
          }
          leadId = data.id
          result = data
          isNewLead = false
        } else {
          leadData.created_at = new Date().toISOString()
          const { data, error } = await supabase
            .from('leads')
            .insert(leadData)
            .select()
            .single()

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 500, headers: corsHeaders }
            )
          }
          leadId = data.id
          result = data
          isNewLead = true
        }

        // Register event: lead_created or lead_updated
        const eventSource = source === 'ia' || source === 'n8n' || source === 'manual' ? source : 'n8n'
        const eventType = isNewLead ? 'lead_created' : 'lead_updated'
        
        const previousStatus = existingLead?.status || null
        
        const eventPayload = {
          phone,
          name: name || null,
          status: leadStatus,
          previous_status: previousStatus,
        }

        const { error: eventError } = await supabase
          .from('lead_events')
          .insert({
            lead_id: leadId,
            type: eventType,
            payload: eventPayload,
            source: eventSource,
            created_at: new Date().toISOString()
          })

        // Log event error but don't fail the request
        if (eventError) {
          console.error('Failed to register event:', eventError)
        }

        return new Response(
          JSON.stringify(result),
          { status: existingLead ? 200 : 201, headers: corsHeaders }
        )
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message || 'Internal server error' }),
          { status: 500, headers: corsHeaders }
        )
      }
    }

    // Route not found
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: corsHeaders }
    )
  } catch (error) {
    // Global error handler
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})

