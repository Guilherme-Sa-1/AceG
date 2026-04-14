import { PLANOS } from '../data/mockData'

export default function UsageBar({ limites }) {
  const { usadosSemana, usadosDia, limiteSemana, limiteDia,
          percentualSemana, percentualDia, ilimitado, plano,
          bloqueadoPorDia, bloqueadoPorSemana } = limites

  if (ilimitado) {
    return (
      <div className={`${plano.corBg} border ${plano.corBorda} rounded-2xl p-3 flex items-center gap-3`}>
        <span className="text-xl">{plano.icone}</span>
        <div>
          <p className={`text-xs font-semibold ${plano.corTexto}`}>Plano {plano.nome}</p>
          <p className="text-xs text-gray-500">Solicitações ilimitadas ✨</p>
        </div>
      </div>
    )
  }

  const corBarraSemana = bloqueadoPorSemana ? 'bg-red-400' : percentualSemana >= 75 ? 'bg-yellow-400' : 'bg-purple-400'
  const corBarraDia    = bloqueadoPorDia    ? 'bg-red-400' : percentualDia    >= 75 ? 'bg-yellow-400' : 'bg-blue-400'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{plano.icone}</span>
          <span className={`text-xs font-semibold ${plano.corTexto}`}>Plano {plano.nome}</span>
        </div>
        {(bloqueadoPorDia || bloqueadoPorSemana) && (
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
            Limite atingido
          </span>
        )}
      </div>

      {/* Barra semana */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Esta semana</span>
          <span className={bloqueadoPorSemana ? 'text-red-500 font-semibold' : ''}>
            {usadosSemana}/{limiteSemana}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${corBarraSemana}`}
            style={{ width: `${percentualSemana}%` }}
          />
        </div>
      </div>

      {/* Barra dia */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Hoje</span>
          <span className={bloqueadoPorDia ? 'text-red-500 font-semibold' : ''}>
            {usadosDia}/{limiteDia}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${corBarraDia}`}
            style={{ width: `${percentualDia}%` }}
          />
        </div>
      </div>

      {bloqueadoPorDia && !bloqueadoPorSemana && (
        <p className="text-xs text-yellow-600 bg-yellow-50 rounded-xl px-3 py-2">
          ⚠️ Limite diário atingido. Amanhã você terá novas solicitações.
        </p>
      )}
      {bloqueadoPorSemana && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">
          🚫 Limite semanal atingido. Renova na próxima segunda-feira.
        </p>
      )}
    </div>
  )
}