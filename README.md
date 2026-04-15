# 🚀 AceG — App de Serviços para Condomínio

Aplicação web desenvolvida em React com foco em facilitar serviços internos de condomínio, como retirada de lixo e coleta de encomendas, conectando moradores e trabalhadores.

---

## 📱 Visão Geral

O AceG é um MVP de um sistema estilo “iFood interno do condomínio”, onde:

* Moradores solicitam serviços rapidamente
* Trabalhadores aceitam e executam tarefas
* Existe controle de uso baseado em planos de assinatura

---

## 🧠 Funcionalidades

### 👤 Morador

* Solicitar retirada de lixo
* Solicitar coleta de encomendas
* Visualizar pedidos ativos
* Cancelar solicitações
* Acompanhar status dos pedidos

### 🛠️ Trabalhador

* Visualizar serviços disponíveis
* Aceitar pedidos
* Finalizar serviços

### 💳 Sistema de Planos

* Plano Básico: limite semanal e diário
* Plano Intermediário
* Plano Premium (ilimitado)
* Controle de uso por usuário
* Bloqueio ao atingir limite

### 🔄 Estados dos pedidos

* `pending` → aguardando
* `accepted` → em andamento
* `completed` → finalizado
* `cancelled` → cancelado

---

## 💰 Modelo de Negócio

O sistema utiliza assinatura mensal:

| Plano         | Preço  | Limite semanal | Limite diário |
| ------------- | ------ | -------------- | ------------- |
| Básico        | R$ 60  | 4 pedidos      | 2 pedidos     |
| Intermediário | R$ 90  | 8 pedidos      | 3 pedidos     |
| Premium       | R$ 120 | Ilimitado      | Ilimitado     |

---

## ⚙️ Tecnologias Utilizadas

* React (Vite)
* JavaScript (ES6+)
* Tailwind CSS
* Lucide Icons
* React Hot Toast

---

## 📁 Estrutura do Projeto

```bash
src/
 ├── components/
 │   ├── LoginScreen.jsx
 │   ├── MoradorDashboard.jsx
 │   ├── WorkerHome.jsx
 │   ├── TelaPlanos.jsx
 │   ├── PedidoCard.jsx
 │   └── UsageBar.jsx
 │
 ├── hooks/
 │   └── usePedidos.js
 │
 ├── data/
 │   └── mockData.js
 │
 ├── App.jsx
 └── main.jsx
```

---

## 🚀 Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar o projeto

```bash
npm run dev
```

Acesse:

```bash
http://localhost:5173
```

---

## ⚠️ Observações (MVP)

* Os dados ainda são locais (sem backend)
* Pagamento ainda é simulado
* Autenticação é simplificada
* Atualizações em tempo real não estão completas

---

## 🔮 Próximos Passos

* [ ] Integração com backend (Firebase ou Supabase)
* [ ] Implementar pagamentos reais (Stripe ou Mercado Pago)
* [ ] Notificações em tempo real
* [ ] Chat entre morador e trabalhador
* [ ] Sistema de avaliação
* [ ] Deploy (Vercel)

---

## 💡 Objetivo

Transformar este projeto em um SaaS escalável para condomínios, com modelo de assinatura e experiência simples e eficiente.

---

## 👨‍💻 Autor

Guilherme Sá
📧 [guilhermecgsa7@gmail.com](mailto:guilhermecgsa7@gmail.com)

---

## 📄 Licença

Este projeto está em fase de desenvolvimento (MVP).
