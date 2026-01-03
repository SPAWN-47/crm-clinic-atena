# 🧪 Scripts de Teste - Edge Function CRM API

## Visão Geral

Estes scripts permitem testar a criação de leads via Edge Function do Supabase com os headers de autenticação corretos configurados.

## Arquivos Disponíveis

### 1️⃣ `test-create-lead-manual.sh`
Cria um lead com origem **MANUAL**
- Badge exibido: 🖊️ MANUAL (roxo)
- Uso: Simular criação manual de lead pela equipe

### 2️⃣ `test-create-lead-ia.sh`
Cria um lead com origem **IA**
- Badge exibido: 🤖 IA (azul)
- Uso: Simular leads criados por automação/N8N

## Como Usar

### Executar os testes:

```bash
# Testar lead MANUAL
./test-create-lead-manual.sh

# Testar lead IA
./test-create-lead-ia.sh
```

### Verificar no CRM:
1. Abra o dashboard do CRM
2. Verifique a lista de leads
3. Confirme o badge correto (MANUAL ou IA)
4. Verifique a timeline do lead

## Configuração Técnica

### Headers Necessários:
- `Content-Type: application/json`
- `Authorization: Bearer <anon_key>` ⚠️ **Obrigatório** mesmo com `verify_jwt = false`
- `X-CRM-API-KEY: x7mbOpMYxMAlHeFF`

### Endpoint:
```
POST https://hrnmzjkmwiblzaeojety.supabase.co/functions/v1/crm-api/api/leads
```

### Payload Exemplo:
```json
{
  "phone": "11999996666",
  "name": "Nome do Lead",
  "source": "manual", // ou "ia", "whatsapp", "facebook", etc.
  "status": "novo"
}
```

## Códigos de Origem (source)

| Código | Badge | Cor | Uso |
|--------|-------|-----|-----|
| `manual` | 🖊️ MANUAL | Roxo | Criação manual pela equipe |
| `ia` | 🤖 IA | Azul | Automação/N8N |
| `whatsapp` | 💬 WHATSAPP | Verde | WhatsApp API |
| `facebook` | 📘 FACEBOOK | Azul Facebook | Facebook Ads |
| `instagram` | 📸 INSTAGRAM | Rosa | Instagram DM |
| `google` | 🔍 GOOGLE | Vermelho | Google Ads |
| `site` | 🌐 SITE | Cinza | Formulário do site |
| `indicacao` | 👥 INDICAÇÃO | Amarelo | Indicação de paciente |

## Integração N8N

Para usar esses modelos no N8N:

1. **Copie o comando curl completo**
2. **No N8N, use o nó HTTP Request**
3. **Configure:**
   - Method: POST
   - URL: `https://hrnmzjkmwiblzaeojety.supabase.co/functions/v1/crm-api/api/leads`
   - Headers:
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer eyJhbGc...` (anon key completa)
     - `X-CRM-API-KEY`: `x7mbOpMYxMAlHeFF`
   - Body: JSON do payload

## Troubleshooting

### Erro 401 Unauthorized
- ✅ Verifique se o header `Authorization` está presente
- ✅ Confirme que está usando a anon key correta
- ✅ Verifique se a API key `X-CRM-API-KEY` está correta

### Erro 500 Internal Server Error
- ✅ Verifique os logs da Edge Function no Supabase Dashboard
- ✅ Confirme que o payload JSON está válido
- ✅ Verifique se o campo `source` é um valor válido

### Lead não aparece no CRM
- ✅ Aguarde alguns segundos (realtime pode ter delay)
- ✅ Recarregue a página do CRM
- ✅ Verifique se o status é "novo" ou se foi filtrado

## Notas Importantes

⚠️ **Não altere** estes scripts sem testar em ambiente de desenvolvimento

⚠️ **Não commite** chaves de API reais em repositórios públicos

✅ **Use** estes scripts como templates para novos testes

✅ **Mantenha** a documentação atualizada ao adicionar novos sources

## Histórico

- **v1.2.3**: Scripts oficiais criados com Authorization header configurado
- **Commit**: `chore: add official curl test scripts for lead creation`

