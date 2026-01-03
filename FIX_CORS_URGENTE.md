# 🔴 ERRO CORS - Solução Urgente

## Problema
```
Request header field authorization is not allowed by Access-Control-Allow-Headers
```

## Causa
A Edge Function não estava permitindo o header `authorization` no CORS.

## ✅ Correção aplicada

Arquivo: `supabase/functions/crm-api/index.ts`

**Antes:**
```typescript
'Access-Control-Allow-Headers': 'content-type, x-crm-api-key'
```

**Depois:**
```typescript
'Access-Control-Allow-Headers': 'authorization, content-type, x-crm-api-key'
```

## 🚀 Deploy necessário

Execute no terminal:

```bash
supabase functions deploy crm-api
```

## ⏱️ Após o deploy

Aguarde ~30 segundos e teste novamente:
1. Acesse o CRM em produção
2. Clique em "Novo Paciente"
3. Preencha os dados
4. Clique em "Salvar"

✅ Deve funcionar sem erro de CORS.

## 📝 Nota

Este era o último ajuste necessário. O frontend estava enviando o header `Authorization`, mas a Edge Function não estava permitindo no CORS preflight.

