import { AppProvider, useApp } from './context/AppContext'
import TelaLogin from './components/TelaLogin'
import MoradorDashboard from './components/MoradorDashboard'
import PorteiroDashboard from './components/PorteiroDashboard'

function AppContent() {
  const { usuarioLogado } = useApp()

  if (!usuarioLogado) return <TelaLogin />
  if (usuarioLogado.tipo === 'porteiro') return <PorteiroDashboard />
  return <MoradorDashboard />
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}