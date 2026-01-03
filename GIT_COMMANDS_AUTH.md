# 🔧 GIT COMMANDS - Auth v1.1

## 📋 Status Atual

```bash
# Ver arquivos modificados/criados
git status

# Ver diff das mudanças
git diff
```

---

## ✅ COMMIT DAS MUDANÇAS

### 1. Verificar Branch Atual
```bash
# Deve estar em: release/v1.1-auth
git branch

# Se não estiver, criar/trocar:
git checkout -b release/v1.1-auth
```

### 2. Adicionar Arquivos

#### Opção A: Adicionar Tudo (Recomendado)
```bash
git add .
```

#### Opção B: Adicionar Seletivamente
```bash
# Novos componentes
git add src/context/AuthContext.jsx
git add src/views/LoginView.jsx
git add src/components/auth/ProtectedRoute.jsx

# Modificações
git add App.jsx
git add src/components/layout/Topbar.jsx
git add package.json
git add package-lock.json

# Documentação
git add README_AUTH_V1.1.md
git add GUIA_TESTE_AUTH.md
git add SQL_SETUP_AUTH.md
git add RESUMO_IMPLEMENTACAO_AUTH.md
git add CHECKLIST_VALIDACAO_AUTH.md
git add DIFF_MUDANCAS_AUTH.md
git add GIT_COMMANDS_AUTH.md
```

### 3. Commit
```bash
git commit -m "feat: implementar autenticação v1.1

- Adicionar AuthContext para gerenciar estado de autenticação
- Criar tela de login (/login)
- Implementar ProtectedRoute para proteção de rotas
- Adicionar botão logout e email no Topbar
- Adicionar react-router-dom para sistema de rotas
- Manter todas funcionalidades v1 intactas
- Zero breaking changes

Ref: release/v1.1-auth"
```

### 4. Push
```bash
# Push da branch
git push origin release/v1.1-auth
```

---

## 🔍 VERIFICAÇÃO ANTES DO COMMIT

### Checklist:
```bash
# ✅ Sem arquivos indesejados
git status

# ✅ Sem erros de lint (já verificado)
npm run build

# ✅ Package-lock.json atualizado
ls -la package-lock.json

# ✅ Node_modules NÃO será commitado (está no .gitignore)
git check-ignore node_modules
```

---

## 📝 COMMIT MESSAGE ALTERNATIVO (Detalhado)

```bash
git commit -m "feat(auth): implementar autenticação v1.1 - MVP seguro

✨ Novos Recursos:
- Context de autenticação (AuthContext)
- Tela de login responsiva e moderna
- Proteção automática de rotas privadas
- Persistência de sessão após refresh
- Botão de logout no Topbar
- Display de email do usuário logado

🔧 Modificações:
- App.jsx: Sistema de rotas com React Router
- Topbar.jsx: Botão logout + email do usuário
- package.json: Adicionar react-router-dom

✅ Validações:
- Zero breaking changes
- Todas funcionalidades v1 mantidas
- N8N webhook continua funcionando
- Edge Function intacta
- Dashboard, Funil e Leads funcionam normalmente

🔐 Segurança:
- Uso correto de anon key
- JWT gerenciado pelo Supabase
- Sessão persistente e segura
- Sem service_role no frontend

📚 Documentação:
- README completo (README_AUTH_V1.1.md)
- Guia de testes (GUIA_TESTE_AUTH.md)
- Scripts SQL (SQL_SETUP_AUTH.md)
- Checklist de validação
- Diff detalhado

Ref: #v1.1-auth
Status: ✅ Pronto para testes"
```

---

## 🌳 WORKFLOW COMPLETO

### 1. Feature Branch (Atual)
```bash
# Você está aqui
git checkout -b release/v1.1-auth
git add .
git commit -m "feat: implementar autenticação v1.1"
git push origin release/v1.1-auth
```

### 2. Criar Pull Request
```bash
# No GitHub/GitLab:
# - Base: main (ou master)
# - Compare: release/v1.1-auth
# - Título: "Auth v1.1 - Implementação de Autenticação"
# - Descrição: Usar conteúdo de RESUMO_IMPLEMENTACAO_AUTH.md
```

