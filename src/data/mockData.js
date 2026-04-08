export const usuarios = [
  { id: 1, nome: 'Carlos Silva', apt: '1402', senha: '1234', tipo: 'morador' },
  { id: 2, nome: 'Ana Souza',    apt: '501',  senha: '1234', tipo: 'morador' },
  { id: 3, nome: 'Guilherme Sá', apt: null,  senha: 'admin', tipo: 'porteiro' },
  { id: 4, nome: 'Guilherme Sá', apt: 'admin',  senha: 'admin', tipo: 'admin' },
];

export const servicosDisponiveis = [
  { id: 'lixo',      label: 'Retirar lixo',    icon: '🗑️', preco: 2.50 },
  { id: 'encomenda', label: 'Buscar encomenda', icon: '📦', preco: 3.00 },
  { id: 'comida',    label: 'Buscar comida',    icon: '🍔', preco: 3.50 },
];