// backend/webhooks/stripeWebhook.js
// ============================================================
// Rota de webhook para receber eventos de pagamento.
// Implementa idempotência via evento_id para evitar
// processamento duplicado de cobranças.
//
// IMPORTANTE: registre essa rota ANTES do express.json()
// pois precisamos do body cru (raw) para validar a assinatura.
// ============================================================

const express  = require('express')
const crypto   = require('crypto')
const router   = express.Router()

// ============================================================
// VERIFICAÇÃO DE ASSINATURA (Stripe)
// Garante que o webhook veio de fato da Stripe e não de
// um atacante que descobriu a URL do seu endpoint.
// ============================================================

/**
 * Verifica a assinatura HMAC do webhook da Stripe.
 * Lança erro se a assinatura for inválida ou expirada.
 *
 * @param {Buffer} rawBody       - Body cru da requisição (Buffer)
 * @param {string} signatureHeader - Header 'stripe-signature'
 * @param {string} secret        - Webhook secret do dashboard Stripe
 */
function verificarAssinaturaStripe(rawBody, signatureHeader, secret) {
  // Header formato: "t=timestamp,v1=assinatura"
  const partes     = signatureHeader.split(',')
  const timestamp  = partes.find(p => p.startsWith('t='))?.split('=')[1]
  const assinatura = partes.find(p => p.startsWith('v1='))?.split('=')[1]

  if (!timestamp || !assinatura) {
    throw new Error('Header de assinatura malformado.')
  }

  // Proteção contra replay attacks — rejeita eventos > 5 min
  const agora         = Math.floor(Date.now() / 1000)
  const toleranciaMs  = 300 // 5 minutos
  if (Math.abs(agora - parseInt(timestamp)) > toleranciaMs) {
    throw new Error('Webhook expirado (possível replay attack).')
  }

  // Recalcula a assinatura esperada
  const payload       = `${timestamp}.${rawBody.toString()}`
  const assinaturaEsperada = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex')

  // Comparação segura (evita timing attacks)
  const bufferRecebido = Buffer.from(assinatura,         'hex')
  const bufferEsperado = Buffer.from(assinaturaEsperada, 'hex')

  if (
    bufferRecebido.length !== bufferEsperado.length ||
    !crypto.timingSafeEqual(bufferRecebido, bufferEsperado)
  ) {
    throw new Error('Assinatura do webhook inválida.')
  }
}

// ============================================================
// CHAVE DE IDEMPOTÊNCIA
// Antes de processar qualquer evento, tenta inserir o
// evento_id na tabela. Se já existir (UNIQUE constraint),
// sabemos que é duplicata e ignoramos silenciosamente.
// ============================================================

/**
 * Registra o evento no banco. Retorna false se já foi processado.
 *
 * @param {import('pg').Pool} pool
 * @param {string} eventoId   - ID único do evento (ex: evt_abc123)
 * @param {string} tipoEvento - Nome do evento
 * @param {object} payload    - Body completo do webhook
 * @returns {Promise<boolean>} - true = novo, false = duplicata
 */
async function registrarEventoIdempotente(pool, eventoId, tipoEvento, payload) {
  try {
    // ON CONFLICT DO NOTHING: se o evento_id já existe, não faz nada
    // e o affected rows retorna 0 — sabemos que é duplicata
    const resultado = await pool.query(
      `INSERT INTO webhook_eventos (evento_id, tipo_evento, payload, status)
       VALUES ($1, $2, $3, 'processando')
       ON CONFLICT (evento_id) DO NOTHING`,
      [eventoId, tipoEvento, JSON.stringify(payload)]
    )

    // rowCount = 1 → inseriu (evento novo)
    // rowCount = 0 → conflito (evento duplicado)
    return resultado.rowCount === 1

  } catch (erro) {
    console.error('[Webhook] Erro ao registrar idempotência:', erro)
    throw erro
  }
}

/**
 * Atualiza o status do evento após processamento.
 *
 * @param {import('pg').Pool} pool
 * @param {string} eventoId
 * @param {'concluido'|'erro'} status
 * @param {string|null} erroMensagem
 */
async function atualizarStatusEvento(pool, eventoId, status, erroMensagem = null) {
  await pool.query(
    `UPDATE webhook_eventos
     SET status = $1, processado_em = NOW(), erro_mensagem = $2
     WHERE evento_id = $3`,
    [status, erroMensagem, eventoId]
  )
}

// ============================================================
// HANDLERS DE EVENTOS
// Cada tipo de evento tem seu próprio handler isolado.
// Adicione novos tipos aqui conforme precisar.
// ============================================================

/**
 * Processa confirmação de pagamento → renova assinatura do usuário.
 */
