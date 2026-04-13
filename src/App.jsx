import { AppProvider, useApp } from './context/AppContext'
import TelaLogin from './components/TelaLogin'
import MoradorDashboard from './components/MoradorDashboard'
import PorteiroDashboard from './components/PorteiroDashboard'
import AdminDashboard from './components/AdminDashboard'

function AppContent() {
  const { usuarioLogado } = useApp()

  if (!usuarioLogado)                    return <TelaLogin />
  if (usuarioLogado.tipo === 'porteiro') return <PorteiroDashboard />
  if (usuarioLogado.tipo === 'admin')    return <AdminDashboard />
  return <MoradorDashboard />
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}