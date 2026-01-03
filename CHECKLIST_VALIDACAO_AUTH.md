# ✅ CHECKLIST DE VALIDAÇÃO - Auth v1.1

## 🎯 Antes de Começar

- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Usuário criado no Supabase (admin@clinic.com)
- [ ] `npm install` executado
- [ ] `npm run dev` rodando

---

## 🔐 TESTES DE AUTENTICAÇÃO

### Login
- [ ] Acessar http://localhost:5173 redireciona para /login
- [ ] Tela de login aparece com design correto
- [ ] Form tem campos email e senha
- [ ] Botão "Entrar" aparece

### Login - Credenciais Inválidas
- [ ] Digitar email inválido mostra erro
- [ ] Digitar senha errada mostra erro
- [ ] Mensagem de erro é clara e visível
- [ ] Botão fica desabilitado durante loading
- [ ] Ícone de loading aparece

### Login - Credenciais Válidas
- [ ] Login com admin@clinic.com / clinic123 funciona
- [ ] Redirect para dashboard acontece automaticamente
- [ ] Dashboard carrega completamente
- [ ] Nenhum erro no console do browser

### Persistência de Sessão
- [ ] Dar refresh (F5) mantém usuário logado
- [ ] Fechar e reabrir aba mantém sessão
- [ ] Nenhum flicker de tela ao carregar

### Logout
- [ ] Botão de logout aparece no Topbar (ícone LogOut)
- [ ] Hover no botão fica vermelho
- [ ] Clicar logout funciona
- [ ] Redirect para /login acontece
- [ ] Não consegue voltar para dashboard sem login

### Proteção de Rotas
- [ ] Sem login, acessar / redireciona para /login
- [ ] Sem login, nenhuma rota interna é acessível
- [ ] Com login, todas as rotas funcionam

---

## 🎨 TESTES DE UI/UX

### Tela de Login
- [ ] Design consistente com tema do CRM
- [ ] Logo/ícone aparece
- [ ] Título "CRM Clinic Atena" aparece
- [ ] Form centralizado e bem espaçado
- [ ] Campos têm labels claros
- [ ] Botão tem bom contraste
- [ ] Versão v1.1 aparece no rodapé

### Topbar
- [ ] Email do usuário aparece (admin@clinic.com)
- [ ] Email tem ícone de usuário
- [ ] Botão logout aparece à direita
- [ ] Botão "Novo Paciente" continua funcionando
- [ ] Busca continua funcionando
- [ ] Notificações continuam funcionando

### Loading States
- [ ] Loading inicial não causa flicker
- [ ] Loading do login mostra spinner
- [ ] Loading do login desabilita form
- [ ] Texto muda para "Entrando..."

---

## 📊 TESTES DE FUNCIONALIDADES EXISTENTES

### Dashboard
- [ ] Leads aparecem normalmente
- [ ] Cards de estatísticas funcionam
- [ ] Gráficos carregam
- [ ] Filtros funcionam
- [ ] Scroll funciona
- [ ] Performance mantida

### Funil de Vendas
- [ ] Funil carrega
- [ ] Stages aparecem
- [ ] Leads em cada stage visíveis
- [ ] Drag and drop funciona (se implementado)
- [ ] Timeline de lead funciona

### Criação Manual de Lead
- [ ] Botão "Novo Paciente" abre modal
- [ ] Form aparece corretamente
- [ ] Validação funciona
- [ ] Submit cria lead
- [ ] Lead aparece no dashboard
- [ ] Modal fecha após sucesso

### Timeline de Eventos
- [ ] Timeline carrega ao abrir lead
- [ ] Eventos aparecem em ordem
- [ ] Timestamps corretos
- [ ] Ícones aparecem
- [ ] Scroll funciona

---

## 🔧 TESTES TÉCNICOS

### Console do Browser (F12)
- [ ] Nenhum erro durante login
- [ ] Nenhum erro durante navegação
- [ ] Nenhum warning de React
- [ ] Nenhum erro de CORS
- [ ] Requests do Supabase funcionam

### Network Tab
- [ ] Request de login retorna 200
- [ ] Token JWT é recebido
- [ ] Requests para leads funcionam
- [ ] Edge Function responde (se testado)

### Performance
- [ ] Login é rápido (< 2s)
- [ ] Dashboard carrega rápido
- [ ] Nenhum lag ao navegar
- [ ] Refresh é rápido

---

## 🌐 TESTES DE INTEGRAÇÃO

### N8N Webhook
- [ ] Webhook continua criando leads
- [ ] Leads do N8N aparecem no dashboard
- [ ] Campos são preenchidos corretamente
- [ ] Eventos são criados

### Edge Function
- [ ] Edge Function responde
- [ ] CORS funciona
- [ ] Dados são salvos corretamente
- [ ] Sem erros no Supabase Logs

---

## 🔒 TESTES DE SEGURANÇA

### Tokens
- [ ] JWT é armazenado corretamente
- [ ] Token é enviado nas requests
- [ ] Token expira corretamente (testar após 1h)
- [ ] Refresh token funciona

### Proteção
- [ ] Não é possível acessar rotas sem login
- [ ] URL direta para dashboard redireciona
- [ ] Service role key NÃO está no frontend
- [ ] Apenas anon key é usada

---

## 📱 TESTES RESPONSIVOS (Opcional)

### Mobile
- [ ] Login funciona em mobile
- [ ] Email aparece (ou some corretamente)
- [ ] Botão logout acessível
- [ ] Dashboard funciona

### Tablet
- [ ] Layout se adapta
- [ ] Funcionalidades mantidas

---

## 🐛 CENÁRIOS DE ERRO

### Rede
- [ ] Sem internet mostra erro apropriado
- [ ] Timeout é tratado
- [ ] Retry funciona

### Supabase Down
- [ ] Erro é mostrado claramente
- [ ] App não quebra completamente

---

## ✅ RESULTADO FINAL

### Obrigatórios (devem TODOS estar ✅):
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Sessão persiste
- [ ] Dashboard carrega leads
- [ ] Criação manual funciona
- [ ] Nenhum erro no console
- [ ] Zero breaking changes

### Desejáveis:
- [ ] Performance mantida
- [ ] UX fluida
- [ ] Sem bugs visuais

---

## 🎉 APROVAÇÃO

Se TODOS os obrigatórios estão ✅:

**STATUS: APROVADO PARA COMMIT** ✅

Próximos passos:
1. Commit das mudanças
2. Push para branch `release/v1.1-auth`
3. Criar PR para review
4. Testar em staging
5. Deploy em produção

---

**Data do Teste:** _____________  
**Testado por:** _____________  
**Aprovado:** [ ] SIM  [ ] NÃO  
**Observações:**

