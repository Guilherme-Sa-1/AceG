import { useApp } from '../context/AppContext'
import { usuarios, servicosDisponiveis, STATUS_CONFIG } from '../data/mockData'
import Estrelas from './Estrelas'

export default function AdminDashboard() {
  const { pedidos, fazerLogout } = useApp()

  const concluidos = pedidos.filter(p => p.status === 'concluido')
  const totalGeral = concluidos.reduce((a, p) => a + p.preco, 0)

  const comAvaliacao   = concluidos.filter(p => p.avaliacao)
  const mediaAvaliacao = comAvaliacao.length > 0
    ? comAvaliacao.reduce((a, p) => a + p.avaliacao, 0) / comAvaliacao.length
    : 0

  const rankingApts = usuarios
    .filter(u => u.tipo === 'morador')
    .map(u => {
      const mine = concluidos.filter(p => p.apt === u.apt)
      return { ...u, qtd: mine.length, total: mine.reduce((a, p) => a + p.preco, 0) }
    })
    .sort((a, b) => b.qtd - a.qtd)

  const rankingServicos = servicosDisponiveis
    .map(s => ({
      ...s,
      qtd:     concluidos.filter(p => p.tipo === s.label).length,
      receita: concluidos.filter(p => p.tipo === s.label).reduce((a, p) => a + p.preco, 0),
    }))
    .sort((a, b) => b.qtd - a.qtd)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-500">Painel do síndico</p>
          <p className="font-semibold text-gray-800">Visão geral</p>
        </div>
        <button onClick={fazerLogout} className="text-xs text-gray-400 hover:text-gray-600">Sair</button>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { valor: pedidos.length,    label: 'Total pedidos', cor: 'text-purple-600' },
            { valor: concluidos.length, label: 'Concluídos',    cor: 'text-green-600'  },
            { valor: `R$${totalGeral.toFixed(2)}`, label: 'Receita total', cor: 'text-blue-600' },
            { valor: mediaAvaliacao > 0 ? `${mediaAvaliacao.toFixed(1)} ★` : '—', label: 'Média avaliação', cor: 'text-yellow-500' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className={`text-2xl font-bold ${k.cor}`}>{k.valor}</p>
              <p className="text-xs text-gray-500 mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Ranking moradores */}
        <Card titulo="🏆 Ranking de moradores">
          {rankingApts.map((item, i) => (
            <div key={item.apt} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-amber-600'}`}>
                  {i + 1}º
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.nome}</p>
                  <p className="text-xs text-gray-400">Apto {item.apt}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">{item.qtd} pedidos</p>
                <p className="text-xs text-green-600">R$ {item.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Ranking serviços */}
        <Card titulo="📊 Serviços mais solicitados">
          {rankingServicos.map(s => (
            <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span>{s.icon}</span>
                <span className="text-sm text-gray-700">{s.label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{s.qtd}x</p>
                <p className="text-xs text-green-600">R$ {s.receita.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Todos os pedidos com avaliação */}
        {pedidos.length > 0 && (
          <Card titulo="📋 Todos os pedidos">
            {pedidos.map(p => {
              const cfg = STATUS_CONFIG[p.status] ?? {}
              return (
                <div key={p.id} className="py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{p.tipo}</p>
                        <p className="text-xs text-gray-400">Apto {p.apt} · {p.criadoEm}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                  {p.avaliacao && (
                    <div className="mt-1 pl-7">
                      <Estrelas valor={p.avaliacao} soLeitura />
                    </div>
                  )}
                </div>
              )
            })}
          </Card>
        )}

      </div>
    </div>
  )
}

function Card({ titulo, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm font-semibold text-gray-700 mb-3">{titulo}</p>
      {children}
    </div>
  )
}