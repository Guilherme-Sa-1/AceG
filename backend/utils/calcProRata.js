// backend/utils/calcProRata.js
// ============================================================
// Calcula o valor exato a ser cobrado imediatamente quando
// o usuário faz upgrade de plano no meio do ciclo.
//
// LÓGICA:
//   1. Calcula o crédito do plano antigo (dias restantes)
//   2. Calcula o débito do plano novo (dias restantes)
//   3. Cobra apenas a diferença
//
// Exemplo:
//   Plano atual: R$60/mês | Plano novo: R$120/mês
//   Ciclo: 30 dias | Dias restantes: 10
//
//   Crédito antigo : (60  / 30) * 10 = R$20,00
//   Débito novo    : (120 / 30) * 10 = R$40,00
//   Valor pro-rata : 40 - 20         = R$20,00  ← cobra agora
// ============================================================

/**
 * Calcula o valor pro-rata de um upgrade de plano.
 *
 * @param {object} params
 * @param {number} params.valorPlanoAtual   - Preço mensal do plano atual (ex: 60)
 * @param {number} params.valorPlanoNovo    - Preço mensal do plano novo  (ex: 120)
 * @param {number} params.diasTotaisCiclo   - Total de dias no ciclo      (ex: 30)
 * @param {number} params.diasRestantes     - Dias que faltam para renovar (ex: 10)
 *
 * @returns {{
 *   valorProRata:       number,  — valor a cobrar agora
 *   creditoPlanoAntigo: number,  — quanto o usuário já pagou (proporcional)
 *   debitoPlanoNovo:    number,  — quanto o novo plano custaria pelos dias restantes
 *   diasRestantes:      number,
 *   ehUpgrade:          boolean,
 *   detalhes:           string   — descrição legível do cálculo
 * }}
 */
function calcularProRata({
  valorPlanoAtual,
  valorPlanoNovo,
  diasTotaisCiclo,
  diasRestantes,
}) {
  // Validações de entrada
  if (diasTotaisCiclo <= 0) {
    throw new Error('diasTotaisCiclo deve ser maior que zero.')
  }
  if (diasRestantes < 0 || diasRestantes > diasTotaisCiclo) {
    throw new Error('diasRestantes deve estar entre 0 e diasTotaisCiclo.')
  }
  if (valorPlanoAtual < 0 || valorPlanoNovo < 0) {
    throw new Error('Valores de plano não podem ser negativos.')
  }

  // Valor diário de cada plano
  const valorDiarioAtual = valorPlanoAtual / diasTotaisCiclo
  const valorDiarioNovo  = valorPlanoNovo  / diasTotaisCiclo

  // Crédito: valor que o usuário já pagou mas não vai usar
  const creditoPlanoAntigo = valorDiarioAtual * diasRestantes

  // Débito: quanto o novo plano custa pelos dias restantes
  const debitoPlanoNovo = valorDiarioNovo * diasRestantes

  // Pro-rata = diferença entre débito e crédito
  // Positivo = upgrade (usuário paga)
  // Negativo = downgrade (sistema deve crédito para próximo ciclo)
  const valorProRataBruto = debitoPlanoNovo - creditoPlanoAntigo

  // Arredonda para 2 casas (centavos)
  const valorProRata = Math.round(valorProRataBruto * 100) / 100
  const creditoArredondado = Math.round(creditoPlanoAntigo * 100) / 100
  const debitoArredondado  = Math.round(debitoPlanoNovo    * 100) / 100

  const ehUpgrade = valorPlanoNovo > valorPlanoAtual

  return {
    valorProRata:       Math.max(0, valorProRata), // nunca cobra valor negativo
    creditoPlanoAntigo: creditoArredondado,
    debitoPlanoNovo:    debitoArredondado,
    diasRestantes,
    ehUpgrade,
    // Em downgrade, guarda o crédito para o próximo ciclo
    creditoParaProximoCiclo: valorProRata < 0
      ? Math.abs(Math.round(valorProRata * 100) / 100)
      : 0,
    detalhes: [
      `Ciclo: ${diasTotaisCiclo} dias | Restantes: ${diasRestantes} dias`,
      `Plano atual : R$ ${valorPlanoAtual}/mês → R$ ${valorDiarioAtual.toFixed(4)}/dia`,
      `Plano novo  : R$ ${valorPlanoNovo}/mês  → R$ ${valorDiarioNovo.toFixed(4)}/dia`,
      `Crédito     : R$ ${valorDiarioAtual.toFixed(4)} × ${diasRestantes} = R$ ${creditoArredondado.toFixed(2)}`,
      `Débito      : R$ ${valorDiarioNovo.toFixed(4)}  × ${diasRestantes} = R$ ${debitoArredondado.toFixed(2)}`,
      `Pro-rata    : R$ ${debitoArredondado.toFixed(2)} - R$ ${creditoArredondado.toFixed(2)} = R$ ${valorProRata.toFixed(2)}`,
    ].join('\n'),
  }
}

/**
 * Helper: calcula os dias restantes a partir da data de renovação.
 *
 * @param {Date|string} dataRenovacao - Data da próxima renovação
 * @returns {number} - Dias inteiros até a renovação
 */
function diasAteRenovacao(dataRenovacao) {
  const agora      = new Date()
  const renovacao  = new Date(dataRenovacao)
  const diffMs     = renovacao.getTime() - agora.getTime()
  const diffDias   = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDias)
}

module.exports = { calcularProRata, diasAteRenovacao }


// ============================================================
// EXEMPLO DE USO em uma rota de upgrade:
//
// const { calcularProRata, diasAteRenovacao } = require('./utils/calcProRata')
//
// app.post('/planos/upgrade', verificaAutenticacao, async (req, res) => {
//   const usuario = await buscarUsuario(req.usuario.id)
//
//   const resultado = calcularProRata({
//     valorPlanoAtual:  PLANOS[usuario.plano].preco,
//     valorPlanoNovo:   PLANOS[req.body.novoPlano].preco,
//     diasTotaisCiclo:  30,
//     diasRestantes:    diasAteRenovacao(usuario.dataRenovacao),
//   })
//
//   // Cobra o pro-rata via Stripe/Asaas
//   await cobrarProRata(usuario, resultado.valorProRata)
//
//   res.json(resultado)
// })
// ============================================================