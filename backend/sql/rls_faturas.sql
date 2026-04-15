-- ============================================================
-- 1. Habilita Row-Level Security na tabela faturas
--    Isso faz com que PostgreSQL aplique políticas de acesso
--    em TODAS as queries feitas nessa tabela.
-- ============================================================
ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;

-- Garante que mesmo o dono da tabela seja bloqueado
-- sem uma policy explícita (segurança máxima)
ALTER TABLE faturas FORCE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Cria a policy de SELECT (leitura)
--    Só retorna linhas onde tenant_id = variável de sessão
--    A variável app.current_tenant_id é setada pelo backend
--    antes de cada query (veja o exemplo em Node.js abaixo)
-- ============================================================
CREATE POLICY "tenant_isolamento_select"
  ON faturas
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
  );

-- ============================================================
-- 3. Policy de INSERT — só pode inserir para o próprio tenant
-- ============================================================
CREATE POLICY "tenant_isolamento_insert"
  ON faturas
  FOR INSERT
  WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id')::uuid
  );

-- ============================================================
-- 4. Policy de UPDATE — só pode alterar seus próprios dados
-- ============================================================
CREATE POLICY "tenant_isolamento_update"
  ON faturas
  FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
  );

-- ============================================================
-- 5. Policy de DELETE — só pode deletar seus próprios dados
-- ============================================================
CREATE POLICY "tenant_isolamento_delete"
  ON faturas
  FOR DELETE
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
  );

-- ============================================================
-- 6. Cria um role com permissões limitadas para o backend usar
--    Nunca use o superuser do postgres na aplicação!
-- ============================================================
CREATE ROLE app_backend LOGIN PASSWORD 'sua_senha_forte_aqui';
GRANT SELECT, INSERT, UPDATE, DELETE ON faturas TO app_backend;

-- ============================================================
-- COMO TESTAR MANUALMENTE NO PSQL:
--
-- SET app.current_tenant_id = 'uuid-do-tenant-aqui';
-- SELECT * FROM faturas; -- só retorna dados desse tenant
-- ============================================================