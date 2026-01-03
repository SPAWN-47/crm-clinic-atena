# Migrations - Supabase

## Como Aplicar Migrations

### Opção 1: Via Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo do arquivo de migration
5. Execute a query

### Opção 2: Via Supabase CLI

```bash
# Se você tem Supabase CLI instalado
supabase db push
```

### Opção 3: Via SQL Editor Direto

Copie e cole o SQL diretamente no SQL Editor do Supabase Dashboard.

## Migrations Disponíveis

### `001_create_lead_events.sql`
Cria a tabela `lead_events` para tracking de eventos dos leads.

**Aplicar antes de**: Usar a Edge Function atualizada que registra eventos.

## Ordem de Aplicação

1. `001_create_lead_events.sql` - Base do sistema de eventos

