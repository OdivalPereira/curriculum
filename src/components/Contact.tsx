import { motion } from 'motion/react';
import { Linkedin, MapPin, User } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex-1 flex flex-col">
       <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
         className="flex flex-col h-full"
       >
          <div className="mb-8">
             <User size={24} className="text-indigo-400 mb-4" />
             <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Vamos conversar.</h2>
             <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
               Estou disponível para novas oportunidades de automação e projetos integrados de finanças. Entre em contato para batermos um papo!
             </p>
             <a href="mailto:odivalmp@gmail.com" className="inline-block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-bold uppercase tracking-widest transition-colors">
               odivalmp@gmail.com
             </a>
             <p className="text-xs font-mono text-slate-500 mt-4">(67) 9 9978-5868</p>
             <p className="text-xs font-mono text-slate-500 mt-1">CRC: MS 013760/O-7</p>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
             <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Perfis</h3>
             <div className="space-y-2">
                <a href="https://www.linkedin.com/in/odival-martins-pereira-6468a1a1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Linkedin size={14} className="text-slate-600 dark:text-slate-400" />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">linkedin.com/in/odival-martins-pereira-6468a1a1</span>
                </a>
             </div>
             
             <div className="flex items-center gap-2 mt-6 text-slate-600 dark:text-slate-400">
                <MapPin size={16} className="text-emerald-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Dourados, MS</span>
             </div>
          </div>
       </motion.div>
    </section>
  );
}
