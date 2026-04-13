export default function Estrelas({ valor, onChange, soLeitura = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          disabled={soLeitura}
          onClick={() => onChange?.(n)}
          className={`text-lg transition-transform ${soLeitura ? 'cursor-default' : 'hover:scale-125'} ${
            n <= (valor ?? 0) ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}