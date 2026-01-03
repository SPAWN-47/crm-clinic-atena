# 🚀 Próximos Passos - CRM Clinic Atena

**Roadmap recomendado pós v1**

---

## 🔥 PRIORIDADE ALTA - Semana 1-2

### 1. Autenticação de Usuários ⭐⭐⭐
**Objetivo**: Proteger o CRM com login

**Por quê agora?**  
Atualmente o CRM está aberto. Qualquer pessoa com a URL pode acessar.

**O que fazer:**
```
□ Implementar Supabase Auth (email/senha)
□ Criar tela de login (/login)
□ Proteger rotas (redirect se não autenticado)
□ Adicionar botão "Logout" na topbar
□ (Opcional) Multi-tenancy: separar leads por clínica
```

**Complexidade**: ⭐⭐⭐ Média  
**Tempo estimado**: 2-3 dias  
**Impacto**: 🔥 Crítico (segurança)

**Referência**:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- Usar `@supabase/auth-ui-react` para UI pronta

---

### 2. Edição de Leads ⭐⭐
**Objetivo**: Permitir editar dados de leads existentes

**Por quê agora?**  
Atualmente só é possível criar leads. Para corrigir erros ou atualizar dados, é necessário edição.

**O que fazer:**
```
□ Adicionar botão "Editar" no modal de detalhes
□ Transformar campos em inputs editáveis
□ Chamar Edge Function com método UPDATE
□ Registrar evento lead_updated
□ Fechar modal após sucesso
```

**Complexidade**: ⭐ Baixa  
**Tempo estimado**: 1 dia  
**Impacto**: 🔥 Alto (usabilidade)

---

### 3. Drag & Drop no Funil ⭐⭐⭐
**Objetivo**: Arrastar leads entre colunas para mudar status

**Por quê agora?**  
Melhora drasticamente a UX. É o comportamento esperado em um funil visual.

**O que fazer:**
```
□ Instalar @dnd-kit/core ou react-beautiful-dnd
□ Tornar cards de leads "draggable"
□ Tornar colunas "droppable"
□ Ao soltar: atualizar status no backend
□ Registrar evento status_changed
□ Feedback visual durante drag
```

**Complexidade**: ⭐⭐ Média  
**Tempo estimado**: 2 dias  
**Impacto**: 🔥 Alto (UX)

