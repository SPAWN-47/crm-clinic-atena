# Sistema de Eventos de Leads - MVP v1

## 📋 Visão Geral

Sistema simples de tracking de eventos para registrar tudo que acontece com um lead ao longo do tempo. Base para automações, métricas e histórico completo.

## 🗄️ Estrutura da Tabela

### Tabela: `lead_events`

```sql
CREATE TABLE lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  payload JSONB,
  source VARCHAR(20) NOT NULL CHECK (source IN ('ia', 'n8n', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único do evento |
| `lead_id` | UUID (FK) | Referência ao lead relacionado |
| `type` | VARCHAR(50) | Tipo do evento (ver tipos abaixo) |
| `payload` | JSONB | Dados opcionais específicos do evento |
| `source` | VARCHAR(20) | Origem: `ia`, `n8n`, ou `manual` |
| `created_at` | TIMESTAMPTZ | Data/hora de criação do evento |

### Índices

- `idx_lead_events_lead_id` - Busca rápida por lead
- `idx_lead_events_type` - Busca por tipo de evento
- `idx_lead_events_created_at` - Ordenação temporal

---

## 📝 Tipos de Eventos Suportados (v1)

### 1. `lead_created`
**Quando**: Lead é criado pela primeira vez

**Payload**:
```json
{
  "phone": "11999999999",
  "name": "João Silva",
  "status": null,
  "previous_status": null
}
```

**Fonte**: `ia`, `n8n`, ou `manual`

---

### 2. `lead_updated`
**Quando**: Lead existente é atualizado

**Payload**:
```json
{
  "phone": "11999999999",
  "name": "João Silva",
  "status": "agendado",
  "previous_status": null
}
```

**Fonte**: `ia`, `n8n`, ou `manual`

---

### 3. `status_changed`
**Quando**: Status do lead é alterado (futuro)

**Payload**:
```json
{
  "old_status": "novo",
  "new_status": "agendado",
  "changed_by": "system"
}
```

**Fonte**: `ia`, `n8n`, ou `manual`

---

### 4. `message_received`
**Quando**: Mensagem recebida do lead (futuro)

**Payload**:
```json
{
  "message": "Olá, gostaria de agendar uma consulta",
  "channel": "whatsapp",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Fonte**: `ia` ou `n8n`

---

### 5. `message_sent`
**Quando**: Mensagem enviada para o lead (futuro)

**Payload**:
```json
{
  "message": "Olá! Como posso ajudar?",
  "channel": "whatsapp",
  "timestamp": "2024-01-15T10:31:00Z"
}
```

**Fonte**: `ia`, `n8n`, ou `manual`

---

### 6. `appointment_scheduled`
**Quando**: Agendamento criado (futuro)

**Payload**:
```json
{
  "appointment_date": "2024-01-20",
  "appointment_time": "14:00",
  "type": "Consulta",
  "notes": "Primeira consulta"
}
```

**Fonte**: `ia`, `n8n`, ou `manual`

---

### 7. `appointment_cancelled`
**Quando**: Agendamento cancelado (futuro)

**Payload**:
```json
{
  "appointment_date": "2024-01-20",
  "appointment_time": "14:00",
  "reason": "Paciente solicitou remarcação"
}
```

**Fonte**: `ia`, `n8n`, ou `manual`

---

## 🔧 Implementação Atual

### Edge Function: Registro Automático

A Edge Function `crm-api` registra automaticamente:

1. **`lead_created`** - Quando um novo lead é criado
2. **`lead_updated`** - Quando um lead existente é atualizado

**Código**:
```typescript
// Após criar/atualizar lead
const eventType = isNewLead ? 'lead_created' : 'lead_updated'
const eventSource = source === 'ia' || source === 'n8n' ? source : 'n8n'

await supabase
  .from('lead_events')
  .insert({
    lead_id: leadId,
    type: eventType,
    payload: {
      phone,
      name: name || null,
      status: status || null,
    },
    source: eventSource,
    created_at: new Date().toISOString()
  })
```

---

## 📊 Exemplos de Uso

### Buscar Timeline de um Lead

```sql
SELECT 
  type,
  payload,
  source,
  created_at
FROM lead_events
WHERE lead_id = 'uuid-do-lead'
ORDER BY created_at DESC;
```

### Contar Eventos por Tipo

```sql
SELECT 
  type,
  COUNT(*) as count
FROM lead_events
GROUP BY type
ORDER BY count DESC;
```

### Buscar Leads Criados Hoje

```sql
SELECT 
  l.*,
  e.created_at as event_created_at
FROM leads l
INNER JOIN lead_events e ON l.id = e.lead_id
WHERE e.type = 'lead_created'
  AND DATE(e.created_at) = CURRENT_DATE
ORDER BY e.created_at DESC;
```

---

## 🚀 Extensibilidade

### Adicionar Novo Tipo de Evento

1. **Definir o tipo** (ex: `payment_received`)
2. **Criar payload** apropriado
3. **Registrar na Edge Function ou frontend**:

```typescript
await supabase
  .from('lead_events')
  .insert({
    lead_id: leadId,
    type: 'payment_received',
    payload: {
      amount: 500.00,
      method: 'credit_card',
      transaction_id: 'tx_123'
    },
    source: 'n8n',
    created_at: new Date().toISOString()
  })
```

### Registrar Evento Manualmente (Frontend)

```javascript
import { supabase } from '../lib/supabase';

const registerEvent = async (leadId, type, payload, source = 'manual') => {
  const { error } = await supabase
    .from('lead_events')
    .insert({
      lead_id: leadId,
      type,
      payload,
      source,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to register event:', error);
  }
};

// Exemplo: Registrar mudança de status
await registerEvent(
  leadId,
  'status_changed',
  {
    old_status: 'novo',
    new_status: 'agendado',
    changed_by: 'user_123'
  },
  'manual'
);
```

---

## 🔒 Segurança (RLS)

### Policies Implementadas

1. **Service Role**: Pode inserir e ler todos os eventos (para Edge Functions)
2. **Authenticated Users**: Podem ler eventos (para frontend)

### Ajustar Policies (se necessário)

```sql
-- Permitir leitura anônima (se necessário)
CREATE POLICY "Allow anonymous read" ON lead_events
  FOR SELECT
  USING (true);

-- Restringir por tenant (se multi-tenancy)
CREATE POLICY "Restrict by tenant" ON lead_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_events.lead_id
      AND leads.tenant_id = current_setting('app.current_tenant_id')
    )
  );
```

---

## 📈 Casos de Uso Futuros

1. **Timeline de Lead**: Exibir todos os eventos em ordem cronológica
2. **Métricas**: Calcular tempo médio entre eventos, taxa de conversão
3. **Automações**: Trigger ações baseadas em eventos
4. **Auditoria**: Rastrear todas as mudanças em leads
5. **Analytics**: Análise de comportamento e padrões

---

## ✅ Checklist de Validação

- [x] Tabela `lead_events` criada
- [x] Índices para performance
- [x] RLS policies configuradas
- [x] Edge Function registra `lead_created` automaticamente
- [x] Edge Function registra `lead_updated` automaticamente
- [x] Documentação completa dos tipos de eventos
- [x] Exemplos de queries SQL
- [x] Exemplos de código para extensão

---

## 🎯 Objetivo Final

✅ **Cada lead possui uma timeline confiável**  
✅ **Base pronta para automações, métricas e histórico**  
✅ **Código simples, claro e extensível**

---

## 📝 Notas

- **MVP**: Sistema simples, sem triggers complexos
- **Extensível**: Fácil adicionar novos tipos de eventos
- **Performance**: Índices otimizados para queries comuns
- **Segurança**: RLS configurado, ajustável conforme necessário

