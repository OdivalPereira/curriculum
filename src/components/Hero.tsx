import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface PersonalInfo {
  full_name: string;
  headline: string;
  bio: string;
  avatar_url?: string;
}

export function Hero() {
  const { t } = useTranslation();
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .limit(1)
          .single();
        
        if (data && !error) {
          setInfo(data);
        }
      } catch (err) {
        console.error('Error fetching personal info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  const displayName = info?.full_name || t('hero.title');
  const displayHeadline = info?.headline || t('hero.subtitle');
  const displayBio = info?.bio || t('hero.description');
  const displayInitials = displayName.substring(0, 2).toUpperCase();

  return (
    <section id="about" className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-mono tracking-widest uppercase text-slate-500 mb-4 hidden">Hello, I am</p>
        
        {info?.avatar_url ? (
          <img src={info.avatar_url} alt={displayName} className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-indigo-500" />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white">
            {displayInitials}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-3">
             <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
             <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-full mt-4"></div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {displayName}
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-mono text-sm mt-1 font-bold">
              {displayHeadline}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase mt-1">
              {t('hero.tagline')}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed whitespace-pre-line">
              {displayBio}
            </p>
          </>
        )}

        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-indigo-500"></div></div>
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className="w-[92%] h-full bg-emerald-500"></div></div>
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-amber-500"></div></div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Links Rápidos</h3>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#contact" className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{t('hero.contactBtn')}</span>
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#projects" className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{t('hero.projectsBtn')}</span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
