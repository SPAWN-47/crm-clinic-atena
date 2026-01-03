# Teste do Webhook N8N

## 🎯 Objetivo
Testar se o pipeline completo IA → N8N → Supabase → CRM está funcionando.

## 🧪 Teste 1: Via Script

Execute o script de teste:

```bash
./test-n8n-webhook.sh
```

## 🧪 Teste 2: Via curl (manual)

```bash
curl -X POST https://n8n.atenachat.com.br/webhook-test/ia-to-crm \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+5511977777777",
    "name": "Lead Teste N8N",
    "email": "teste.n8n@example.com",
    "notes": "Lead gerado via teste do webhook N8N",
    "interest": "Clareamento dental",
    "origin": "Instagram"
  }'
```

## ✅ Resultado esperado

### 1. Resposta do N8N
- **Status 200 ou 201**
- Body pode variar dependendo da configuração do workflow

### 2. Verificação no CRM
- Lead deve aparecer na view "Funil de Vendas"
- Coluna: "New Leads" (status: novo)
- Source: "ia" ou "n8n"

### 3. Verificação no Supabase
**Tabela `leads`:**
- Novo registro com phone = "+5511977777777"
- name = "Lead Teste N8N"
- status = "novo"
- source = "ia" ou "n8n"

**Tabela `lead_events`:**
- Evento com type = "lead_created"
- source = "ia" ou "n8n"
- payload contendo os dados do lead

## ❌ Possíveis erros

### Erro 401 no N8N
**Sintoma**: Webhook retorna erro ou N8N não consegue criar lead

**Causa**: N8N não está enviando header `Authorization` para a Edge Function

**Solução**: Adicionar header no workflow N8N

1. Abra o workflow no N8N: https://n8n.atenachat.com.br
2. Localize o nó HTTP Request que chama a Edge Function
3. Adicione o header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzM0MzMsImV4cCI6MjA3ODc0OTQzM30.y9WAk4jrRcda42OjDexlgeDZ5Rn3zzLrTtNkiIncZ90
   ```
4. Salve e ative o workflow

### Webhook não responde
**Causa**: Workflow N8N pausado ou desativado

**Solução**: Ativar workflow no dashboard do N8N

## 🔍 Debug detalhado

Se o teste falhar, verifique:

1. **Logs do N8N**
   - Acesse: https://n8n.atenachat.com.br
   - Veja executions do workflow
   - Identifique em qual nó falhou

2. **Logs da Edge Function**
   - Dashboard Supabase → Edge Functions → crm-api → Logs
   - Verifique se a requisição chegou
   - Veja o erro retornado

3. **Tabelas do Supabase**
   - Verifique se há novos registros em `leads`
   - Verifique se há eventos em `lead_events`

## 📝 Checklist pós-teste

- [ ] Webhook N8N responde (200/201)
- [ ] Lead aparece no CRM (Funil)
- [ ] Lead está na tabela `leads`
- [ ] Evento está na tabela `lead_events`
- [ ] Source está correto (ia/n8n)
- [ ] Timeline do lead mostra evento de criação

## ⚠️ Nota importante

O Supabase Functions gateway exige o header `Authorization` mesmo com `verify_jwt = false`.

Se o N8N não enviar esse header, a requisição será bloqueada com erro 401 antes de chegar na Edge Function.

