import { STATUS_CONFIG } from '../data/mockData'

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    bg:    'bg-gray-100',
    text:  'text-gray-700',
  }
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}