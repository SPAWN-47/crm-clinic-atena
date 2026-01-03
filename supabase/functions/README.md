# Supabase Edge Functions

## Configuração

As Edge Functions estão configuradas com valores padrão das credenciais do Supabase. Para produção, configure as variáveis de ambiente no Supabase Dashboard.

### Variáveis de Ambiente Necessárias

Para a função `crm-api`, as seguintes variáveis estão configuradas com valores padrão:

1. **CRM_API_KEY** - Chave de API para autenticação das requisições (padrão: `C@nnab1s157`)
2. **SUPABASE_URL** - URL do seu projeto Supabase (já configurado como padrão)
3. **SUPABASE_ANON_KEY** - Chave anônima do Supabase (já configurado como padrão)

**Nota:** Os valores padrão já estão configurados no código. Você pode sobrescrevê-los configurando as variáveis de ambiente no Supabase Dashboard se necessário.

### Como Configurar no Supabase Dashboard (Opcional)

Se quiser sobrescrever os valores padrão:

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Edge Functions** > **Settings**
4. Configure as variáveis de ambiente (opcional, valores padrão já estão configurados):
   - `CRM_API_KEY`: `C@nnab1s157` (já configurado como padrão)
   - `SUPABASE_URL`: `https://hrnmzjkmwiblzaeojety.supabase.co` (já configurado)
   - `SUPABASE_ANON_KEY`: Sua chave anônima (já configurado)

### Ou via CLI do Supabase (Opcional)

```bash
supabase secrets set CRM_API_KEY=C@nnab1s157
supabase secrets set SUPABASE_URL=https://hrnmzjkmwiblzaeojety.supabase.co
supabase secrets set SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### Deploy da Função

```bash
supabase functions deploy crm-api
```

## Endpoints Disponíveis

### POST `/api/leads`
Cria ou atualiza um lead baseado no telefone.

**Headers:**
- `x-crm-api-key: C@nnab1s157`

**Body:**
```json
{
  "phone": "11999999999",
  "name": "Nome do Lead",
  "email": "email@example.com",
  "origin": "Instagram",
  "notes": "Notas sobre o lead"
}
```

### POST `/api/leads/{id}/notes`
Adiciona uma nota a um lead.

**Body:**
```json
{
  "note": "Texto da nota"
}
```

### PATCH `/api/leads/{id}/status`
Atualiza o status de um lead.

**Body:**
```json
{
  "status": "novo_status"
}
```

### POST `/api/appointments`
Cria um agendamento.

**Body:**
```json
{
  "lead_id": "uuid",
  "appointment_date": "2024-01-15",
  "appointment_time": "14:00",
  "type": "Consulta",
  "notes": "Observações"
}
```

