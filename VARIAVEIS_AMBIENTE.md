# Variáveis de Ambiente - Produção

## Variáveis Necessárias

Configure estas variáveis no seu provedor de hosting (Vercel, Netlify, etc.):

```bash
VITE_SUPABASE_URL=https://hrnmzjkmwiblzaeojety.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
VITE_CRM_API_KEY=x7mbOpMYxMAlHeFF
```

## Onde Encontrar

### VITE_SUPABASE_URL
- Supabase Dashboard > Settings > API
- Campo: **Project URL**

### VITE_SUPABASE_ANON_KEY
- Supabase Dashboard > Settings > API
- Campo: **anon/public** key (NÃO use service_role)

### VITE_CRM_API_KEY
- Opcional (tem fallback hardcoded)
- Valor padrão: `x7mbOpMYxMAlHeFF`

## Exemplo para Vercel

1. Acesse Vercel Dashboard > Seu Projeto > Settings > Environment Variables
2. Adicione cada variável acima
3. Selecione "Production" como ambiente
4. Deploy novamente

## Exemplo para Netlify

1. Acesse Netlify Dashboard > Site Settings > Environment Variables
2. Adicione cada variável acima
3. Deploy novamente

## Validação

Após configurar, o build deve completar sem erros. Se faltar alguma variável, o app mostrará erro no console do navegador.

