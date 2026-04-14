import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'condoserv_pedidos'

function carregarDoStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function salvarNoStorage(pedidos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos))
  } catch {}
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState(() => carregarDoStorage())

  useEffect(() => {
    salvarNoStorage(pedidos)
  }, [pedidos])

  useEffect(() => {
    const interval = setInterval(() => {
      setPedidos(carregarDoStorage())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const criarPedido = useCallback((tipo, preco, icon, usuario) => {
    const novo = {
      id:           Date.now(),
      timestamp:    new Date().toISOString(),
      tipo,
      icon,
      preco,
      apt:          usuario.apt,
      nomeUsuario:  usuario.nome,
      planoPedido:  usuario.plano,
      prioridade:   usuario.prioridade ?? 0,
      status:       'pendente',
      criadoEm:     new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data:         new Date().toLocaleDateString('pt-BR'),
      avaliacao:    null,
    }
    setPedidos(prev => {
      const atualizado = [novo, ...prev]
      salvarNoStorage(atualizado)
      return atualizado
    })
    return novo
  }, [])

  const atualizarStatus = useCallback((id, novoStatus) => {
    setPedidos(prev => {
      const atualizado = prev.map(p =>
        p.id === id ? { ...p, status: novoStatus } : p
      )
      salvarNoStorage(atualizado)
      return atualizado
    })
  }, [])

  const cancelarPedido = useCallback((id) => {
    setPedidos(prev => {
      const atualizado = prev.map(p =>
        p.id === id ? { ...p, status: 'cancelado' } : p
      )
      salvarNoStorage(atualizado)
      return atualizado
    })
  }, [])

  const avaliarPedido = useCallback((id, nota) => {
    setPedidos(prev => {
      const atualizado = prev.map(p =>
        p.id === id ? { ...p, avaliacao: nota } : p
      )
      salvarNoStorage(atualizado)
      return atualizado
    })
  }, [])

  return { pedidos, criarPedido, atualizarStatus, cancelarPedido, avaliarPedido }
}