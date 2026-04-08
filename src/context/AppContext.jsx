import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [pedidos, setPedidos] = useState([])

  function fazerLogin(usuario) {
    setUsuarioLogado(usuario)
  }

  function fazerLogout() {
    setUsuarioLogado(null)
  }

  function criarPedido(tipo, preco, icon) {
    const novoPedido = {
      id: Date.now(),
      tipo,
      icon,
      preco,
      apt: usuarioLogado.apt,
      nomeUsuario: usuarioLogado.nome,
      status: 'pendente',
      criadoEm: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setPedidos(prev => [novoPedido, ...prev])
  }

  function atualizarStatus(id, novoStatus) {
    setPedidos(prev =>
      prev.map(p => p.id === id ? { ...p, status: novoStatus } : p)
    )
  }

  return (
    <AppContext.Provider value={{ usuarioLogado, pedidos, fazerLogin, fazerLogout, criarPedido, atualizarStatus }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}