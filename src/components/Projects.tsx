import { motion } from 'motion/react';
import { FolderGit2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data) setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
        <FolderGit2 size={20} className="text-emerald-600 dark:text-emerald-400" />
        Projetos & Automações
      </h2>

      {loading ? (
        <div className="text-center py-4 text-slate-500 text-sm">Carregando projetos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {projects.map((project, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={project.id || index} 
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex flex-col group relative"
            >
              <div className="overflow-hidden bg-slate-800 aspect-video relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-50/40 dark:via-slate-900/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white drop-shadow-md">{project.title}</h3>
                  <ExternalLink size={14} className="text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <a href={project.link} className="absolute inset-0 z-10">
                  <span className="sr-only">View project</span>
                </a>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 flex-1 leading-relaxed">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag, i) => (
                     <span key={i} className="px-2 py-1 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                       {tag}
                     </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex flex-col items-center justify-center border-dashed cursor-pointer min-h-[220px]">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-lg group-hover:text-slate-900 dark:text-white transition-colors">+</div>
            <span className="text-xs text-slate-500 mt-2 font-mono group-hover:text-slate-900 dark:text-white transition-colors">Ver Mais Projetos</span>
          </div>
        </div>
      )}
    </section>
  );
}
