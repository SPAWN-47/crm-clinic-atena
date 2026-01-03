# SQL Statements - Setup Auth v1.1

## 🔐 Criar Usuários de Teste

### Usuário Admin
```sql
-- Criar usuário admin@clinic.com
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

### Usuário Teste
```sql
-- Criar usuário teste@clinic.com
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
  'teste@clinic.com',
  crypt('teste123', gen_salt('bf')),
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

## 🔍 Verificar Usuários Existentes

```sql
-- Listar todos os usuários
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
```

## 🗑️ Deletar Usuário (Se Necessário)

```sql
-- Deletar usuário por email
DELETE FROM auth.users WHERE email = 'admin@clinic.com';
```

## 🔐 RLS - Row Level Security (v1.2+)

### ⚠️ NÃO APLICAR AGORA
Estas queries são para referência futura (v1.2+)

```sql
-- VERIFICAR status do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('leads', 'lead_events');

-- Ver políticas existentes
SELECT * FROM pg_policies WHERE tablename IN ('leads', 'lead_events');
```

### Desabilitar RLS (Se Estiver Ativo)
```sql
-- Desabilitar RLS nas tabelas principais
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events DISABLE ROW LEVEL SECURITY;
```

### Habilitar RLS (Para v1.2+)
```sql
-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler todos os leads
CREATE POLICY "Authenticated users can read all leads"
ON leads
FOR SELECT
TO authenticated
USING (true);

-- Política: Usuários autenticados podem criar leads
CREATE POLICY "Authenticated users can create leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Usuários autenticados podem atualizar leads
CREATE POLICY "Authenticated users can update leads"
ON leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Usuários autenticados podem ler eventos
CREATE POLICY "Authenticated users can read lead events"
ON lead_events
FOR SELECT
TO authenticated
USING (true);

-- Política: Usuários autenticados podem criar eventos
CREATE POLICY "Authenticated users can create lead events"
ON lead_events
FOR INSERT
TO authenticated
WITH CHECK (true);
```

## 🔧 Troubleshooting

### Verificar Se Usuário Foi Criado Corretamente
```sql
SELECT 
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'admin@clinic.com';
```

### Confirmar Email de Usuário Existente
```sql
-- Se o usuário existe mas email_confirmed_at é NULL
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'admin@clinic.com';
```

### Resetar Senha de Usuário
```sql
-- Alterar senha de um usuário existente
UPDATE auth.users 
SET encrypted_password = crypt('novasenha123', gen_salt('bf'))
WHERE email = 'admin@clinic.com';
```

## 📊 Queries Úteis

### Ver Sessões Ativas
```sql
-- Listar sessões ativas (se tabela existir)
SELECT 
  user_id,
  created_at,
  updated_at
FROM auth.sessions
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@clinic.com')
ORDER BY updated_at DESC
LIMIT 10;
```

### Audit Log de Usuários
```sql
-- Ver últimos logins
SELECT 
  id,
  email,
  last_sign_in_at,
  confirmed_at,
  created_at
FROM auth.users
ORDER BY last_sign_in_at DESC NULLS LAST
LIMIT 20;
```

## 🎯 Setup Inicial Recomendado

Execute na ordem:

```sql
-- 1. Verificar se RLS está desabilitado (v1.1 não usa RLS)
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('leads', 'lead_events');

-- 2. Desabilitar RLS se estiver ativo
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events DISABLE ROW LEVEL SECURITY;

-- 3. Criar usuário admin
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

-- 4. Verificar criação
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@clinic.com';
```

## ✅ Status Esperado

Após executar o setup:
- ✅ Usuário `admin@clinic.com` criado
- ✅ Email confirmado (email_confirmed_at não é NULL)
- ✅ RLS desabilitado em leads e lead_events
- ✅ Senha: `clinic123`

Pronto para testar a aplicação! 🚀

