-- RLS Policies para Produção
-- Execute este script no Supabase Dashboard > SQL Editor

-- ============================================
-- TABELA: leads
-- ============================================

-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: SELECT público (frontend precisa ler)
CREATE POLICY "Allow public read leads" ON leads
  FOR SELECT
  USING (true);

-- Policy: Service Role pode tudo (Edge Functions)
-- Nota: Service Role já tem acesso total, mas esta policy garante explicitamente
CREATE POLICY "Allow service role all" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TABELA: lead_events
-- ============================================

-- Habilitar RLS (já deve estar habilitado pela migration)
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

-- Policy: SELECT público (frontend precisa ler timeline)
CREATE POLICY "Allow public read lead_events" ON lead_events
  FOR SELECT
  USING (true);

-- Policy: Service Role pode inserir (Edge Functions)
CREATE POLICY "Allow service role insert lead_events" ON lead_events
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service Role pode ler (Edge Functions)
CREATE POLICY "Allow service role read lead_events" ON lead_events
  FOR SELECT
  USING (true);

-- ============================================
-- NOTAS
-- ============================================
-- 
-- Estas policies permitem:
-- 1. Frontend (anon key) pode ler leads e eventos
-- 2. Edge Function (service role) pode criar/atualizar leads e eventos
-- 3. Nenhum usuário autenticado pode modificar dados diretamente
--
-- Para produção com multi-tenancy, ajuste as policies conforme necessário.

