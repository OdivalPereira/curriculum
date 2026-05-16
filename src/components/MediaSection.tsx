import { PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function MediaSection() {
  return (
    <section id="media" className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
        <span className="w-2 h-6 bg-red-500 rounded-full"></span>
        <PlayCircle size={20} className="text-red-500" />
        Conteúdo & Mídia
      </h2>

      <div className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Acompanhe meus conteúdos e análises detalhadas sobre a Reforma Tributária, automação contábil e dicas de carreira.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] text-center cursor-pointer group"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PlayCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Podcast Tributário</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Em Breve: Episódios sobre a transição do IBS/CBS.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] text-center cursor-pointer group"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PlayCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">YouTube / Reels</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Em Breve: Tutoriais práticos de automação em Python.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
