import { useState } from 'react'
import StatusBadge from './StatusBadge'
import Estrelas from './Estrelas'
import { PLANOS } from '../data/mockData'

export default function PedidoCard({
  pedido,
  mostrarAcoes = false,
  onAceitar,
  onConcluir,
  onCancelar,
  onAvaliar,
}) {
  const [loadingAceitar,  setLoadingAceitar]  = useState(false)
  const [loadingConcluir, setLoadingConcluir] = useState(false)
  const [loadingCancelar, setLoadingCancelar] = useState(false)

  const planoPedido = pedido.planoPedido ? PLANOS[pedido.planoPedido] : null

  async function handleAceitar() {
    setLoadingAceitar(true)
    await new Promise(r => setTimeout(r, 600))
    onAceitar(pedido.id)
    setLoadingAceitar(false)
  }

  async function handleConcluir() {
    setLoadingConcluir(true)
    await new Promise(r => setTimeout(r, 600))
    onConcluir(pedido.id)
    setLoadingConcluir(false)
  }

  async function handleCancelar() {
    setLoadingCancelar(true)
    await new Promise(r => setTimeout(r, 400))
    onCancelar(pedido.id)
    setLoadingCancelar(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{pedido.icon}</span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-medium text-gray-800 text-sm">{pedido.tipo}</p>
              {planoPedido && planoPedido.prioridade > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${planoPedido.corBg} ${planoPedido.corTexto} border ${planoPedido.corBorda}`}>
                  {planoPedido.icone} {planoPedido.nome}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Apto {pedido.apt} · {pedido.criadoEm}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={pedido.status} />

          {mostrarAcoes && pedido.status === 'pendente' && (
            <BotaoAcao label="Aceitar" loading={loadingAceitar} onClick={handleAceitar} cor="blue" />
          )}
          {mostrarAcoes && pedido.status === 'aceito' && (
            <BotaoAcao label="Concluir" loading={loadingConcluir} onClick={handleConcluir} cor="green" />
          )}
          {onCancelar && pedido.status === 'pendente' && (
            <button
              onClick={handleCancelar}
              disabled={loadingCancelar}
              className="text-xs text-red-400 hover:text-red-600 transition-colors px-1 disabled:opacity-40"
            >
              {loadingCancelar ? '...' : '✕'}
            </button>
          )}
        </div>
      </div>

      {pedido.status === 'concluido' && onAvaliar && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {pedido.avaliacao ? 'Sua avaliação:' : 'Avalie o serviço:'}
          </span>
          <Estrelas
            valor={pedido.avaliacao}
            onChange={nota => onAvaliar(pedido.id, nota)}
            soLeitura={!!pedido.avaliacao}
          />
        </div>
      )}
    </div>
  )
}

function BotaoAcao({ label, loading, onClick, cor }) {
  const cores = {
    blue:  'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
  }
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`text-xs ${cores[cor]} text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 min-w-[64px] text-center`}
    >
      {loading
        ? <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        : label
      }
    </button>
  )
}