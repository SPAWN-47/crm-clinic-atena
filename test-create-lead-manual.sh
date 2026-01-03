#!/bin/bash

# Official test script for creating a MANUAL lead
# Uses Supabase Edge Function crm-api with proper Authorization header

echo "🧪 Testing MANUAL lead creation..."
echo ""

curl -X POST "https://hrnmzjkmwiblzaeojety.supabase.co/functions/v1/crm-api/api/leads" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzM0MzMsImV4cCI6MjA3ODc0OTQzM30.y9WAk4jrRcda42OjDexlgeDZ5Rn3zzLrTtNkiIncZ90" \
  -H "X-CRM-API-KEY: x7mbOpMYxMAlHeFF" \
  -d '{
    "phone": "11999996666",
    "name": "Teste Manual",
    "source": "manual",
    "status": "novo"
  }'

echo ""
echo ""
echo "✅ Test completed. Check CRM dashboard for new lead with MANUAL badge."

