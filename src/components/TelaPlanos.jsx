import { useState } from 'react'
import { PLANOS } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function TelaPlanos({ onVoltar }) {
  const { usuarioLogado, trocarPlano } = useApp()
  const [confirmando, setConfirmando]  = useState(null)
  const [loading, setLoading]          = useState(false)

  const planoAtual = usuarioLogado?.plano

  async function handleAssinar(planoId) {
    if (planoId === planoAtual) return
    setConfirmando(planoId)
  }

  async function handleConfirmar() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    trocarPlano(confirmando)
    setLoading(false)
    setConfirmando(null)
    onVoltar()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={onVoltar}
          className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
        >
          ←
        </button>
        <div>
          <p className="font-semibold text-gray-800">Planos</p>
          <p className="text-xs text-gray-500">Escolha o melhor para você</p>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">

        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
          <p className="text-sm text-purple-700 font-medium">
            Plano atual:{' '}
            <span className="font-bold">
              {PLANOS[planoAtual]?.icone} {PLANOS[planoAtual]?.nome}
            </span>
          </p>
        </div>

        {Object.values(PLANOS).map(plano => {
          const ativo = planoAtual === plano.id
          return (
            <div
              key={plano.id}
              className={`border-2 rounded-3xl p-5 transition-all ${plano.corBg} ${
                ativo ? plano.corBorda + ' shadow-md' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{plano.icone}</span>
                    <h3 className={`font-bold text-lg ${plano.corDestaque}`}>{plano.nome}</h3>
                    {ativo && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${plano.corBg} ${plano.corTexto} border ${plano.corBorda}`}>
                        Atual
                      </span>
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${plano.corDestaque}`}>
                    R$ {plano.preco}
                    <span className="text-sm font-normal text-gray-500">/mês</span>
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {plano.beneficios.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className={`text-xs ${plano.corTexto}`}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAssinar(plano.id)}
                disabled={ativo}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-default ${plano.corBotao}`}
              >
                {ativo ? 'Plano ativo' : 'Assinar este plano'}
              </button>
            </div>
          )
        })}

        <p className="text-center text-xs text-gray-400 py-2">
          MVP — Troca de plano sem cobrança real
        </p>
      </div>

      {/* Modal confirmação */}
      {confirmando && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <span className="text-5xl">{PLANOS[confirmando]?.icone}</span>
              <h3 className="font-bold text-gray-800 text-lg mt-3">
                Ativar plano {PLANOS[confirmando]?.nome}?
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                R$ {PLANOS[confirmando]?.preco}/mês
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmando(null)}
                disabled={loading}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={loading}
                className={`flex-1 py-3 ${PLANOS[confirmando]?.corBotao} text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center`}
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : 'Confirmar'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}