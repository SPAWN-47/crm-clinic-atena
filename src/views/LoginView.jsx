import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-8 shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] p-3 rounded-lg">
              <LogIn size={32} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-[#E5E7EB] text-center mb-2">
            CRM Clinic Atena
          </h2>
          <p className="text-[#94A3B8] text-center mb-8">
            Faça login para acessar o sistema
          </p>

          {error && (
            <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#E5E7EB] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111827] border border-[#334155] rounded-lg px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#E5E7EB] mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111827] border border-[#334155] rounded-lg px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-medium py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#64748B]">
            <p>Versão 1.1 - Autenticação Segura</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

