import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o site
          </Link>
        </div>
        
        <div className="bg-white dark:bg-[#1A1D24] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Área Restrita</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Acesso exclusivo para gerenciamento de conteúdo.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-shadow"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar no Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
