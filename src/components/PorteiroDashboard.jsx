import { useApp } from '../context/AppContext'
import PedidoCard from './PedidoCard'

export default function PorteiroDashboard() {
  const { usuarioLogado, pedidos, atualizarStatus, fazerLogout } = useApp()

  const pendentes  = pedidos.filter(p => p.status === 'pendente')
  const andamento  = pedidos.filter(p => p.status === 'aceito')
  const concluidos = pedidos.filter(p => p.status === 'concluido')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Painel do porteiro</p>
          <p className="font-semibold text-gray-800">{usuarioLogado.nome}</p>
        </div>
        <div className="flex items-center gap-3">
          {pendentes.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendentes.length} novo{pendentes.length > 1 ? 's' : ''}
            </span>
          )}
          <button onClick={fazerLogout} className="text-xs text-gray-400 hover:text-gray-600">
            Sair
          </button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">

        {/* Pendentes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            🔔 Novos pedidos ({pendentes.length})
          </h2>
          {pendentes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum pedido pendente</p>
          ) : (
            <div className="space-y-2">
              {pendentes.map(p => (
                <PedidoCard
                  key={p.id}
                  pedido={p}
                  mostrarAcoes={true}
                  onAceitar={id => atualizarStatus(id, 'aceito')}
                  onConcluir={id => atualizarStatus(id, 'concluido')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Em andamento */}
        {andamento.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              🔄 Em andamento ({andamento.length})
            </h2>
            <div className="space-y-2">
              {andamento.map(p => (
                <PedidoCard
                  key={p.id}
                  pedido={p}
                  mostrarAcoes={true}
                  onAceitar={id => atualizarStatus(id, 'aceito')}
                  onConcluir={id => atualizarStatus(id, 'concluido')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Concluídos */}
        {concluidos.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              ✅ Concluídos hoje ({concluidos.length})
            </h2>
            <div className="space-y-2">
              {concluidos.map(p => (
                <PedidoCard key={p.id} pedido={p} mostrarAcoes={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}