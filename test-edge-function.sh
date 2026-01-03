#!/bin/bash

# Script para testar a Edge Function corretamente
# O Supabase exige o header Authorization mesmo com verify_jwt=false

curl -X POST https://hrnmzjkmwiblzaeojety.supabase.co/functions/v1/crm-api/api/leads \
  -H "Content-Type: application/json" \
  -H "x-crm-api-key: x7mbOpMYxMAlHeFF" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzM0MzMsImV4cCI6MjA3ODc0OTQzM30.y9WAk4jrRcda42OjDexlgeDZ5Rn3zzLrTtNkiIncZ90" \
  -d '{"phone": "11988888888", "name": "Teste Completo", "source": "manual"}'

echo ""
echo "✅ Se funcionou, você deve ver os dados do lead criado acima"
echo "❌ Se deu erro 401, verifique se o header Authorization está presente"

