import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, Briefcase, GraduationCap, Mic, Settings, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PersonalInfoForm } from '../../components/admin/PersonalInfoForm';
import { ExperiencesForm } from '../../components/admin/ExperiencesForm';
import { EducationForm } from '../../components/admin/EducationForm';
import { PodcastForm } from '../../components/admin/PodcastForm';

type Tab = 'overview' | 'personal' | 'experiences' | 'education' | 'podcast';

export function Dashboard() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#1A1D24] border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="text-lg font-bold flex items-center gap-2">
            <LayoutDashboard className="text-indigo-500" />
            <span>Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Home size={18} />
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'personal' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings size={18} />
            Informações Pessoais
          </button>
          <button 
            onClick={() => setActiveTab('experiences')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'experiences' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Briefcase size={18} />
            Experiências
          </button>
          <button 
            onClick={() => setActiveTab('education')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'education' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <GraduationCap size={18} />
            Formação
          </button>
          <button 
            onClick={() => setActiveTab('podcast')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'podcast' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Mic size={18} />
            Podcasts
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-[#1A1D24] border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
          <span className="font-bold">Admin Panel</span>
          <button onClick={signOut} className="p-2 text-red-500"><LogOut size={20} /></button>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-2xl font-bold capitalize">
                {activeTab === 'overview' && 'Visão Geral'}
                {activeTab === 'personal' && 'Informações Pessoais'}
                {activeTab === 'experiences' && 'Experiências Profissionais'}
                {activeTab === 'education' && 'Formação Acadêmica'}
                {activeTab === 'podcast' && 'Séries de Podcast'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Gerencie o conteúdo exibido no seu currículo virtual.
              </p>
            </header>

            {/* Content Area */}
            <div className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              {activeTab === 'overview' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard size={32} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Bem-vindo ao Painel!</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Use o menu lateral para navegar entre as diferentes seções do seu currículo. 
                    Qualquer alteração feita aqui será refletida imediatamente no site público.
                  </p>
                  <p className="mt-8 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg inline-block border border-amber-200 dark:border-amber-500/20">
                    Em breve: Formulários completos de edição em cada aba!
                  </p>
                </div>
              )}
              
              {activeTab === 'personal' && (
                <PersonalInfoForm />
              )}
              
              {activeTab === 'experiences' && (
                <ExperiencesForm />
              )}

              {activeTab === 'education' && (
                <EducationForm />
              )}

              {activeTab === 'podcast' && (
                <PodcastForm />
              )}
              
              {activeTab !== 'overview' && activeTab !== 'personal' && activeTab !== 'experiences' && activeTab !== 'education' && activeTab !== 'podcast' && (
                 <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Settings size={48} className="mb-4 opacity-20" />
                    <p>O módulo de formulário para "{activeTab}" está em desenvolvimento.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
