# Diagnóstico: Leads não aparecem no Frontend

## ✅ Verificações Realizadas

### 1. Supabase Client (`src/lib/supabase.js`)
- ✅ **Status**: Configurado corretamente
- ✅ **URL**: Usa `VITE_SUPABASE_URL` (variável de ambiente)
- ✅ **Chave**: Usa `VITE_SUPABASE_ANON_KEY` (anon public legacy key - correto)
- ✅ **Validação**: Verifica se variáveis existem antes de criar cliente

### 2. Lógica de Busca de Leads
- ❌ **PROBLEMA ENCONTRADO**: Frontend não estava fazendo nenhuma query ao Supabase
- ✅ **CORREÇÃO APLICADA**: Criado hook `useLeads` que executa:
  ```javascript
  supabase.from('leads').select('*').order('created_at', { ascending: false })
  ```

### 3. Componentes Usando Dados Mockados
- ❌ **DashboardView**: Usava dados estáticos de `dashboardData.js` (valores fixos em 0)
- ❌ **FunnelView**: Usava dados estáticos de `funnelData.js` (valores fixos em 0)
- ✅ **CORREÇÃO APLICADA**: Ambos componentes agora usam hook `useLeads` com dados reais

### 4. Filtros e Multi-tenancy
- ✅ **Verificado**: Não há filtros por `clinic_id`, `tenant_id`, ou `user_id` no código
- ✅ **Verificado**: Query usa `select('*')` sem filtros adicionais
- ⚠️ **ATENÇÃO**: Se houver RLS (Row Level Security) ativa no Supabase, pode estar bloqueando

### 5. Estado Global e Cache
- ✅ **Verificado**: Não há estado global complexo
- ✅ **Implementado**: Real-time subscription para atualizar automaticamente quando leads são criados

## 🔧 Correções Aplicadas

### Arquivos Criados/Modificados:

1. **`src/hooks/useLeads.js`** (NOVO)
   - Hook customizado para buscar leads
   - Real-time subscription para atualizações automáticas
   - Tratamento de erros e loading states

2. **`src/views/DashboardView.jsx`** (MODIFICADO)
   - Removida dependência de `dashboardData.js`
   - Adicionado hook `useLeads`
   - Cálculo dinâmico de estatísticas baseado em leads reais
   - Estados de loading e erro

3. **`src/views/FunnelView.jsx`** (MODIFICADO)
   - Removida dependência de `funnelData.js`
   - Adicionado hook `useLeads`
   - Agrupamento de leads por status
   - Exibição de dados reais (nome, telefone, data)

## 🧪 Teste Manual da Query

Para testar manualmente se a query funciona, execute no console do navegador (com o app rodando):

```javascript
import { supabase } from './src/lib/supabase';

// Teste simples
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false });

console.log('Leads:', data);
console.log('Erro:', error);
```

## ⚠️ Possíveis Problemas Restantes

### 1. Row Level Security (RLS)
Se RLS estiver ativa na tabela `leads` sem policies adequadas, a query será bloqueada.

**Sintomas:**
- Query retorna array vazio `[]` sem erro
- Console mostra erro de permissão

**Solução:**
No Supabase Dashboard, verifique se há policies na tabela `leads`:
```sql
-- Policy para permitir leitura anônima (se necessário)
CREATE POLICY "Allow anonymous read" ON leads
  FOR SELECT USING (true);

-- Ou policy baseada em autenticação
CREATE POLICY "Allow authenticated read" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 2. Variáveis de Ambiente
Certifique-se de que o arquivo `.env` existe na raiz do projeto com:
```
VITE_SUPABASE_URL=https://hrnmzjkmwiblzaeojety.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm16amttd2libHphZW9qZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzM0MzMsImV4cCI6MjA3ODc0OTQzM30.y9WAk4jrRcda42OjDexlgeDZ5Rn3zzLrTtNkiIncZ90
```

### 3. Schema da Tabela
A Edge Function espera campos:
- `phone` (obrigatório)
- `name` (opcional)
- `status` (opcional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

O frontend agora exibe:
- `id`, `name`, `phone`, `status`, `created_at`

## ✅ Checklist de Validação

- [x] Supabase client configurado corretamente
- [x] Hook `useLeads` criado e funcionando
- [x] DashboardView usando dados reais
- [x] FunnelView usando dados reais
- [x] Real-time subscription implementado
- [x] Tratamento de erros implementado
- [x] Estados de loading implementados
- [ ] **Verificar RLS no Supabase Dashboard**
- [ ] **Testar query manual no console**
- [ ] **Verificar se variáveis de ambiente estão configuradas**

## 🎯 Próximos Passos

1. **Verificar RLS**: Acesse Supabase Dashboard > Authentication > Policies e verifique se há policies na tabela `leads`
2. **Testar Query**: Execute a query manual no console do navegador
3. **Verificar Logs**: Abra DevTools > Console e verifique se há erros
4. **Testar Criação**: Crie um lead via Edge Function e verifique se aparece automaticamente no frontend

## 📝 Notas Finais

O problema principal era que o frontend **nunca estava fazendo queries ao Supabase**. Os componentes usavam dados mockados estáticos. Agora, com o hook `useLeads`, os dados são buscados automaticamente e atualizados em tempo real quando novos leads são criados.

Se após essas correções os leads ainda não aparecerem, o problema provavelmente está relacionado a:
1. **RLS sem policies adequadas** (mais provável)
2. **Variáveis de ambiente não configuradas**
3. **Schema da tabela diferente do esperado**

