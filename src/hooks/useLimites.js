import { useMemo } from 'react'
import { PLANOS } from '../data/mockData'

function inicioSemana() {
  const hoje = new Date()
  const dia  = hoje.getDay()
  const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1)
  const seg  = new Date(hoje.setDate(diff))
  seg.setHours(0, 0, 0, 0)
  return seg
}

function inicioDia() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function useLimites(pedidos, usuario) {
  return useMemo(() => {
    if (!usuario || !usuario.plano) {
      return {
        usadosSemana: 0,
        usadosDia:    0,
        restanteSemana: 0,
        restanteDia:    0,
        podeolicitar:  false,
        limiteSemana:  0,
        limiteDia:     0,
        ilimitado:     false,
        percentualSemana: 0,
        percentualDia:    0,
        bloqueadoPorDia:  false,
        bloqueadoPorSemana: false,
      }
    }

    const plano     = PLANOS[usuario.plano]
    const meusPedidos = pedidos.filter(p => p.apt === usuario.apt)

    const segAtual  = inicioSemana().getTime()
    const diaAtual  = inicioDia().getTime()

    // Conta pedidos desta semana e deste dia
    // Cancelados ainda contam no limite
    const daSemana = meusPedidos.filter(p => {
      const criado = new Date(p.timestamp ?? 0).getTime()
      return criado >= segAtual
    })

    const doDia = meusPedidos.filter(p => {
      const criado = new Date(p.timestamp ?? 0).getTime()
      return criado >= diaAtual
    })

    const usadosSemana = daSemana.length
    const usadosDia    = doDia.length

    const limiteSemana = plano.limiteSemana
    const limiteDia    = plano.limiteDia
    const ilimitado    = plano.ilimitado

    const restanteSemana = ilimitado ? Infinity : Math.max(0, limiteSemana - usadosSemana)
    const restanteDia    = ilimitado ? Infinity : Math.max(0, limiteDia    - usadosDia)

    const bloqueadoPorSemana = !ilimitado && usadosSemana >= limiteSemana
    const bloqueadoPorDia    = !ilimitado && usadosDia    >= limiteDia

    const podeSolicitar = ilimitado || (!bloqueadoPorSemana && !bloqueadoPorDia)

    const percentualSemana = ilimitado ? 0 : Math.min(100, (usadosSemana / limiteSemana) * 100)
    const percentualDia    = ilimitado ? 0 : Math.min(100, (usadosDia    / limiteDia)    * 100)

    return {
      usadosSemana,
      usadosDia,
      restanteSemana,
      restanteDia,
      podeSolicitar,
      limiteSemana,
      limiteDia,
      ilimitado,
      percentualSemana,
      percentualDia,
      bloqueadoPorDia,
      bloqueadoPorSemana,
      plano,
    }
  }, [pedidos, usuario])
}