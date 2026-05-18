import { Code2, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [skillsRes, langRes] = await Promise.all([
          supabase.from('skills').select('*').order('order_index', { ascending: true }),
          supabase.from('languages').select('*').order('order_index', { ascending: true })
        ]);
        
        if (skillsRes.data && skillsRes.data.length > 0) {
          setSkills(skillsRes.data);
        } else {
          // Fallback Skills
          setSkills([
            { id: '1', name: 'Gestão Contábil', category: 'Hard Skills' },
            { id: '2', name: 'Contabilidade Rural', category: 'Hard Skills' },
            { id: '3', name: 'Python', category: 'Ferramentas' },
            { id: '4', name: 'Domínio Contábil', category: 'Ferramentas' }
          ]);
        }

        if (langRes.data && langRes.data.length > 0) {
          setLanguages(langRes.data);
        } else {
          // Fallback Languages
          setLanguages([
            { id: '1', name: 'Inglês', proficiency: 'Avançado' },
            { id: '2', name: 'Espanhol', proficiency: 'Intermediário' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching skills/languages:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section id="skills" className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
         <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6 flex items-center gap-2">
           <Code2 size={16} />
           Habilidades Técnicas
         </h3>
         
         {loading ? (
           <div className="animate-pulse flex flex-wrap gap-2">
             <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
             <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
             <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
           </div>
         ) : (
           <div className="flex flex-wrap gap-2">
             {skills.map((skill, index) => (
               <motion.span 
                 key={skill.id}
                 initial={{ opacity: 0, scale: 0.9 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }} 
                 transition={{ delay: index * 0.05 }}
                 className="px-3 py-1 text-xs font-mono rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
               >
                 {skill.name}
               </motion.span>
             ))}
           </div>
         )}
      </section>

      <section id="languages" className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
         <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6 flex items-center gap-2">
           <Languages size={16} />
           Idiomas
         </h3>
         
         {loading ? (
           <div className="animate-pulse space-y-3">
             <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
           </div>
         ) : (
           <div className="space-y-4">
              {languages.map((lang, index) => (
                <motion.div 
                  key={lang.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{lang.name}</span>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{lang.proficiency}</span>
                </motion.div>
              ))}
           </div>
         )}
      </section>
    </div>
  );
}
