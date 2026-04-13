import { useApp } from '../context/AppContext'
import { usuarios, servicosDisponiveis } from '../data/mockData'

export default function AdminDashboard() {
  const { pedidos, fazerLogout } = useApp()

  const concluidos = pedidos.filter(p => p.status === 'concluido')
  const totalGeral = concluidos.reduce((acc, p) => acc + p.preco, 0)

  // Ranking de apartamentos
  const rankingApts = usuarios
    .filter(u => u.tipo === 'morador')
    .map(u => {
      const pedidosApt = concluidos.filter(p => p.apt === u.apt)
      return {
        nome: u.nome,
        apt:  u.apt,
        qtd:  pedidosApt.length,
        total: pedidosApt.reduce((acc, p) => acc + p.preco, 0),
      }
    })
    .sort((a, b) => b.qtd - a.qtd)

  // Ranking de serviços
  const rankingServicos = servicosDisponiveis.map(s => ({
    ...s,
    qtd: concluidos.filter(p => p.tipo === s.label).length,
    receita: concluidos
      .filter(p => p.tipo === s.label)
      .reduce((acc, p) => acc + p.preco, 0),
  })).sort((a, b) => b.qtd - a.qtd)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Painel do síndico</p>
          <p className="font-semibold text-gray-800">Visão geral</p>
        </div>
        <button onClick={fazerLogout} className="text-xs text-gray-400 hover:text-gray-600">
          Sair
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">

        {/* KPIs gerais */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{pedidos.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total pedidos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{concluidos.length}</p>
            <p className="text-xs text-gray-500 mt-1">Concluídos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-lg font-bold text-blue-600">R${totalGeral.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Receita total</p>
          </div>
        </div>

        {/* Ranking de apartamentos */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">🏆 Ranking de moradores</p>
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
        </div>

        {/* Ranking de serviços */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">📊 Serviços mais solicitados</p>
          {rankingServicos.map(s => (
            <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span>{s.icon}</span>
                <span className="text-sm text-gray-700">{s.label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">{s.qtd}x</p>
                <p className="text-xs text-green-600">R$ {s.receita.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Todos os pedidos */}
        {pedidos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">📋 Todos os pedidos</p>
            <div className="space-y-2">
              {pedidos.map(p => (
                <div key={p.id} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <div>
                      <p className="text-gray-700 text-xs font-medium">{p.tipo}</p>
                      <p className="text-gray-400 text-xs">Apto {p.apt} · {p.criadoEm}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    p.status === 'concluido' ? 'bg-green-100 text-green-700' :
                    p.status === 'aceito'    ? 'bg-blue-100 text-blue-700' :
                    p.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}