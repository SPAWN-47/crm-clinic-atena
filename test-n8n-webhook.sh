#!/bin/bash

# Teste do webhook N8N para CRM
# URL: https://n8n.atenachat.com.br/webhook-test/ia-to-crm

echo "🧪 Testando webhook N8N → CRM..."
echo ""

# Payload simulando dados da IA
PAYLOAD='{
  "phone": "+5511977777777",
  "name": "Lead Teste N8N",
  "email": "teste.n8n@example.com",
  "notes": "Lead gerado via teste do webhook N8N",
  "interest": "Clareamento dental",
  "origin": "Instagram"
}'

echo "📤 Enviando payload para N8N:"
echo "$PAYLOAD" | jq .
echo ""

# Fazer a requisição
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST https://n8n.atenachat.com.br/webhook-test/ia-to-crm \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Separar body e status
HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "📥 Resposta do N8N (Status: $HTTP_STATUS):"
echo "$HTTP_BODY" | jq . 2>/dev/null || echo "$HTTP_BODY"
echo ""

# Verificar resultado
if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 201 ]; then
  echo "✅ Webhook N8N funcionou!"
  echo ""
  echo "🔍 Próximos passos de verificação:"
  echo "1. Verificar se o lead apareceu no CRM (Funil de Vendas)"
  echo "2. Verificar na tabela 'leads' no Supabase Dashboard"
  echo "3. Verificar na tabela 'lead_events' se o evento foi registrado"
  echo "   - Deve ter: source='ia' ou source='n8n'"
  echo "   - Deve ter: type='lead_created'"
else
  echo "❌ Erro no webhook N8N"
  echo ""
  echo "⚠️ Possíveis causas:"
  echo "1. N8N não está conseguindo chamar a Edge Function (401)"
  echo "2. N8N precisa adicionar header Authorization"
  echo "3. Workflow N8N está pausado ou com erro"
  echo ""
  echo "🔧 Solução se for erro 401:"
  echo "No workflow N8N, adicione este header no HTTP Request:"
  echo "  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzM0MzMsImV4cCI6MjA3ODc0OTQzM30.y9WAk4jrRcda42OjDexlgeDZ5Rn3zzLrTtNkiIncZ90"
fi

echo ""