async function handlePagamentoConfirmado(pool, payload) {
  const { customer, subscription, amount } = payload.data.object

  // Busca o usuário pelo ID do cliente Stripe
  const { rows } = await pool.query(
    'SELECT * FROM usuarios WHERE stripe_customer_id = $1',
    [customer]
  )

  if (rows.length === 0) {
    throw new Error(`Usuário não encontrado para customer: ${customer}`)
  }

  const usuario = rows[0]

  // Renova a assinatura: atualiza data de expiração para +30 dias
  await pool.query(
    `UPDATE usuarios
     SET
       plano_ativo    = true,
       data_renovacao = NOW() + INTERVAL '30 days',
       ultima_cobranca = NOW(),
       valor_ultima_cobranca = $1
     WHERE id = $2`,
    [amount / 100, usuario.id] // Stripe trabalha em centavos
  )

  console.log(`[Webhook] Assinatura renovada para usuário ${usuario.id}`)
}

/**
 * Processa falha de pagamento → notifica usuário ou suspende acesso.
 */
async function handlePagamentoFalhou(pool, payload) {
  const { customer } = payload.data.object

  await pool.query(
    `UPDATE usuarios
     SET plano_ativo = false, motivo_suspensao = 'pagamento_falhou'
     WHERE stripe_customer_id = $1`,
    [customer]
  )

  // Aqui você enviaria um e-mail ou notificação push
  console.warn(`[Webhook] Pagamento falhou para customer: ${customer}`)
}

/**
 * Processa cancelamento de assinatura.
 */
async function handleAssinaturaCancelada(pool, payload) {
  const { customer } = payload.data.object

  await pool.query(
    `UPDATE usuarios
     SET plano = 'basic', plano_ativo = false, motivo_suspensao = 'cancelado'
     WHERE stripe_customer_id = $1`,
    [customer]
  )

  console.log(`[Webhook] Assinatura cancelada para customer: ${customer}`)
}

// Mapa de handlers por tipo de evento
const HANDLERS = {
  'payment_intent.succeeded':    handlePagamentoConfirmado,
  'payment_intent.payment_failed': handlePagamentoFalhou,
  'customer.subscription.deleted': handleAssinaturaCancelada,
}

// ============================================================
// ROTA PRINCIPAL DO WEBHOOK
// ============================================================

/**
 * Cria e retorna o router do webhook configurado com o pool do banco.
 * Use: app.use('/webhook', criarWebhookRouter(pool))
 *
 * @param {import('pg').Pool} pool
 */
function criarWebhookRouter(pool) {

  // Body cru necessário para validar assinatura da Stripe
  router.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    async (req, res) => {

      const signatureHeader = req.headers['stripe-signature']
      let evento

      // ── 1. Valida a assinatura ──────────────────────────────
      try {
        verificarAssinaturaStripe(
          req.body,
          signatureHeader,
          process.env.STRIPE_WEBHOOK_SECRET
        )
        evento = JSON.parse(req.body.toString())

      } catch (erro) {
        console.warn('[Webhook] Assinatura inválida:', erro.message)
        // Retorna 400 para a Stripe não retentar
        return res.status(400).json({ erro: erro.message })
      }

      const eventoId   = evento.id
      const tipoEvento = evento.type

      console.log(`[Webhook] Recebido: ${tipoEvento} | ID: ${eventoId}`)

      // ── 2. Checa idempotência ───────────────────────────────
      let eventoNovo
      try {
        eventoNovo = await registrarEventoIdempotente(pool, eventoId, tipoEvento, evento)
      } catch (erro) {
        console.error('[Webhook] Erro na verificação de idempotência:', erro)
        return res.status(500).json({ erro: 'Erro interno.' })
      }

      if (!eventoNovo) {
        // Evento duplicado — responde 200 para a Stripe não retentar
        console.log(`[Webhook] Evento duplicado ignorado: ${eventoId}`)
        return res.status(200).json({ recebido: true, duplicata: true })
      }

      // ── 3. Processa o evento ────────────────────────────────
      const handler = HANDLERS[tipoEvento]

      if (!handler) {
        // Evento que não tratamos — registra e responde 200
        await atualizarStatusEvento(pool, eventoId, 'concluido')
        console.log(`[Webhook] Evento sem handler, ignorado: ${tipoEvento}`)
        return res.status(200).json({ recebido: true })
      }

      try {
        await handler(pool, evento)
        await atualizarStatusEvento(pool, eventoId, 'concluido')

        return res.status(200).json({ recebido: true, processado: true })

      } catch (erro) {
        // Salva o erro para auditoria e reprocessamento manual
        await atualizarStatusEvento(pool, eventoId, 'erro', erro.message)
        console.error(`[Webhook] Erro ao processar ${tipoEvento}:`, erro)

        // Retorna 500 para a Stripe retentar automaticamente
        return res.status(500).json({ erro: 'Erro ao processar evento.' })
      }
    }
  )

  return router
}

module.exports = { criarWebhookRouter }


// ============================================================
// COMO REGISTRAR NO SEU server.js / app.js:
//
// const { criarWebhookRouter } = require('./webhooks/stripeWebhook')
//
// // ANTES do express.json() global!
// app.use('/webhook', criarWebhookRouter(pool))
//
// // Depois o json normal para as outras rotas
// app.use(express.json())
// ============================================================