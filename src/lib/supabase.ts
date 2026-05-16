import { createClient } from '@supabase/supabase-js';

// Adicione as seguintes variáveis no seu arquivo .env.local (para desenvolvimento)
// e no painel do Render (para produção):
// VITE_SUPABASE_URL=sua_url_aqui
// VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
