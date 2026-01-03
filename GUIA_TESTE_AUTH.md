# Guia Rápido - Testar Autenticação v1.1

## 🚀 Iniciar Aplicação

```bash
npm run dev
```

## 👤 Criar Primeiro Usuário

### Opção 1: Via Supabase Dashboard (Recomendado)
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Authentication** > **Users**
4. Clique em **Add User**
5. Preencha:
   - Email: `admin@clinic.com` (ou qualquer email)
   - Senha: `clinic123` (ou qualquer senha)
   - Auto Confirm User: ✅ **Marcar esta opção**
6. Clique em **Create User**

### Opção 2: Via SQL Editor
```sql
-- No Supabase SQL Editor (SQL Editor > New Query)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@clinic.com',
  crypt('clinic123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  '',
  '',
  '',
  ''
);
```

## 🧪 Fluxo de Teste

### 1. Primeira Execução (Não Logado)
```bash
npm run dev
# Abra http://localhost:5173
# Deve redirecionar automaticamente para /login
```

### 2. Testar Login
- Digite o email criado: `admin@clinic.com`
- Digite a senha: `clinic123`
- Clique em "Entrar"
- **Esperado**: Redirect para dashboard com dados dos leads

### 3. Verificar Sessão Persistente
- Dê refresh na página (F5 ou Cmd+R)
- **Esperado**: Continuar logado, sem redirect para login

### 4. Verificar UI
- ✅ Email deve aparecer no Topbar (ao lado do botão "Novo Paciente")
- ✅ Ícone de logout (LogOut) deve aparecer à direita
- ✅ Todas as funcionalidades devem funcionar normalmente

### 5. Testar Logout
- Clique no ícone de logout (vermelho ao hover)
- **Esperado**: Redirect para `/login` imediatamente

### 6. Testar Proteção de Rotas
- Após logout, tente acessar `http://localhost:5173/`
- **Esperado**: Redirect automático para `/login`

### 7. Testar Credenciais Inválidas
- Na tela de login, digite email/senha incorretos
- **Esperado**: Mensagem de erro vermelha aparece

### 8. Testar Funcionalidades Existentes
Após login bem-sucedido:
- ✅ Dashboard mostra leads
- ✅ Funil de vendas funciona
- ✅ Botão "Novo Paciente" abre modal
- ✅ Criação manual de lead funciona
- ✅ Timeline de eventos aparece

## 🔧 Troubleshooting

### Erro: "Missing Supabase environment variables"
```bash
# Verificar se .env existe
cat .env

# Deve conter:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

### Erro: "Invalid login credentials"
**Causa**: Usuário não existe ou senha incorreta

**Solução**:
1. Verificar no Supabase Dashboard: Authentication > Users
2. Verificar se o email está confirmado (email_confirmed_at não é NULL)
3. Recriar usuário se necessário

### Erro: Leads não aparecem
**Causa Possível**: RLS ativo bloqueando leitura

**Solução Temporária**:
```sql
-- No Supabase SQL Editor
-- Verificar se há políticas RLS:
SELECT * FROM pg_policies WHERE tablename = 'leads';

-- Se houver políticas, desabilitar RLS temporariamente:
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events DISABLE ROW LEVEL SECURITY;
```

### Erro: Página branca após login
**Causa**: Erro no console do browser

**Solução**:
1. Abrir DevTools (F12)
2. Ver console para erros
3. Verificar se todas as dependências foram instaladas:
```bash
npm install
```

## 📊 Console Logs Esperados

### Login bem-sucedido:
```
[Supabase] User signed in: admin@clinic.com
[Leads Hook] Fetching leads...
[Leads Hook] Loaded X leads
```

### Logout:
```
[Supabase] User signed out
```

## ✅ Checklist Final

Antes de considerar concluído, verificar:

- [ ] Login com credenciais válidas funciona
- [ ] Login com credenciais inválidas mostra erro
- [ ] Logout funciona
- [ ] Sessão persiste após refresh
- [ ] Usuário não logado é redirecionado para /login
- [ ] Email aparece no Topbar
- [ ] Botão de logout aparece
- [ ] Dashboard carrega leads normalmente
- [ ] Funil de vendas funciona
- [ ] Criação manual de leads funciona
- [ ] Sem erros no console do browser
- [ ] Sem warnings de React

## 🎯 Credenciais Padrão Sugeridas

Para testes:
```
Email: admin@clinic.com
Senha: clinic123
```

## 🔄 Reset Completo (Se Necessário)

```bash
# Limpar cache do navegador
# Chrome: Cmd+Shift+Delete (Mac) ou Ctrl+Shift+Delete (Win)

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Reiniciar dev server
npm run dev
```

## 📞 Suporte

Se algo não funcionar:
1. Verificar console do browser (F12)
2. Verificar terminal onde rodou `npm run dev`
3. Verificar variáveis de ambiente (.env)
4. Verificar se usuário existe no Supabase

