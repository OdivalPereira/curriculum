import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');
  };

  return (
    <nav className="sticky top-0 inset-x-0 bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800 mb-8 transition-colors duration-300">
      <div className="max-w-[1024px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#about" className="text-slate-900 dark:text-white font-bold text-xl tracking-tight flex items-center gap-2">
           <span className="w-6 h-6 rounded bg-indigo-500 text-[10px] flex items-center justify-center text-white">O.</span>
           Odival Martins
        </a>
        <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest font-bold text-slate-500">
           <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.about')}</a>
           <a href="#experience" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.experience')}</a>
           <a href="#projects" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.projects')}</a>
           <a href="#assistente" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.ai')}</a>
           <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.contact')}</a>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleLanguage} className="flex items-center gap-1 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-bold uppercase">
            <Globe size={16} />
            {i18n.language === 'pt' ? 'PT' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
