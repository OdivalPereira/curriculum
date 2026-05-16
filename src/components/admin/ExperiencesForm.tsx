import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, Briefcase } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  period_text: string;
  description: string;
  order_index: number;
}

export function ExperiencesForm() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newExp, setNewExp] = useState({ company: '', role: '', period_text: '', description: '', order_index: 0 });

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    try {
      const { data, error } = await supabase.from('experiences').select('*').order('order_index', { ascending: true });
      if (data && !error) setExperiences(data);
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
      const { error } = await supabase.from('experiences').insert([newExp]);
      if (!error) {
        setNewExp({ company: '', role: '', period_text: '', description: '', order_index: 0 });
        await fetchExperiences();
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
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return;
    try {
      await supabase.from('experiences').delete().eq('id', id);
      await fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-8">
      {/* Lista Existente */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Briefcase size={20} /> Experiências Cadastradas
        </h3>
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h4 className="font-bold">{exp.role} <span className="text-slate-500 font-normal">na {exp.company}</span></h4>
                <p className="text-sm text-slate-500">{exp.period_text}</p>
              </div>
              <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {experiences.length === 0 && <p className="text-sm text-slate-500">Nenhuma experiência cadastrada.</p>}
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Formulário de Adição */}
      <form onSubmit={handleAdd} className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold mb-4">Adicionar Nova Experiência</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Empresa</label>
            <input required type="text" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cargo</label>
            <input required type="text" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Período (Ex: Mai/2023 - Atual)</label>
            <input required type="text" value={newExp.period_text} onChange={e => setNewExp({...newExp, period_text: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Ordem de Exibição (1 = topo)</label>
            <input required type="number" value={newExp.order_index} onChange={e => setNewExp({...newExp, order_index: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Descrição das Atividades</label>
            <textarea required rows={3} value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Adicionar Experiência
          </button>
        </div>
      </form>
    </div>
  );
}
