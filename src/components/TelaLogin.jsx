import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { usuarios } from '../data/mockData'
import toast from 'react-hot-toast'

export default function TelaLogin() {
  const { fazerLogin } = useApp()
  const [modo, setModo]   = useState('login')  // 'login' | 'registro'
  const [apt, setApt]     = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!apt.trim() || !senha.trim()) {
      toast.error('Preencha todos os campos.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))

    const usuario = usuarios.find(
      u => (u.apt === apt || (apt === 'porteiro' && u.tipo === 'porteiro') || (apt === 'sindico' && u.tipo === 'admin')) && u.senha === senha
    )

    if (usuario) {
      fazerLogin(usuario)
    } else {
      toast.error('Apartamento ou senha incorretos.')
    }
    setLoading(false)
  }

  async function handleRegistro() {
    if (!nome.trim() || !apt.trim() || !senha.trim()) {
      toast.error('Preencha todos os campos.')
      return
    }
    if (apt.length < 2) {
      toast.error('Número do apartamento inválido.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    fazerLogin({ id: Date.now(), nome: nome.trim(), apt: apt.trim(), tipo: 'morador' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏢</div>
          <h1 className="text-2xl font-bold text-gray-800">CondoServ</h1>
          <p className="text-gray-500 text-sm mt-1">Serviços do seu condomínio</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {['login', 'registro'].map(m => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                modo === m
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {m === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {modo === 'registro' && (
            <Campo
              label="Seu nome"
              placeholder="Ex: Maria Oliveira"
              value={nome}
              onChange={setNome}
            />
          )}

          <Campo
            label="Apartamento"
            placeholder={modo === 'login' ? 'Ex: 1402 ou porteiro' : 'Ex: 302'}
            value={apt}
            onChange={setApt}
          />

          <Campo
            label="Senha"
            placeholder="Sua senha"
            type="password"
            value={senha}
            onChange={setSenha}
            onEnter={modo === 'login' ? handleLogin : handleRegistro}
          />

          <button
            onClick={modo === 'login' ? handleLogin : handleRegistro}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : modo === 'login' ? 'Entrar' : 'Criar conta'
            }
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Moradores: apto + senha 1234 · Porteiro: porteiro/admin · Síndico: sindico/sindico
        </p>
      </div>
    </div>
  )
}

function Campo({ label, placeholder, value, onChange, type = 'text', onEnter }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
      />
    </div>
  )
}