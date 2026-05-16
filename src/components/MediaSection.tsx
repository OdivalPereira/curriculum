import { PlayCircle, Podcast } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface PodcastShow {
  id: string;
  title: string;
  description: string;
}

export function MediaSection() {
  const [shows, setShows] = useState<PodcastShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      try {
        const { data, error } = await supabase
          .from('podcast_shows')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0 && !error) {
          setShows(data);
        } else {
          // Fallback
          setShows([
            { id: '1', title: 'Podcast Tributário', description: 'Em Breve: Episódios sobre a transição do IBS/CBS.' },
            { id: '2', title: 'Soluções Contábeis', description: 'Histórias e vivências do dia a dia da contabilidade.' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching shows:', err);
        setShows([
          { id: '1', title: 'Podcast Tributário', description: 'Em Breve: Episódios sobre a transição do IBS/CBS.' },
          { id: '2', title: 'Soluções Contábeis', description: 'Histórias e vivências do dia a dia da contabilidade.' }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, []);

  return (
    <section id="media" className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
        <span className="w-2 h-6 bg-red-500 rounded-full"></span>
        <PlayCircle size={20} className="text-red-500" />
        Séries de Podcast
      </h2>

      <div className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Acompanhe meus conteúdos em formato de áudio. Discussões sobre Reforma Tributária, Agronegócio e vivências da área contábil.
        </p>

        {loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
            <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shows.map((show, index) => (
              <motion.div 
                key={show.id}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] text-center cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
                  <Podcast size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 relative z-10">{show.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 relative z-10">{show.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
