import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, GraduationCap } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  description: string;
  order_index: number;
}

export function EducationForm() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', field_of_study: '', description: '', order_index: 0 });

  useEffect(() => {
    fetchEducation();
  }, []);

  async function fetchEducation() {
    try {
      const { data, error } = await supabase.from('education').select('*').order('order_index', { ascending: true });
      if (data && !error) setEducationList(data);
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
      const { error } = await supabase.from('education').insert([newEdu]);
      if (!error) {
        setNewEdu({ institution: '', degree: '', field_of_study: '', description: '', order_index: 0 });
        await fetchEducation();
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
    if (!confirm('Tem certeza que deseja excluir esta formação?')) return;
    try {
      await supabase.from('education').delete().eq('id', id);
      await fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap size={20} /> Formações Cadastradas
        </h3>
        <div className="space-y-4">
          {educationList.map(edu => (
            <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h4 className="font-bold">{edu.degree} em {edu.field_of_study}</h4>
                <p className="text-sm text-slate-500">{edu.institution}</p>
              </div>
              <button onClick={() => handleDelete(edu.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {educationList.length === 0 && <p className="text-sm text-slate-500">Nenhuma formação cadastrada.</p>}
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      <form onSubmit={handleAdd} className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold mb-4">Adicionar Nova Formação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Instituição</label>
            <input required type="text" value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Grau (Ex: Bacharelado)</label>
            <input required type="text" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Área de Estudo (Ex: Ciências Contábeis)</label>
            <input required type="text" value={newEdu.field_of_study} onChange={e => setNewEdu({...newEdu, field_of_study: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Ordem (1 = topo)</label>
            <input required type="number" value={newEdu.order_index} onChange={e => setNewEdu({...newEdu, order_index: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Adicionar Formação
          </button>
        </div>
      </form>
    </div>
  );
}
