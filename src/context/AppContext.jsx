import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [pedidos, setPedidos]             = useState([])
  const prevPendentesRef                  = useRef(0)

  // Notificação sonora quando chega novo pedido (para o porteiro)
  function tocarSom() {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch {}
  }

  useEffect(() => {
    if (usuarioLogado?.tipo !== 'porteiro') return
    const pendentesAgora = pedidos.filter(p => p.status === 'pendente').length
    if (pendentesAgora > prevPendentesRef.current) tocarSom()
    prevPendentesRef.current = pendentesAgora
  }, [pedidos, usuarioLogado])

  function fazerLogin(usuario) {
    setUsuarioLogado(usuario)
  }

  function fazerLogout() {
    setUsuarioLogado(null)
    prevPendentesRef.current = 0
  }

  function criarPedido(tipo, preco, icon) {
    const novoPedido = {
      id: Date.now(),
      tipo,
      icon,
      preco,
      apt:         usuarioLogado.apt,
      nomeUsuario: usuarioLogado.nome,
      status:      'pendente',
      criadoEm:    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data:        new Date().toLocaleDateString('pt-BR'),
    }
    setPedidos(prev => [novoPedido, ...prev])
  }

  function atualizarStatus(id, novoStatus) {
    setPedidos(prev =>
      prev.map(p => p.id === id ? { ...p, status: novoStatus } : p)
    )
  }

  function cancelarPedido(id) {
    setPedidos(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'cancelado' } : p)
    )
  }

  return (
    <AppContext.Provider value={{
      usuarioLogado, pedidos,
      fazerLogin, fazerLogout,
      criarPedido, atualizarStatus, cancelarPedido,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}