**Referência**:
- [@dnd-kit](https://dndkit.com/) - Recomendado
- Exemplo: [DnD Kit Examples](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/)

---

## 🚀 PRIORIDADE MÉDIA - Semana 3-4

### 4. Notificações
**Objetivo**: Alertar quando novos leads chegam

**O que fazer:**
```
□ Solicitar permissão para notificações (browser)
□ Mostrar notificação quando lead for criado
□ Toast messages para ações (sucesso/erro)
□ Badge de contagem de novos leads não vistos
```

**Complexidade**: ⭐ Baixa  
**Tempo estimado**: 1-2 dias  
**Impacto**: 🟡 Médio

---

### 5. Filtros Avançados
**Objetivo**: Facilitar busca de leads específicos

**O que fazer:**
```
□ Search bar (nome/telefone)
□ Filtro por data de criação
□ Filtro por source (manual/ia/n8n)
□ Filtro por status (checkbox múltiplo)
□ Botão "Limpar filtros"
```

**Complexidade**: ⭐ Baixa  
**Tempo estimado**: 1 dia  
**Impacto**: 🟡 Médio

---

### 6. Export de Dados (CSV)
**Objetivo**: Permitir download de leads para análise externa

**O que fazer:**
```
□ Botão "Export CSV" no Dashboard
□ Gerar CSV com leads filtrados
□ Incluir: nome, telefone, email, status, source, created_at
□ Download automático
```

**Complexidade**: ⭐ Baixa  
**Tempo estimado**: 1 dia  
**Impacto**: 🟡 Médio

**Biblioteca**: `papaparse` ou `csv-stringify`

---

## 🎨 PRIORIDADE BAIXA - Futuro

### 7. Notas/Comentários
**Objetivo**: Adicionar comentários internos em cada lead

**O que fazer:**
```
□ Campo de texto "Adicionar nota" no modal
□ Listagem de notas com timestamp
□ Registrar como evento em lead_events
□ Permitir edição/exclusão de notas
```

**Tempo estimado**: 2 dias

---

### 8. Agendamento de Follow-ups
**Objetivo**: Lembrar de contatar leads em datas específicas

**O que fazer:**
```
□ Botão "Agendar follow-up" no modal
□ Picker de data/hora
□ Salvar em nova tabela follow_ups
□ Notificação quando vencer
□ Marcar follow-up como concluído
```

**Tempo estimado**: 3-4 dias

---

### 9. Relatórios Avançados
**Objetivo**: Análise de performance do funil

**O que fazer:**
```
□ Taxa de conversão por fonte (ia vs manual)
□ Tempo médio por status
□ Gráfico de leads por dia/semana
□ Export PDF de relatórios
```

**Tempo estimado**: 3-5 dias

---

### 10. Integração WhatsApp
**Objetivo**: Enviar mensagens pelo CRM

**O que fazer:**
```
□ Integrar WhatsApp Business API
□ Botão "Enviar WhatsApp" no modal
□ Templates de mensagens
□ Histórico de conversas
```

**Tempo estimado**: 5-7 dias  
**Nota**: Requer API oficial do WhatsApp (paga)

---

### 11. Mobile Responsivo
**Objetivo**: Tornar CRM 100% utilizável em mobile

**O que fazer:**
```
□ Otimizar sidebar para mobile (hamburger menu)
□ Otimizar funil (scroll horizontal ou lista)
□ Otimizar modal de detalhes
□ Testar em devices reais
□ PWA (opcional): permitir "instalar app"
```

**Tempo estimado**: 3-4 dias

---

### 12. Customização por Clínica
**Objetivo**: White-label para múltiplas clínicas

**O que fazer:**
```
□ Upload de logo
□ Escolher cores do tema
□ Campos customizados por clínica
□ Separação de dados (multi-tenancy)
□ Billing por clínica
```

**Tempo estimado**: 5-7 dias

---

## 📊 Matriz de Priorização

| Feature | Impacto | Esforço | Prioridade |
|---------|---------|---------|------------|
| Autenticação | 🔥🔥🔥 | ⭐⭐⭐ | **P0** |
| Edição de leads | 🔥🔥 | ⭐ | **P0** |
| Drag & Drop | 🔥🔥 | ⭐⭐ | **P0** |
| Notificações | 🔥 | ⭐ | P1 |
| Filtros avançados | 🔥 | ⭐ | P1 |
| Export CSV | 🔥 | ⭐ | P1 |
| Notas/comentários | 🟡 | ⭐⭐ | P2 |
| Follow-ups | 🟡 | ⭐⭐⭐ | P2 |
| Relatórios | 🟡 | ⭐⭐⭐ | P2 |
| WhatsApp | 🟡 | ⭐⭐⭐⭐⭐ | P3 |
| Mobile | 🔥 | ⭐⭐⭐ | P2 |
| Customização | 🟡 | ⭐⭐⭐⭐⭐ | P3 |

---

## 🎯 Roadmap Sugerido

### Sprint 1 (Semana 1-2)
- ✅ v1.0 - MVP funcional (COMPLETO)
- 🔲 v1.1 - Autenticação
- 🔲 v1.2 - Edição de leads

### Sprint 2 (Semana 3-4)
- 🔲 v1.3 - Drag & Drop no funil
- 🔲 v1.4 - Notificações básicas

### Sprint 3 (Semana 5-6)
- 🔲 v1.5 - Filtros avançados
- 🔲 v1.6 - Export CSV

### Sprint 4 (Semana 7-8)
- 🔲 v1.7 - Notas e comentários
- 🔲 v1.8 - Mobile responsivo

### Sprint 5+ (Futuro)
- 🔲 v2.0 - Follow-ups
- 🔲 v2.1 - Relatórios avançados
- 🔲 v3.0 - WhatsApp integration
- 🔲 v4.0 - Multi-clínica (white-label)

---

## 💡 Recomendação Final

**Comece por:**
1. **Autenticação** (crítico para segurança)
2. **Edição de leads** (rápido e alto impacto)
3. **Drag & Drop** (grande melhoria de UX)

Essas 3 features transformam o CRM de "funcional" para "produção enterprise-ready".

---

## 📞 Suporte

Qualquer dúvida sobre implementação, estou à disposição! 🚀

