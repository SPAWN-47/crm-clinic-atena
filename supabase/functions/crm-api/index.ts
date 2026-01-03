import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hrnmzjkmwiblzaeojety.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE3MzQzMywiZXhwIjoyMDc4NzQ5NDMzfQ.TgYhWKAhoz131B3dtGb50bNA1gEuTCwt4EMp3Ugqbbo'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-crm-api-key',
  'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS',
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

    // Handle POST /api/leads (create/upsert by phone)
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
        
        // Garantir source default - ia, n8n, ou manual
        const leadSource = source === 'ia' || source === 'n8n' || source === 'manual' ? source : 'n8n'

        const leadData = {
          phone,
          name: name || null,
          status: leadStatus,
          source: leadSource,
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
            source: leadSource,
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

    // Handle PATCH /api/leads/:id (update by ID)
    if (req.method === "PATCH" && pathname.match(/\/api\/leads\/[^/]+$/)) {
      try {
        const leadId = pathname.split('/').pop()
        const body = await req.json()
        const { name, phone, email, status } = body

        // Get existing lead first to track changes
        const { data: existingLead, error: findError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .single()

        if (findError || !existingLead) {
          return new Response(
            JSON.stringify({ error: 'Lead not found' }),
            { status: 404, headers: corsHeaders }
          )
        }

        // Build update data with only provided fields
        const updateData = {
          updated_at: new Date().toISOString(),
        }

        // Track what changed for the event payload
        const changes = {}

        if (name !== undefined && name !== existingLead.name) {
          updateData.name = name || null
          changes.name = { from: existingLead.name, to: name || null }
        }

        if (phone !== undefined && phone !== existingLead.phone) {
          updateData.phone = phone
          changes.phone = { from: existingLead.phone, to: phone }
        }

        if (email !== undefined && email !== existingLead.email) {
          updateData.email = email || null
          changes.email = { from: existingLead.email, to: email || null }
        }

        if (status !== undefined && status !== existingLead.status) {
          updateData.status = status ?? 'novo'
          changes.status = { from: existingLead.status, to: status ?? 'novo' }
        }

        // Only update if there are actual changes
        if (Object.keys(changes).length === 0) {
          return new Response(
            JSON.stringify(existingLead),
            { status: 200, headers: corsHeaders }
          )
        }

        // Update the lead
        const { data: updatedLead, error: updateError } = await supabase
          .from('leads')
          .update(updateData)
          .eq('id', leadId)
          .select()
          .single()

        if (updateError) {
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 500, headers: corsHeaders }
          )
        }

        // Register lead_updated event
        const eventPayload = {
          changes,
          previous: {
            name: existingLead.name,
            phone: existingLead.phone,
            email: existingLead.email,
            status: existingLead.status,
          },
          current: {
            name: updatedLead.name,
            phone: updatedLead.phone,
            email: updatedLead.email,
            status: updatedLead.status,
          }
        }

        const { error: eventError } = await supabase
          .from('lead_events')
          .insert({
            lead_id: leadId,
            type: 'lead_updated',
            payload: eventPayload,
            source: 'manual',
            created_at: new Date().toISOString()
          })

        // Log event error but don't fail the request
        if (eventError) {
          console.error('Failed to register event:', eventError)
        }

        return new Response(
          JSON.stringify(updatedLead),
          { status: 200, headers: corsHeaders }
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

