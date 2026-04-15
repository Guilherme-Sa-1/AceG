-- ============================================================
-- Tabela que armazena IDs de eventos já processados.
-- Impede processamento duplicado em caso de reenvio.
-- ============================================================
CREATE TABLE webhook_eventos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ID único do evento enviado pelo provedor (Stripe/Asaas)
  -- É a chave de idempotência — nunca pode repetir
  evento_id       VARCHAR(255) UNIQUE NOT NULL,

  -- Nome do evento: 'payment.confirmed', 'subscription.cancelled', etc.
  tipo_evento     VARCHAR(100) NOT NULL,

  -- Status do processamento
  status          VARCHAR(20) NOT NULL DEFAULT 'processando'
                  CHECK (status IN ('processando', 'concluido', 'erro')),

  -- Payload completo para auditoria e reprocessamento manual
  payload         JSONB,

  -- Mensagem de erro caso tenha falhado
  erro_mensagem   TEXT,

  -- Timestamps
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processado_em   TIMESTAMPTZ
);

-- Índice para busca rápida por evento_id (chave de idempotência)
CREATE INDEX idx_webhook_evento_id ON webhook_eventos(evento_id);

-- Índice para monitoramento por tipo e status
CREATE INDEX idx_webhook_tipo_status ON webhook_eventos(tipo_evento, status);