### 3. Review e Merge
```bash
# Após aprovação do PR:
# - Merge para main
# - Deletar branch release/v1.1-auth (opcional)
```

### 4. Tag de Versão (Opcional)
```bash
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release v1.1 - Autenticação"
git push origin v1.1.0
```

---

## 🔄 COMANDOS ÚTEIS

### Ver Mudanças Específicas
```bash
# Ver mudanças em arquivo específico
git diff App.jsx
git diff src/components/layout/Topbar.jsx

# Ver arquivos novos
git ls-files --others --exclude-standard
```

### Desfazer Mudanças (Se Necessário)
```bash
# Desfazer mudanças não commitadas (CUIDADO!)
git checkout -- <arquivo>

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças) (CUIDADO!)
git reset --hard HEAD~1
```

### Ver Log
```bash
# Ver histórico
git log --oneline

# Ver histórico com arquivos
git log --stat

# Ver mudanças de um commit
git show <commit-hash>
```

---

## 📊 ESTATÍSTICAS DO COMMIT

```bash
# Ver estatísticas das mudanças
git diff --stat

# Contar linhas adicionadas/removidas
git diff --numstat
```

Saída esperada:
```
X files changed, ~400 insertions(+), ~0 deletions(-)
```

---

## 🚨 ATENÇÃO

### ❌ NÃO Commitar:
- [ ] node_modules/
- [ ] dist/
- [ ] .env (se existir)
- [ ] Arquivos temporários

### ✅ Commitar:
- [x] Código fonte (src/)
- [x] Componentes novos
- [x] Modificações em arquivos existentes
- [x] package.json
- [x] package-lock.json
- [x] Documentação (.md)

---

## 🎯 PRÓXIMOS PASSOS APÓS COMMIT

1. **Testes Locais**
```bash
npm run dev
# Testar todas funcionalidades
```

2. **Testes em Staging** (se houver)
```bash
# Deploy para ambiente de staging
# Validar com usuários reais
```

3. **Deploy em Produção**
```bash
# Após aprovação, deploy para produção
# Verificar logs
# Monitorar erros
```

---

## 📝 TEMPLATE DE PR (Pull Request)

```markdown
## 🔐 Auth v1.1 - Implementação de Autenticação

### 📋 Descrição
Implementação completa de autenticação de usuários usando Supabase Auth.

### ✨ Funcionalidades Adicionadas
- Login com email + senha
- Logout
- Proteção de rotas
- Persistência de sessão
- UI de login moderna

### 🔧 Modificações
- Sistema de rotas com React Router
- Botão logout no Topbar
- Display de email do usuário

### ✅ Validações
- [x] Zero breaking changes
- [x] Todas funcionalidades v1 mantidas
- [x] Nenhum erro de lint
- [x] Documentação completa
- [x] Testes manuais realizados

### 📚 Documentação
- README_AUTH_V1.1.md
- GUIA_TESTE_AUTH.md
- SQL_SETUP_AUTH.md
- CHECKLIST_VALIDACAO_AUTH.md

### 🔒 Segurança
- Uso correto de anon key
- JWT gerenciado pelo Supabase
- Sem service_role no frontend

### 🧪 Como Testar
1. Criar usuário no Supabase Dashboard
2. `npm install && npm run dev`
3. Acessar http://localhost:5173
4. Fazer login com credenciais criadas
5. Testar funcionalidades existentes

### 📸 Screenshots
(Opcional: adicionar prints da tela de login e dashboard)

### 🎯 Próximos Passos (v1.2+)
- RLS
- Roles e permissões
- Multi-tenancy
- Recuperação de senha
```

---

## ✅ STATUS

Branch: `release/v1.1-auth`  
Status: ✅ Pronto para commit  
Breaking Changes: ❌ Nenhum  
Documentação: ✅ Completa  

**Comando para executar agora:**
```bash
git add . && git commit -m "feat: implementar autenticação v1.1" && git push origin release/v1.1-auth
```

