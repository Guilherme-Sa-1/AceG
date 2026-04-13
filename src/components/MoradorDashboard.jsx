import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { servicosDisponiveis } from '../data/mockData'
import PedidoCard from './PedidoCard'

export default function MoradorDashboard() {
  const { usuarioLogado, pedidos, criarPedido, cancelarPedido, fazerLogout } = useApp()
  const [aba, setAba]               = useState('solicitar')
  const [confirmando, setConfirmando] = useState(null)

  const meusPedidos  = pedidos.filter(p => p.apt === usuarioLogado.apt)
  const totalGasto   = meusPedidos
    .filter(p => p.status === 'concluido')
    .reduce((acc, p) => acc + p.preco, 0)
  const pendentes    = meusPedidos.filter(p => p.status === 'pendente').length

  function handleConfirmar() {
    criarPedido(confirmando.label, confirmando.preco, confirmando.icon)
    setConfirmando(null)
    setAba('pedidos')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Olá,</p>
          <p className="font-semibold text-gray-800">{usuarioLogado.nome}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
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
              <h2 className="text-sm font-semibold text-gray-700">Solicitar serviço</h2>
              <div className="grid grid-cols-3 gap-3">
                {servicosDisponiveis.map(servico => (
                  <button
                    key={servico.id}
                    onClick={() => setConfirmando(servico)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:border-purple-200 hover:shadow-md transition-all active:scale-95"
                  >
                    <span className="text-3xl">{servico.icon}</span>
                    <span className="text-xs text-gray-600 text-center leading-tight">{servico.label}</span>
                    <span className="text-xs text-purple-600 font-medium">R$ {servico.preco.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ABA: PEDIDOS */}
          {aba === 'pedidos' && (
            <>
              <h2 className="text-sm font-semibold text-gray-700">
                Meus pedidos {meusPedidos.length > 0 && `(${meusPedidos.length})`}
              </h2>
              {meusPedidos.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm">Nenhum pedido ainda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {meusPedidos.map(pedido => (
                    <PedidoCard
                      key={pedido.id}
                      pedido={pedido}
                      mostrarAcoes={false}
                      onCancelar={cancelarPedido}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ABA: PERFIL */}
          {aba === 'perfil' && (
            <>
              <h2 className="text-sm font-semibold text-gray-700">Meu perfil</h2>

              {/* Card resumo */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl mb-3">👤</div>
                <p className="font-semibold text-gray-800 text-lg">{usuarioLogado.nome}</p>
                <p className="text-gray-500 text-sm">Apartamento {usuarioLogado.apt}</p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-purple-600">{meusPedidos.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Total pedidos</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {meusPedidos.filter(p => p.status === 'concluido').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Concluídos</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {totalGasto.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total gasto</p>
                </div>
              </div>

              {/* Histórico por serviço */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Serviços mais usados</p>
                {servicosDisponiveis.map(s => {
                  const qtd = meusPedidos.filter(
                    p => p.tipo === s.label && p.status === 'concluido'
                  ).length
                  return (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span>{s.icon}</span>
                        <span className="text-sm text-gray-700">{s.label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-500">{qtd}x</span>
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

      {/* Barra de navegação inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex">
        {[
          { id: 'solicitar', label: 'Serviços', icon: '🛎️' },
          { id: 'pedidos',   label: 'Pedidos',  icon: '📋', badge: pendentes },
          { id: 'perfil',    label: 'Perfil',   icon: '👤' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setAba(item.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 relative transition-colors ${
              aba === item.id ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute top-2 right-1/4 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Modal de confirmação */}
      {confirmando && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <span className="text-5xl">{confirmando.icon}</span>
              <h3 className="font-semibold text-gray-800 mt-2">{confirmando.label}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Taxa: <span className="text-purple-600 font-medium">R$ {confirmando.preco.toFixed(2)}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmando(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}