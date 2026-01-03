# Deploy no Vercel - Instruções

## ✅ Deploy Realizado

**Status**: Deploy concluído com sucesso  
**URL de Produção**: https://crm-clinic-atena-9fdi7gnbo-hub-focusmidia.vercel.app  
**URL de Inspeção**: https://vercel.com/hub-focusmidia/crm-clinic-atena/2ZDq8f1nHwmrN5sQHLjwkfRv4wPv

## ⚠️ AÇÃO NECESSÁRIA: Configurar Variáveis de Ambiente

O deploy foi realizado, mas **as variáveis de ambiente precisam ser configuradas manualmente** no dashboard do Vercel.

### Como Configurar:

1. Acesse: https://vercel.com/hub-focusmidia/crm-clinic-atena/settings/environment-variables

2. Adicione as seguintes variáveis para **Production**, **Preview** e **Development**:

```
VITE_SUPABASE_URL=https://hrnmzjkmwiblzaeojety.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-chave-anon-aqui>
VITE_CRM_API_KEY=x7mbOpMYxMAlHeFF
```

3. **Onde encontrar VITE_SUPABASE_ANON_KEY**:
   - Acesse: https://app.supabase.com
   - Selecione seu projeto
   - Vá em Settings > API
   - Copie a chave **anon/public** (NÃO use service_role)

4. Após adicionar as variáveis, faça um novo deploy:
   ```bash
   vercel --prod
   ```

## 📋 Checklist Pós-Deploy

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Novo deploy realizado após configurar variáveis
- [ ] App carrega sem tela branca
- [ ] Dashboard carrega leads
- [ ] Funil carrega leads
- [ ] Criação manual funciona
- [ ] Timeline funciona

## 🔍 Verificação

Após configurar as variáveis e fazer novo deploy, acesse:
- https://crm-clinic-atena-9fdi7gnbo-hub-focusmidia.vercel.app

**O que verificar:**
1. App carrega corretamente
2. Console do navegador sem erros críticos
3. Dashboard mostra leads (se houver)
4. Funil mostra leads (se houver)

## 📝 Notas Técnicas

- Build completou sem erros
- Framework detectado: Vite
- Output directory: dist
- Build time: ~8 segundos
- 2 moderate severity vulnerabilities (npm audit) - não crítico para v1

