// backend/middlewares/verificaAutenticacao.js
// ============================================================
// Middleware que valida o JWT em todas as rotas protegidas.
// Extrai o payload e coloca em req.usuario para os
// middlewares e handlers seguintes usarem.
// ============================================================

const jwt = require('jsonwebtoken')

/**
 * Valida o Bearer Token no header Authorization.
 * Em caso de sucesso, popula req.usuario com os dados do token.
 * Em caso de falha, retorna 401 imediatamente.
 */
function verificaAutenticacao(req, res, next) {
  // Pega o header: "Authorization: Bearer eyJhbGci..."
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({
      erro: 'Token não fornecido.',
      codigo: 'TOKEN_AUSENTE',
    })
  }

  // Separa "Bearer" do token em si
  const partes = authHeader.split(' ')

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({
      erro: 'Formato de token inválido. Use: Bearer <token>',
      codigo: 'TOKEN_FORMATO_INVALIDO',
    })
  }

  const token = partes[1]

  try {
    // Verifica assinatura e expiração do JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Popula req.usuario — disponível nos próximos middlewares
    req.usuario = {
      id:       payload.sub,        // ID do usuário
      tenantId: payload.tenant_id,  // ID do condomínio/empresa
      plano:    payload.plano,       // 'basic' | 'pro' | 'premium'
      email:    payload.email,
      role:     payload.role,        // 'morador' | 'porteiro' | 'admin'
    }

    // Passa para o próximo middleware ou handler
    next()

  } catch (erro) {
    // jwt.verify lança erros tipados — tratamos cada um
    if (erro instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        erro: 'Token expirado. Faça login novamente.',
        codigo: 'TOKEN_EXPIRADO',
      })
    }

    if (erro instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        erro: 'Token inválido.',
        codigo: 'TOKEN_INVALIDO',
      })
    }

    // Erro inesperado — não vaza detalhes para o cliente
    console.error('[verificaAutenticacao] Erro inesperado:', erro)
    return res.status(500).json({ erro: 'Erro interno de autenticação.' })
  }
}

module.exports = { verificaAutenticacao }