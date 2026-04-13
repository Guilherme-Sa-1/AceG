export const usuarios = [
  { id: 1, nome: 'Carlos Silva', apt: '1706', senha: '1234', tipo: 'morador' },
  { id: 2, nome: 'Ana Souza',    apt: '501',  senha: '1234', tipo: 'morador' },
  { id: 3, nome: 'João Porteiro', apt: null,  senha: 'admin', tipo: 'porteiro' },
  { id: 4, nome: 'Gui',       apt: 'gui',  senha: '1234', tipo: 'admin' },
]

export const SERVICE_CONFIG = {
  lixo: {
    id:    'lixo',
    label: 'Retirar lixo',
    icon:  '🗑️',
    preco: 2.50,
    cor:   'green',
  },
  encomenda: {
    id:    'encomenda',
    label: 'Buscar encomenda',
    icon:  '📦',
    preco: 3.00,
    cor:   'blue',
  },
  comida: {
    id:    'comida',
    label: 'Buscar comida',
    icon:  '🍔',
    preco: 3.50,
    cor:   'orange',
  },
}

export const servicosDisponiveis = Object.values(SERVICE_CONFIG)

export const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    bg:    'bg-yellow-100',
    text:  'text-yellow-800',
  },
  aceito: {
    label: 'Em andamento',
    bg:    'bg-blue-100',
    text:  'text-blue-800',
  },
  concluido: {
    label: 'Concluído',
    bg:    'bg-green-100',
    text:  'text-green-800',
  },
  cancelado: {
    label: 'Cancelado',
    bg:    'bg-red-100',
    text:  'text-red-800',
  },
}