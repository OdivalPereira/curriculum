import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();
  return (
    <section id="about" className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-mono tracking-widest uppercase text-slate-500 mb-4 hidden">Hello, I am</p>
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-white">OM</div>
        <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-indigo-400 font-mono text-sm mt-1 font-bold">
          {t('hero.subtitle')}
        </p>
        <p className="text-emerald-400 font-mono text-[10px] uppercase mt-1">
          {t('hero.tagline')}
        </p>
        <p className="text-slate-400 text-sm mt-4 leading-relaxed">
          {t('hero.description')}
        </p>

        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-indigo-500"></div></div>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="w-[92%] h-full bg-emerald-500"></div></div>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-amber-500"></div></div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Links Rápidos</h3>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#contact" className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-slate-400">{t('hero.contactBtn')}</span>
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#projects" className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-mono text-slate-400">{t('hero.projectsBtn')}</span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
