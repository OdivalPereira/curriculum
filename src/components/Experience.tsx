import { Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

export function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data) setExperiences(data);
      } catch (err) {
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
        <Briefcase size={20} className="text-indigo-500" />
        Experiência Profissional
      </h2>

      {loading ? (
        <div className="text-center py-4 text-slate-500 text-sm">Carregando experiências...</div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id || index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-4 border-l-2 border-indigo-200 dark:border-indigo-500/20"
            >
            <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
            <div className="flex flex-col sm:flex-row justify-between gap-1">
              <h4 className="text-slate-900 dark:text-white font-medium">{exp.company}</h4>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{exp.period}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 uppercase font-bold">{exp.role}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {exp.description}
            </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.technologies.map((tech, i) => (
                  <span key={i} className="px-2 py-1 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
