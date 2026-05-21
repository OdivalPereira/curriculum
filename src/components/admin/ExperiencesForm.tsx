import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Experience } from '../../types/database';
import { Loader2, Plus, Trash2, Briefcase } from 'lucide-react';

export function ExperiencesForm() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newExp, setNewExp] = useState<Partial<Experience>>({ company: '', role_pt: '', role_en: '', role_es: '', period_text_pt: '', period_text_en: '', period_text_es: '', description_pt: '', description_en: '', description_es: '', order_index: 0, technologies: [] });

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
        setNewExp({ company: '', role_pt: '', role_en: '', role_es: '', period_text_pt: '', period_text_en: '', period_text_es: '', description_pt: '', description_en: '', description_es: '', order_index: 0, technologies: [] });
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
                <h4 className="font-bold">{exp.role_pt} <span className="text-slate-500 font-normal">na {exp.company}</span></h4>
                <p className="text-sm text-slate-500">{exp.period_text_pt}</p>
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
            <label className="block text-sm mb-1">Ordem de Exibição (1 = topo)</label>
            <input required type="number" value={newExp.order_index} onChange={e => setNewExp({...newExp, order_index: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cargo (PT)</label>
            <input required type="text" value={newExp.role_pt} onChange={e => setNewExp({...newExp, role_pt: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cargo (EN)</label>
            <input required type="text" value={newExp.role_en} onChange={e => setNewExp({...newExp, role_en: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cargo (ES)</label>
            <input required type="text" value={newExp.role_es} onChange={e => setNewExp({...newExp, role_es: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm mb-1">Período PT (Ex: Mai/2023 - Atual)</label>
            <input required type="text" value={newExp.period_text_pt} onChange={e => setNewExp({...newExp, period_text_pt: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Período EN</label>
            <input required type="text" value={newExp.period_text_en} onChange={e => setNewExp({...newExp, period_text_en: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Período ES</label>
            <input required type="text" value={newExp.period_text_es} onChange={e => setNewExp({...newExp, period_text_es: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Descrição das Atividades (PT)</label>
            <textarea required rows={3} value={newExp.description_pt} onChange={e => setNewExp({...newExp, description_pt: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Descrição das Atividades (EN)</label>
            <textarea required rows={3} value={newExp.description_en} onChange={e => setNewExp({...newExp, description_en: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Descrição das Atividades (ES)</label>
            <textarea required rows={3} value={newExp.description_es} onChange={e => setNewExp({...newExp, description_es: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
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
