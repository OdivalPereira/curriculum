import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Save, CheckCircle } from 'lucide-react';

export function PersonalInfoForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    headline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    instagram_url: '',
  });

  useEffect(() => {
    async function fetchPersonalInfo() {
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .limit(1)
          .single();

        if (data && !error) {
          setFormData(data);
        }
      } catch (err) {
        console.error('Erro ao buscar personal info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPersonalInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('personal_info')
        .update({
          full_name: formData.full_name,
          headline: formData.headline,
          bio: formData.bio,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          linkedin_url: formData.linkedin_url,
          instagram_url: formData.instagram_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.id);

      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Erro ao salvar as informações: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erro interno ao tentar salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} />
          <span>Informações atualizadas com sucesso! As mudanças já estão visíveis no site público.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nome Completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-mail Público (Contato)</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Cargo / Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Biografia Profissional</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Localização</label>
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL do LinkedIn</label>
          <input
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL do Instagram</label>
          <input
            type="url"
            name="instagram_url"
            value={formData.instagram_url || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}
