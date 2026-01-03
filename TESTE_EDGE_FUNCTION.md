# Teste da Edge Function - crm-api

## ✅ Comando correto para testar

Cole este comando no seu terminal (substitua a anon key se necessário):

```bash
curl -X POST https://hrnmzjkmwiblzaeojety.supabase.co/functions/v1/crm-api/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzM0MzMsImV4cCI6MjA3ODc0OTQzM30.y9WAk4jrRcda42OjDexlgeDZ5Rn3zzLrTtNkiIncZ90" \
  -H "x-crm-api-key: x7mbOpMYxMAlHeFF" \
  -d '{"source": "manual", "phone": "11999999999", "name": "Teste Final", "notes": "Teste com auth correta"}'
```

## 🔑 Headers obrigatórios

1. **Authorization**: Bearer + anon key do Supabase (obrigatório pelo gateway)
2. **x-crm-api-key**: Chave de API da aplicação (validação real)
3. **Content-Type**: application/json

## ⚠️ Erros comuns

### ❌ "Missing authorization header"
- **Causa**: Faltou o header `Authorization`
- **Solução**: Incluir `-H "Authorization: Bearer <anon_key>"`

### ❌ "Invalid JWT"
- **Causa**: Usou `SUA_ANON_KEY_AQUI` literal ao invés da chave real
- **Solução**: Substituir pela anon key real (acima)

### ❌ "unauthorized"
- **Causa**: Header `x-crm-api-key` incorreto
- **Solução**: Usar `x7mbOpMYxMAlHeFF`

## ✅ Resposta esperada

```json
{
  "id": "uuid-gerado",
  "name": "Teste Final",
  "phone": "11999999999",
  "email": null,
  "status": "novo",
  "source": "manual",
  "created_at": "2026-01-03T...",
  "updated_at": "2026-01-03T..."
}
```

## 🔍 Verificação no Supabase

Após criar o lead, verifique no Supabase Dashboard:
1. Tabela `leads` deve ter o novo registro
2. Tabela `lead_events` deve ter evento `lead_created` com `source: manual`

## 📌 Nota importante

O Supabase Functions gateway exige o header `Authorization` mesmo com `verify_jwt = false` no `config.toml`.
O gateway não valida o JWT, mas exige que o header exista.

