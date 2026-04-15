// backend/middlewares/checkPlanEligibility.js
// ============================================================
// Factory de middleware — você passa os planos permitidos
// e ele retorna um middleware que verifica se o usuário
// tem o plano necessário para acessar aquela rota.
//
// IMPORTANTE: deve ser usado APÓS verificaAutenticacao,
// pois depende de req.usuario estar populado.
// ============================================================

// Hierarquia dos planos — quanto maior o número, mais acesso
const HIERARQUIA_PLANOS = {
  basic:   1,
  pro:     2,
  premium: 3,
}

/**
 * Cria um middleware que bloqueia usuários sem o plano mínimo.
 *
 * @param {string|string[]} planosPermitidos
 *   Plano mínimo como string ('pro') OU
 *   lista de planos aceitos (['pro', 'premium'])
 * @param {object} opcoes
 * @param {boolean} opcoes.usarHierarquia
 *   true  = planos superiores também têm acesso (padrão)
 *   false = somente os planos listados exatamente têm acesso
 *
 * @example
 * // Rota só para premium:
 * router.get('/relatorio', verificaAutenticacao, checkPlanEligibility('premium'), handler)
 *
 * @example
 * // Rota para pro e premium (sem hierarquia):
 * router.get('/rota', verificaAutenticacao, checkPlanEligibility(['pro', 'premium'], { usarHierarquia: false }), handler)
 */
function checkPlanEligibility(planosPermitidos, opcoes = {}) {
  const { usarHierarquia = true } = opcoes

  // Normaliza para sempre trabalhar com array
  const listaPermitidos = Array.isArray(planosPermitidos)
    ? planosPermitidos
    : [planosPermitidos]

  return function middlewarePlano(req, res, next) {
    // Garante que verificaAutenticacao rodou antes
    if (!req.usuario) {
      return res.status(401).json({
        erro: 'Usuário não autenticado.',
        codigo: 'NAO_AUTENTICADO',
      })
    }

    const planoUsuario = req.usuario.plano

    // Verifica se o plano do usuário é válido no sistema
    if (!HIERARQUIA_PLANOS[planoUsuario]) {
      return res.status(403).json({
        erro: 'Plano do usuário não reconhecido.',
        codigo: 'PLANO_INVALIDO',
      })
    }

    let temAcesso = false

    if (usarHierarquia) {
      // Usuário tem acesso se seu plano for >= ao mínimo exigido
      const nivelMinimo = Math.min(
        ...listaPermitidos.map(p => HIERARQUIA_PLANOS[p] ?? Infinity)
      )
      temAcesso = HIERARQUIA_PLANOS[planoUsuario] >= nivelMinimo

    } else {
      // Acesso exato: só os planos listados passam
      temAcesso = listaPermitidos.includes(planoUsuario)
    }

    if (!temAcesso) {
      return res.status(403).json({
        erro: `Esta funcionalidade requer o plano: ${listaPermitidos.join(' ou ')}.`,
        codigo: 'PLANO_INSUFICIENTE',
        planoAtual:    planoUsuario,
        planosNecessarios: listaPermitidos,
      })
    }

    // Plano válido — segue para o handler
    next()
  }
}

module.exports = { checkPlanEligibility, HIERARQUIA_PLANOS }


// ============================================================
// EXEMPLOS DE USO NAS ROTAS:
//
// const { verificaAutenticacao }  = require('./middlewares/verificaAutenticacao')
// const { checkPlanEligibility }  = require('./middlewares/checkPlanEligibility')
//
// Só premium:
// router.get('/dashboard-avancado',
//   verificaAutenticacao,
//   checkPlanEligibility('premium'),
//   dashboardHandler
// )
//
// Pro OU premium (por hierarquia, premium também passa):
// router.get('/relatorio',
//   verificaAutenticacao,
//   checkPlanEligibility('pro'),
//   relatorioHandler
// )
//
// Exatamente pro (premium NÃO entra):
// router.get('/rota-especifica',
//   verificaAutenticacao,
//   checkPlanEligibility('pro', { usarHierarquia: false }),
//   handler
// )
// ============================================================