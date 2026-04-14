export const usuarios = [
  { id: 1, nome: 'Carlos Silva', apt: '1402', senha: '1234', tipo: 'morador', plano: 'basic' },
  { id: 2, nome: 'Ana Souza',    apt: '501',  senha: '1234', tipo: 'morador', plano: 'pro'   },
  { id: 3, nome: 'João Porteiro', apt: null,  senha: 'admin',   tipo: 'porteiro', plano: null },
  { id: 4, nome: 'Síndico',       apt: null,  senha: 'sindico', tipo: 'admin',    plano: null },
]

export const PLANOS = {
  basic: {
    id:            'basic',
    nome:          'Básico',
    preco:         60,
    corBg:         'bg-gray-50',
    corBorda:      'border-gray-200',
    corBotao:      'bg-gray-700 hover:bg-gray-800',
    corTexto:      'text-gray-700',
    corDestaque:   'text-gray-800',
    icone:         '🌱',
    limiteSemana:  4,
    limiteDia:     2,
    ilimitado:     false,
    prioridade:    0,
    beneficios: [
      '4 solicitações por semana',
      'Máximo 2 por dia',
      'Atendimento padrão',
    ],
  },
  pro: {
    id:            'pro',
    nome:          'Intermediário',
    preco:         90,
    corBg:         'bg-blue-50',
    corBorda:      'border-blue-300',
    corBotao:      'bg-blue-600 hover:bg-blue-700',
    corTexto:      'text-blue-700',
    corDestaque:   'text-blue-800',
    icone:         '⚡',
    limiteSemana:  8,
    limiteDia:     3,
    ilimitado:     false,
    prioridade:    1,
    beneficios: [
      '8 solicitações por semana',
      'Máximo 3 por dia',
      'Prioridade média',
    ],
  },
  premium: {
    id:            'premium',
    nome:          'Premium',
    preco:         120,
    corBg:         'bg-purple-50',
    corBorda:      'border-purple-400',
    corBotao:      'bg-purple-600 hover:bg-purple-700',
    corTexto:      'text-purple-700',
    corDestaque:   'text-purple-800',
    icone:         '👑',
    limiteSemana:  Infinity,
    limiteDia:     Infinity,
    ilimitado:     true,
    prioridade:    2,
    beneficios: [
      'Solicitações ilimitadas',
      'Prioridade máxima',
      'Atendimento preferencial',
    ],
  },
}

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