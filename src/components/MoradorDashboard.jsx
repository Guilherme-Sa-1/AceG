import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { servicosDisponiveis, PLANOS } from '../data/mockData'
import { useLimites } from '../hooks/useLimites'
import PedidoCard from './PedidoCard'
import UsageBar from './UsageBar'
import TelaPlanos from './TelaPlanos'
import toast from 'react-hot-toast'

export default function MoradorDashboard() {
  const {
    usuarioLogado, pedidos,
    criarPedido, cancelarPedido, avaliarPedido, fazerLogout,
  } = useApp()

  const [aba, setAba]                   = useState('solicitar')
  const [confirmando, setConfirmando]   = useState(null)
  const [loadingConfirmar, setLoading]  = useState(false)
  const [telaPlanos, setTelaPlanos]     = useState(false)

  const limites     = useLimites(pedidos, usuarioLogado)
  const meusPedidos = pedidos.filter(p => p.apt === usuarioLogado.apt)
  const ativos      = meusPedidos.filter(p => ['pendente', 'aceito'].includes(p.status))
  const historico   = meusPedidos.filter(p => ['concluido', 'cancelado'].includes(p.status))
  const totalGasto  = meusPedidos.filter(p => p.status === 'concluido').reduce((a, p) => a + p.preco, 0)
  const pendentes   = ativos.filter(p => p.status === 'pendente').length
  const planoAtual  = PLANOS[usuarioLogado?.plano]

  function handleClicarServico(servico) {
    if (!limites.podeSolicitar) {
      if (limites.bloqueadoPorDia) {
        toast.error('Limite diário atingido. Tente amanhã ou faça upgrade do plano.')
      } else {
        toast.error('Limite semanal atingido. Faça upgrade do plano para continuar.')
      }
      return
    }
    setConfirmando(servico)
  }

  async function handleConfirmar() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    criarPedido(confirmando.label, confirmando.preco, confirmando.icon)
    setConfirmando(null)
    setLoading(false)
    setAba('pedidos')
  }

  if (telaPlanos) return <TelaPlanos onVoltar={() => setTelaPlanos(false)} />

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-500">Olá,</p>
          <p className="font-semibold text-gray-800">{usuarioLogado.nome}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTelaPlanos(true)}
            className={`text-xs font-semibold px-2 py-1 rounded-full border ${planoAtual?.corBg} ${planoAtual?.corTexto} ${planoAtual?.corBorda} transition-all hover:opacity-80`}
          >
            {planoAtual?.icone} {planoAtual?.nome}
          </button>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            Apto {usuarioLogado.apt}
          </span>
          <button onClick={fazerLogout} className="text-xs text-gray-400 hover:text-gray-600">
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 max-w-md mx-auto space-y-4">

          {/* ABA: SOLICITAR */}
          {aba === 'solicitar' && (
            <>
              <UsageBar limites={limites} />

              <h2 className="text-sm font-semibold text-gray-700">O que você precisa?</h2>

              <div className="grid grid-cols-3 gap-3">
                {servicosDisponiveis.map(s => {
                  const bloqueado = !limites.podeSolicitar
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleClicarServico(s)}
                      className={`bg-white border rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm transition-all ${
                        bloqueado
                          ? 'opacity-50 cursor-not-allowed border-gray-100'
                          : 'border-gray-100 hover:border-purple-300 hover:shadow-md active:scale-95'
                      }`}
                    >
                      <span className={`text-3xl ${bloqueado ? 'grayscale' : ''}`}>{s.icon}</span>
                      <span className="text-xs text-gray-600 text-center leading-tight">{s.label}</span>
                      {bloqueado
                        ? <span className="text-xs text-red-400 font-semibold">Limite</span>
                        : <span className="text-xs text-purple-600 font-semibold">R$ {s.preco.toFixed(2)}</span>
                      }
                    </button>
                  )
                })}
              </div>

              {!limites.podeSolicitar && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <p className="text-sm font-semibold text-orange-800">Limite atingido</p>
                    <p className="text-xs text-orange-600 mt-0.5">
                      Faça upgrade para continuar solicitando serviços.
                    </p>
                    <button
                      onClick={() => setTelaPlanos(true)}
                      className="mt-2 text-xs font-semibold text-orange-700 underline"
                    >
                      Ver planos →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ABA: PEDIDOS */}
          {aba === 'pedidos' && (
            <>
              <h2 className="text-sm font-semibold text-gray-700">
                Pedidos ativos {ativos.length > 0 && `(${ativos.length})`}
              </h2>
              {ativos.length === 0 ? (
                <Vazio icone="📋" texto="Nenhum pedido ativo" />
              ) : (
                <div className="space-y-2">
                  {ativos.map(p => (
                    <PedidoCard key={p.id} pedido={p} onCancelar={cancelarPedido} />
                  ))}
                </div>
              )}

              {historico.length > 0 && (
                <>
                  <h2 className="text-sm font-semibold text-gray-700 pt-2">Histórico</h2>
                  <div className="space-y-2">
                    {historico.map(p => (
                      <PedidoCard key={p.id} pedido={p} onAvaliar={avaliarPedido} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ABA: PERFIL */}
          {aba === 'perfil' && (
            <>
              <h2 className="text-sm font-semibold text-gray-700">Meu perfil</h2>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl mx-auto mb-3">
                  👤
                </div>
                <p className="font-semibold text-gray-800 text-lg">{usuarioLogado.nome}</p>
                <p className="text-gray-500 text-sm">Apartamento {usuarioLogado.apt}</p>
                <button
                  onClick={() => setTelaPlanos(true)}
                  className={`mt-3 text-xs font-semibold px-3 py-1.5 rounded-full border ${planoAtual?.corBg} ${planoAtual?.corTexto} ${planoAtual?.corBorda}`}
                >
                  {planoAtual?.icone} Plano {planoAtual?.nome} · Trocar
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { valor: meusPedidos.length, label: 'Pedidos', cor: 'text-purple-600' },
                  { valor: meusPedidos.filter(p => p.status === 'concluido').length, label: 'Concluídos', cor: 'text-green-600' },
                  { valor: `R$${totalGasto.toFixed(2)}`, label: 'Gasto', cor: 'text-blue-600' },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className={`text-xl font-bold ${item.cor}`}>{item.valor}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <UsageBar limites={limites} />

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Serviços usados</p>
                {servicosDisponiveis.map(s => {
                  const qtd   = meusPedidos.filter(p => p.tipo === s.label && p.status === 'concluido').length
                  const barra = meusPedidos.length > 0 ? (qtd / meusPedidos.length) * 100 : 0
                  return (
                    <div key={s.id} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <span>{s.icon}</span> {s.label}
                        </span>
                        <span className="text-xs font-medium text-gray-700">{qtd}x</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-400 rounded-full transition-all duration-500"
                          style={{ width: `${barra}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={fazerLogout}
                className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors"
              >
                Sair da conta
              </button>
            </>
          )}

        </div>
      </div>

      {/* Nav inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-10">
        {[
          { id: 'solicitar', label: 'Serviços', icon: '🛎️' },
          { id: 'pedidos',   label: 'Pedidos',  icon: '📋', badge: pendentes },
          { id: 'perfil',    label: 'Perfil',   icon: '👤' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setAba(item.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 relative transition-colors ${
              aba === item.id ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute top-2 right-[calc(50%-18px)] bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Modal confirmação */}
      {confirmando && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <span className="text-5xl">{confirmando.icon}</span>
              <h3 className="font-semibold text-gray-800 mt-3 text-lg">{confirmando.label}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Taxa: <span className="text-purple-600 font-semibold">R$ {confirmando.preco.toFixed(2)}</span>
              </p>
              {!limites.ilimitado && (
                <p className="text-xs text-gray-400 mt-2">
                  Restam {limites.restanteSemana} solicitações esta semana
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmando(null)}
                disabled={loadingConfirmar}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={loadingConfirmar}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center"
              >
                {loadingConfirmar
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

function Vazio({ icone, texto }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-4xl mb-2">{icone}</p>
      <p className="text-sm">{texto}</p>
    </div>
  )
}