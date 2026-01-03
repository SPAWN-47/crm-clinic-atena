# Validação de Produção - v1

## 🚀 Deploy Realizado

**URL de Produção**: https://crm-clinic-atena-nt4ee8kqz-hub-focusmidia.vercel.app  
**Status do Build**: ✅ Sucesso  
**Data**: 2024-01-03

---

## ⚠️ IMPORTANTE: Validação Manual Necessária

Como não posso acessar o navegador diretamente, você precisa validar manualmente os seguintes itens:

### 1. Acesse a URL de Produção

Abra no navegador:
**https://crm-clinic-atena-nt4ee8kqz-hub-focusmidia.vercel.app**

### 2. Verifique Console do Navegador

**Ação**: Abra DevTools (F12) > Console

**O que verificar**:
- [ ] ❌ **SEM erro**: "Missing Supabase environment variables"
- [ ] ❌ **SEM erro**: "Failed to fetch" relacionado ao Supabase
- [ ] ❌ **SEM erro**: 401 Unauthorized
- [ ] ✅ **OK**: Logs de realtime subscription (se aparecerem, é normal)

### 3. Verifique Network Tab

**Ação**: DevTools > Network > Filtre por "supabase"

**O que verificar**:
- [ ] ✅ Requests para `supabase.co` retornam **200 OK**
- [ ] ❌ **SEM erro**: 401 Unauthorized
- [ ] ❌ **SEM erro**: CORS errors

### 4. Validação de Funcionalidades

#### 4.1 App Carrega
- [ ] ✅ App carrega sem tela branca
- [ ] ✅ Sidebar aparece
- [ ] ✅ Topbar aparece
- [ ] ✅ Nenhum erro crítico no console

#### 4.2 Dashboard
- [ ] ✅ Dashboard carrega (sem erro de loading infinito)
- [ ] ✅ Estatísticas aparecem (mesmo que sejam "0")
- [ ] ✅ Gráfico "Fluxo de Pacientes" aparece
- [ ] ✅ Botão "Atualizar" funciona

#### 4.3 Funil de Vendas
- [ ] ✅ Funil carrega (sem erro de loading infinito)
- [ ] ✅ Colunas aparecem (Novos Leads, Agendados, etc.)
- [ ] ✅ Leads aparecem nos cards (se houver leads)
- [ ] ✅ Botão "Atualizar" funciona

#### 4.4 Criação Manual
- [ ] ✅ Clica em "Novo Paciente"
- [ ] ✅ Modal abre
- [ ] ✅ Preenche nome e telefone
- [ ] ✅ Clica em "Salvar Paciente"
- [ ] ✅ Modal fecha
- [ ] ✅ Lead aparece no Funil (em até 15 segundos)

#### 4.5 Timeline
- [ ] ✅ Clica em um lead no Funil
- [ ] ✅ Modal de detalhes abre
- [ ] ✅ Informações do lead aparecem
- [ ] ✅ Timeline de eventos aparece (mesmo que vazia)

---

## 🔍 Troubleshooting

### Se aparecer erro "Missing Supabase environment variables"

**Causa**: `VITE_SUPABASE_ANON_KEY` não está configurada

**Solução**:
1. Acesse: https://vercel.com/hub-focusmidia/crm-clinic-atena/settings/environment-variables
2. Verifique se `VITE_SUPABASE_ANON_KEY` existe
3. Se não existir, adicione:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `<sua-chave-anon-do-supabase>`
   - Environments: Production, Preview, Development
4. Faça novo deploy: `vercel --prod`

### Se aparecer erro 401 Unauthorized

**Causa**: RLS bloqueando ou chave incorreta

**Solução**:
1. Verifique se `VITE_SUPABASE_ANON_KEY` está correta (anon/public, não service_role)
2. Verifique se RLS policies estão aplicadas (executar `supabase/rls_policies.sql`)

### Se Dashboard/Funil não carregam leads

**Causa**: RLS bloqueando ou query incorreta

**Solução**:
1. Verifique console do navegador para erro específico
2. Verifique Network tab para ver resposta do Supabase
3. Execute `supabase/rls_policies.sql` se ainda não executou

---

## 📋 Checklist Final de Validação

Após validar manualmente, marque:

### Deploy
- [ ] Deploy realizado com sucesso
- [ ] URL de produção acessível
- [ ] Build sem erros

### Variáveis de Ambiente
- [ ] `VITE_SUPABASE_URL` configurada
- [ ] `VITE_SUPABASE_ANON_KEY` configurada
- [ ] `VITE_CRM_API_KEY` configurada

### Funcionalidades
- [ ] App carrega sem tela branca
- [ ] Dashboard carrega leads
- [ ] Funil carrega leads
- [ ] Criação manual funciona
- [ ] Timeline funciona

### RLS
- [ ] RLS policies aplicadas no Supabase
- [ ] Frontend consegue ler leads
- [ ] Frontend consegue ler eventos

---

## ✅ Status Final

Após completar a validação manual, confirme:

**v1 está 100% funcional em produção?**
- [ ] Sim
- [ ] Não (descreva o problema)

---

**Validação manual necessária - este arquivo serve como guia de verificação.**

