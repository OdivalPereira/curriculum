import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
}

export function Education() {
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEducation() {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0 && !error) {
          setEducationItems(data);
        } else {
          // Fallback data se o banco estiver vazio ou falhar
          setEducationItems([
            { id: '1', degree: 'Bacharelado em Ciências Contábeis', institution: 'Faculdade de Ponta Porã' },
            { id: '2', degree: 'MBA em Gestão Tributária', institution: 'Em andamento' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching education:', err);
        // Fallback
        setEducationItems([
          { id: '1', degree: 'Bacharelado em Ciências Contábeis', institution: 'Faculdade de Ponta Porã' },
          { id: '2', degree: 'MBA em Gestão Tributária', institution: 'Em andamento' }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchEducation();
  }, []);

  return (
    <section id="education" className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
       <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6 flex items-center gap-2">
         Formação Acadêmica
       </h3>
       
       {loading ? (
         <div className="animate-pulse space-y-4">
           <div><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div></div>
           <div><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div></div>
         </div>
       ) : (
         <div className="space-y-6">
            {educationItems.map((item, index) => (
              <motion.div key={item.id || index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.degree}</h4>
                <p className={`text-xs mt-1 ${item.institution.toLowerCase().includes('andamento') ? 'text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-tighter' : 'text-slate-600 dark:text-slate-400'}`}>
                  {item.institution}
                </p>
                {item.field_of_study && <p className="text-xs text-slate-500 mt-1">{item.field_of_study}</p>}
              </motion.div>
            ))}
         </div>
       )}
    </section>
  );
}
