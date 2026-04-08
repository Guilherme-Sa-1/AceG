export default function StatusBadge({ status }) {
  const estilos = {
    pendente:   'bg-yellow-100 text-yellow-800',
    aceito:     'bg-blue-100 text-blue-800',
    concluido:  'bg-green-100 text-green-800',
    cancelado:  'bg-red-100 text-red-800',
  }

  const labels = {
    pendente:  'Pendente',
    aceito:    'Em andamento',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
  }

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${estilos[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {labels[status] ?? status}
    </span>
  )
}