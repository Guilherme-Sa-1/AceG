import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { usuarios } from '../data/mockData'

export default function TelaLogin() {
  const { fazerLogin } = useApp()
  const [apt, setApt] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleLogin() {
    const usuario = usuarios.find(
      u => (u.apt === apt || (apt === 'porteiro' && u.tipo === 'porteiro')) && u.senha === senha
    )
    if (usuario) {
      fazerLogin(usuario)
    } else {
      setErro('Apartamento ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏢</div>
          <h1 className="text-2xl font-bold text-gray-800">CondoServ</h1>
          <p className="text-gray-500 text-sm mt-1">Serviços do seu condomínio</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartamento
            </label>
            <input
              type="text"
              placeholder="Ex: 1402 ou porteiro"
              value={apt}
              onChange={e => { setApt(e.target.value); setErro('') }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErro('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Entrar
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Morador: apto + senha 1234 · Porteiro: "porteiro" + admin
        </p>
      </div>
    </div>
  )
}