import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { usePedidos } from '../hooks/usePedidos'
import { PLANOS } from '../data/mockData'
import toast from 'react-hot-toast'

const AppContext = createContext(null)
const USUARIO_KEY = 'condoserv_usuario'

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    try {
      const raw = localStorage.getItem(USUARIO_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const { pedidos, criarPedido, atualizarStatus, cancelarPedido, avaliarPedido } = usePedidos()
  const prevPendentesRef = useRef(0)

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
    if (pendentesAgora > prevPendentesRef.current) {
      tocarSom()
      toast('🔔 Novo pedido chegou!', { duration: 3000 })
    }
    prevPendentesRef.current = pendentesAgora
  }, [pedidos, usuarioLogado])

  function fazerLogin(usuario) {
    // Garante que moradores sempre têm plano
    const comPlano = usuario.tipo === 'morador' && !usuario.plano
      ? { ...usuario, plano: 'basic' }
      : usuario
    setUsuarioLogado(comPlano)
    localStorage.setItem(USUARIO_KEY, JSON.stringify(comPlano))
    toast.success(`Bem-vindo, ${comPlano.nome}!`)
  }

  function fazerLogout() {
    setUsuarioLogado(null)
    localStorage.removeItem(USUARIO_KEY)
    prevPendentesRef.current = 0
  }

  function trocarPlano(novoPlanoId) {
    if (!PLANOS[novoPlanoId]) return
    const atualizado = {
      ...usuarioLogado,
      plano:      novoPlanoId,
      prioridade: PLANOS[novoPlanoId].prioridade,
    }
    setUsuarioLogado(atualizado)
    localStorage.setItem(USUARIO_KEY, JSON.stringify(atualizado))
    toast.success(`Plano ${PLANOS[novoPlanoId].nome} ativado!`)
  }

  function handleCriarPedido(tipo, preco, icon) {
    criarPedido(tipo, preco, icon, usuarioLogado)
    toast.success('Pedido solicitado!')
  }

  function handleAceitarPedido(id) {
    atualizarStatus(id, 'aceito')
    toast.success('Pedido aceito!')
  }

  function handleConcluirPedido(id) {
    atualizarStatus(id, 'concluido')
    toast.success('Serviço finalizado!')
  }

  function handleCancelarPedido(id) {
    cancelarPedido(id)
    toast('Pedido cancelado.', { icon: '❌' })
  }

  function handleAvaliarPedido(id, nota) {
    avaliarPedido(id, nota)
    toast.success('Avaliação enviada!')
  }

  return (
    <AppContext.Provider value={{
      usuarioLogado,
      pedidos,
      fazerLogin,
      fazerLogout,
      trocarPlano,
      criarPedido:    handleCriarPedido,
      aceitarPedido:  handleAceitarPedido,
      concluirPedido: handleConcluirPedido,
      cancelarPedido: handleCancelarPedido,
      avaliarPedido:  handleAvaliarPedido,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}