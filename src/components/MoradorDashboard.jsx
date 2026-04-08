import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { servicosDisponiveis } from '../data/mockData'
import PedidoCard from './PedidoCard'

export default function MoradorDashboard() {
  const { usuarioLogado, pedidos, criarPedido, fazerLogout } = useApp()
  const [confirmando, setConfirmando] = useState(null)

  const meusPedidos = pedidos.filter(p => p.apt === usuarioLogado.apt)

  function handleSolicitar(servico) {
    setConfirmando(servico)
  }

  function handleConfirmar() {
    criarPedido(confirmando.label, confirmando.preco, confirmando.icon)
    setConfirmando(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Solicitar serviço */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Solicitar serviço</h2>
          <div className="grid grid-cols-3 gap-3">
            {servicosDisponiveis.map(servico => (
              <button
                key={servico.id}
                onClick={() => handleSolicitar(servico)}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:border-purple-200 hover:shadow-md transition-all active:scale-95"
              >
                <span className="text-3xl">{servico.icon}</span>
                <span className="text-xs text-gray-600 text-center leading-tight">{servico.label}</span>
                <span className="text-xs text-purple-600 font-medium">R$ {servico.preco.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meus pedidos */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
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
                <PedidoCard key={pedido.id} pedido={pedido} mostrarAcoes={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      {confirmando && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <span className="text-5xl">{confirmando.icon}</span>
              <h3 className="font-semibold text-gray-800 mt-2">{confirmando.label}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Taxa de serviço: <span className="text-purple-600 font-medium">R$ {confirmando.preco.toFixed(2)}</span>
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