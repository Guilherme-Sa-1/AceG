import { useApp } from '../context/AppContext'
import PedidoCard from './PedidoCard'

function ordenarPorPrioridade(lista) {
  return [...lista].sort((a, b) => (b.prioridade ?? 0) - (a.prioridade ?? 0))
}

export default function PorteiroDashboard() {
  const { usuarioLogado, pedidos, aceitarPedido, concluirPedido, fazerLogout } = useApp()

  const pendentes  = ordenarPorPrioridade(pedidos.filter(p => p.status === 'pendente'))
  const andamento  = ordenarPorPrioridade(pedidos.filter(p => p.status === 'aceito'))
  const concluidos = pedidos.filter(p => p.status === 'concluido')
  const totalHoje  = concluidos.reduce((a, p) => a + p.preco, 0)

  const stats = [
    { valor: pendentes.length,  label: 'Pendentes',  cor: 'text-yellow-500' },
    { valor: concluidos.length, label: 'Concluídos', cor: 'text-green-600'  },
    { valor: `R$${totalHoje.toFixed(2)}`, label: 'Arrecadado', cor: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-500">Painel do porteiro</p>
          <p className="font-semibold text-gray-800">{usuarioLogado.nome}</p>
        </div>
        <div className="flex items-center gap-3">
          {pendentes.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              {pendentes.length} novo{pendentes.length > 1 ? 's' : ''}
            </span>
          )}
          <button onClick={fazerLogout} className="text-xs text-gray-400 hover:text-gray-600">
            Sair
          </button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">

        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className={`text-xl font-bold ${s.cor}`}>{s.valor}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <Secao titulo={`🔔 Novos pedidos (${pendentes.length})`}>
          {pendentes.length === 0
            ? <p className="text-sm text-gray-400 text-center py-4">Nenhum pedido pendente</p>
            : pendentes.map(p => (
                <PedidoCard
                  key={p.id} pedido={p} mostrarAcoes
                  onAceitar={aceitarPedido}
                  onConcluir={concluirPedido}
                />
              ))
          }
        </Secao>

        {andamento.length > 0 && (
          <Secao titulo={`🔄 Em andamento (${andamento.length})`}>
            {andamento.map(p => (
              <PedidoCard
                key={p.id} pedido={p} mostrarAcoes
                onAceitar={aceitarPedido}
                onConcluir={concluirPedido}
              />
            ))}
          </Secao>
        )}

        {concluidos.length > 0 && (
          <Secao titulo={`✅ Concluídos (${concluidos.length})`}>
            {concluidos.map(p => (
              <PedidoCard key={p.id} pedido={p} />
            ))}
          </Secao>
        )}

      </div>
    </div>
  )
}

function Secao({ titulo, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{titulo}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}