# 🏗️ ARQUITETURA - Auth v1.1

## 📐 Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    REACT APP (Vite)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  BrowserRouter                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │            AuthProvider                          │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │         Routes                             │  │  │  │
│  │  │  │  ┌─────────────┐  ┌──────────────────┐   │  │  │  │
│  │  │  │  │  /login     │  │  /* (protected)  │   │  │  │  │
│  │  │  │  │ LoginView   │  │   ProtectedRoute │   │  │  │  │
│  │  │  │  │             │  │      ↓           │   │  │  │  │
│  │  │  │  │             │  │   MainApp        │   │  │  │  │
│  │  │  │  │             │  │   - Dashboard    │   │  │  │  │
│  │  │  │  │             │  │   - Funil        │   │  │  │  │
│  │  │  │  │             │  │   - Outros       │   │  │  │  │
│  │  │  │  └─────────────┘  └──────────────────┘   │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE AUTH                             │
│  - JWT Token Management                                      │
│  - Session Storage (localStorage)                            │
│  - auth.users table                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                         │
│  - leads table (público por enquanto)                        │
│  - lead_events table (público por enquanto)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação Detalhado

### 1. Primeira Carga (Cold Start)
```
┌─────────┐
│ Browser │
└────┬────┘
     │
     │ GET /
     ↓
┌─────────────────┐
│  App.jsx        │
│  BrowserRouter  │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│  AuthProvider   │
│  useEffect()    │
└────┬────────────┘
     │
     │ supabase.auth.getSession()
     ↓
┌─────────────────┐
│  Supabase       │
│  Check Session  │
└────┬────────────┘
     │
     ├─ Tem sessão? ──┐
     │                 │
     NO              YES
     │                 │
     ↓                 ↓
[/login]         [Dashboard]
```

### 2. Fluxo de Login
```
┌────────────┐
│ LoginView  │
│ /login     │
└─────┬──────┘
      │
      │ User digita email/senha
      │ Clica "Entrar"
      ↓
┌─────────────────────┐
│ handleSubmit()      │
│ setLoading(true)    │
└─────┬───────────────┘
      │
      │ signIn(email, password)
      ↓
┌─────────────────────┐
│ AuthContext         │
│ signIn()            │
└─────┬───────────────┘
      │
      │ supabase.auth.signInWithPassword()
      ↓
┌─────────────────────┐
│ Supabase Auth       │
│ Validate credentials│
└─────┬───────────────┘
      │
      ├─ Válido? ──┐
      │             │
     YES           NO
      │             │
      ↓             ↓
┌──────────┐   ┌────────────┐
│ Return   │   │ Throw      │
│ JWT      │   │ Error      │
│ Session  │   └─────┬──────┘
└─────┬────┘         │
      │              │
      │              └──→ catch(error)
      │                   setError()
      ↓                   [Mostra erro]
[onAuthStateChange]
      ↓
[setUser(user)]
      ↓
[navigate('/')]
      ↓
[Dashboard]
```

### 3. Fluxo de Proteção de Rotas
```
┌────────────────┐
│ User acessa /  │
└────┬───────────┘
     │
     ↓
┌────────────────┐
│ ProtectedRoute │
└────┬───────────┘
     │
     │ const { user, loading } = useAuth()
     ↓
     │
     ├─ loading? ──┐
     │             │
    YES           NO
     │             │
     ↓             ↓
[<Loader/>]   [user exists?]
                   │
                   ├─ YES → [Render children]
                   │         (Dashboard, Funil, etc)
                   │
                   └─ NO  → [<Navigate to="/login" />]
```

### 4. Fluxo de Logout
```
┌────────────┐
│ Topbar     │
│ onClick    │
└─────┬──────┘
      │
      │ handleLogout()
      ↓
┌─────────────────┐
│ signOut()       │
│ (AuthContext)   │
└─────┬───────────┘
      │
      │ supabase.auth.signOut()
      ↓
┌─────────────────┐
│ Supabase Auth   │
│ Clear session   │
│ Clear JWT       │
└─────┬───────────┘
      │
      ↓
[onAuthStateChange]
      ↓
[setUser(null)]
      ↓
[ProtectedRoute detecta]
      ↓
[<Navigate to="/login" />]
```

### 5. Fluxo de Persistência (Refresh)
```
┌────────────┐
│ User       │
│ F5/Reload  │
└─────┬──────┘
      │
      ↓
┌─────────────────┐
│ AuthProvider    │
│ useEffect()     │
└─────┬───────────┘
      │
      │ supabase.auth.getSession()
      ↓
┌─────────────────────────┐
│ Supabase                │
│ Check localStorage      │
│ for session/JWT         │
└─────┬───────────────────┘
      │
      ├─ Session válida? ──┐
      │                     │
     YES                   NO
      │                     │
      ↓                     ↓
[setUser(user)]      [setUser(null)]
[setLoading(false)]  [setLoading(false)]
      ↓                     ↓
[ProtectedRoute]     [Navigate /login]
      ↓
[Dashboard]
```

---

## 📦 Estrutura de Componentes

```
App.jsx (Root)
├── BrowserRouter
│   └── AuthProvider (Context)
│       └── Routes
│           ├── Route /login (Público)
│           │   └── LoginView
│           │       ├── Form (email, senha)
│           │       ├── Button (Entrar)
│           │       └── Error Display
│           │
│           └── Route /* (Protegido)
│               └── ProtectedRoute
│                   ├── Check loading
│                   ├── Check user
│                   └── MainApp
│                       ├── Sidebar
│                       ├── Topbar
│                       │   ├── Search
│                       │   ├── Bell
│                       │   ├── User Email (NOVO)
│                       │   ├── Novo Paciente
│                       │   └── Logout Button (NOVO)
│                       │
│                       └── Content
│                           ├── DashboardView
│                           ├── FunnelView
│                           └── Other Views
```

---

## 🔄 Estado Global (AuthContext)

```javascript
AuthContext State:
{
  user: {
    id: "uuid",
    email: "admin@clinic.com",
    created_at: "2026-01-03...",
    // ... outros campos do Supabase Auth
  } | null,
  
  session: {
    access_token: "jwt...",
    refresh_token: "jwt...",
    expires_at: timestamp,
    user: { ... }
  } | null,
  
  loading: boolean,
  
  // Métodos:
  signIn: (email, password) => Promise,
  signUp: (email, password) => Promise,
  signOut: () => Promise
}
```

### Onde é Usado:
- **LoginView**: Chama `signIn()`
- **ProtectedRoute**: Verifica `user` e `loading`
- **Topbar**: Usa `user.email` e chama `signOut()`
- **Qualquer componente**: Pode usar `useAuth()` hook

---

## 🗄️ Persistência de Dados

### localStorage (gerenciado pelo Supabase):
```
supabase.auth.token
├── access_token: "eyJhbGc..."
├── refresh_token: "eyJhbGc..."
├── expires_at: 1704283200
└── user: { id, email, ... }
```

### Quando é Salvo:
- ✅ Após login bem-sucedido
- ✅ Após refresh automático do token

### Quando é Limpo:
- ✅ Após logout
- ✅ Quando token expira e refresh falha

---

## 🔐 Tokens JWT

### Access Token:
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user-uuid",
  "email": "admin@clinic.com",
  "role": "authenticated",
  "iat": 1704196800,
  "exp": 1704283200
}

Signature:
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Refresh Token:
- Usado automaticamente pelo Supabase SDK
- Renova access_token quando expira
- Válido por 30 dias (padrão Supabase)

---

## 🔌 Integração com APIs Existentes

### N8N Webhook (Inalterado):
```
POST https://seu-n8n.com/webhook/leads
├── Body: { name, phone, email, ... }
└── Response: 200 OK

↓

Edge Function (crm-api)
├── Valida dados
├── Cria lead em leads table
├── Cria evento em lead_events table
└── Response: { id, ... }

↓

Frontend (Polling/Realtime)
├── useLeads hook detecta novo lead
└── Atualiza UI automaticamente
```

**Status**: ✅ Funciona normalmente (não afetado pela auth)

### Edge Function (Inalterado):
```
POST https://seu-projeto.supabase.co/functions/v1/crm-api
Headers:
├── Content-Type: application/json
└── Authorization: Bearer <anon-key> (ou JWT se autenticado)

Body: { ... }
```

**Status**: ✅ Funciona normalmente

---

## 🎯 Pontos de Extensão (v1.2+)

### 1. RLS (Row Level Security)
```sql
-- Isolar leads por usuário/clínica
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see only their leads"
ON leads
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

### 2. Roles/Perfis
```javascript
// Adicionar campo role ao user
user: {
  id: "uuid",
  email: "admin@clinic.com",
  role: "admin" | "atendente" | "recepcionista"
}

// Proteger rotas por role
<ProtectedRoute requireRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### 3. Multi-tenancy
```sql
-- Adicionar clinic_id às tabelas
ALTER TABLE leads ADD COLUMN clinic_id UUID;
ALTER TABLE auth.users ADD COLUMN clinic_id UUID;

-- RLS por clínica
CREATE POLICY "Users see only their clinic's leads"
ON leads FOR SELECT TO authenticated
USING (clinic_id = (SELECT clinic_id FROM auth.users WHERE id = auth.uid()));
```

---

## 📊 Performance e Otimização

### Loading States:
```
Primeira carga:
├── AuthProvider verifica sessão (100-300ms)
├── ProtectedRoute mostra loader se loading=true
└── Dashboard carrega após user ser definido

Total: ~300-500ms (experiência fluida)
```

### Caching:
- ✅ Sessão em localStorage (instantâneo após primeira carga)
- ✅ Token JWT válido por 1h
- ✅ Refresh token automático

### Network Requests:
```
Login:
1. POST /auth/v1/token (signIn)
   └── Response: access_token, refresh_token

Refresh (a cada ~50min):
1. POST /auth/v1/token?grant_type=refresh_token
   └── Response: novo access_token

Logout:
1. POST /auth/v1/logout
   └── Limpa sessão server-side
```

---

## 🔒 Segurança em Camadas

### 1. Frontend (Client-side):
```
- ProtectedRoute: Previne acesso sem login
- useAuth hook: Centraliza lógica de auth
- Anon key: Limitações do Supabase aplicadas
```

### 2. Supabase Auth:
```
- JWT validation: Token assinado e verificado
- Session management: Tokens gerenciados server-side
- Rate limiting: Proteção contra brute force
```

### 3. Database (v1.2+):
```
- RLS: Isolamento de dados por usuário
- Policies: Regras de acesso granulares
- Audit logs: Rastreamento de ações
```

---

## 🎯 Design Decisions

### Por que React Router?
- ✅ Padrão de mercado
- ✅ Fácil proteção de rotas
- ✅ Suporte a navegação programática
- ✅ Pequeno e performático

### Por que Context API?
- ✅ Nativo do React (sem deps extras)
- ✅ Suficiente para estado de auth
- ✅ Performance adequada
- ✅ Fácil de entender

### Por que Supabase Auth?
- ✅ Já estava no projeto
- ✅ JWT automático
- ✅ Session management completo
- ✅ Sem backend adicional

### Por que NÃO RLS agora?
- ✅ Foco em MVP
- ✅ Não há multi-usuários ainda
- ✅ Simplicidade primeiro
- ✅ Migração gradual

---

## ✅ RESUMO DA ARQUITETURA

**Camada de Apresentação**: React + React Router  
**Camada de Autenticação**: Supabase Auth + Context API  
**Camada de Dados**: Supabase Database (sem RLS por ora)  
**Camada de Integração**: N8N + Edge Functions (inalterados)  

**Segurança**: JWT + Client-side protection  
**Performance**: Session caching + Auto refresh  
**Escalabilidade**: Pronto para RLS e multi-tenancy (v1.2+)  

**Status**: ✅ Arquitetura sólida e pronta para produção

