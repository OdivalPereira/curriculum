import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, Mic } from 'lucide-react';

interface Show {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
}

export function PodcastForm() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newShow, setNewShow] = useState({ title: '', slug: '', description: '', author: 'Odival Pereira' });

  useEffect(() => {
    fetchShows();
  }, []);

  async function fetchShows() {
    try {
      const { data, error } = await supabase.from('podcast_shows').select('*').order('created_at', { ascending: true });
      if (data && !error) setShows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slugValue = newShow.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { error } = await supabase.from('podcast_shows').insert([{ ...newShow, slug: slugValue }]);
      if (!error) {
        setNewShow({ title: '', slug: '', description: '', author: 'Odival Pereira' });
        await fetchShows();
      } else {
        alert('Erro ao adicionar: ' + error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta linha apagará também os episódios atrelados a ela. Tem certeza?')) return;
    try {
      await supabase.from('podcast_shows').delete().eq('id', id);
      await fetchShows();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mic size={20} /> Linhas Editoriais (Shows)
        </h3>
        <div className="space-y-4">
          {shows.map(show => (
            <div key={show.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h4 className="font-bold">{show.title}</h4>
                <p className="text-sm text-slate-500">{show.description}</p>
                <p className="text-xs text-indigo-400 mt-1 font-mono">slug: {show.slug}</p>
              </div>
              <button onClick={() => handleDelete(show.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {shows.length === 0 && <p className="text-sm text-slate-500">Nenhuma série cadastrada.</p>}
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      <form onSubmit={handleAdd} className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold mb-4">Adicionar Nova Série de Podcast</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Título da Série</label>
            <input required type="text" value={newShow.title} onChange={e => setNewShow({...newShow, title: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Descrição</label>
            <textarea required rows={2} value={newShow.description} onChange={e => setNewShow({...newShow, description: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Criar Série
          </button>
        </div>
      </form>
    </div>
  );
}
