import StatusBadge from './StatusBadge'

export default function PedidoCard({ pedido, mostrarAcoes, onAceitar, onConcluir }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{pedido.icon}</span>
        <div>
          <p className="font-medium text-gray-800 text-sm">{pedido.tipo}</p>
          <p className="text-xs text-gray-500">Apto {pedido.apt} · {pedido.criadoEm}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusBadge status={pedido.status} />

        {mostrarAcoes && pedido.status === 'pendente' && (
          <button
            onClick={() => onAceitar(pedido.id)}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Aceitar
          </button>
        )}

        {mostrarAcoes && pedido.status === 'aceito' && (
          <button
            onClick={() => onConcluir(pedido.id)}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Concluir
          </button>
        )}
      </div>
    </div>
  )
}