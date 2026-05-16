-- ==========================================
-- SUPABASE SCHEMA - CURRÍCULO ONLINE & PODCAST
-- ==========================================

-- ==========================================
-- 1. CRIAÇÃO DAS TABELAS
-- ==========================================

-- ------------------------------------------
-- 1.1 Currículo (Resume)
-- ------------------------------------------

CREATE TABLE IF NOT EXISTS public.personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    avatar_url TEXT,
    resume_pdf_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    instagram_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    period_text TEXT, -- Para manter o texto original como "Abril/2025 - Março/2026"
    description TEXT NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Ex: 'Hard Skills', 'Soft Skills', 'Ferramentas'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    proficiency TEXT NOT NULL, -- Ex: 'Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    link TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------
-- 1.2 Podcast
-- ------------------------------------------

CREATE TABLE IF NOT EXISTS public.podcast_shows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    author TEXT,
    category TEXT, -- Ex: 'Business > Careers'
    language TEXT DEFAULT 'pt-BR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.podcast_episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    show_id UUID NOT NULL REFERENCES public.podcast_shows(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    audio_size_bytes BIGINT, -- Para o RSS (enclosure length)
    duration_seconds INTEGER, -- Para o RSS (itunes:duration)
    publish_date TIMESTAMP WITH TIME ZONE,
    cover_image_url TEXT,
    guests TEXT[] DEFAULT '{}',
    transcript TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. BUCKETS DE STORAGE (Comandos ilustrativos)
-- O Supabase Storage geralmente é criado via Dashboard ou API, mas aqui fica a referência SQL
-- ==========================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resume-assets', 'resume-assets', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('podcast-images', 'podcast-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('podcast-audio', 'podcast-audio', true);


-- ==========================================
-- 3. CONFIGURAÇÃO DE SEGURANÇA (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;

-- 3.1 Políticas de Leitura (Pública)
CREATE POLICY "Leitura pública personal_info" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Leitura pública experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Leitura pública education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Leitura pública skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Leitura pública languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Leitura pública projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Leitura pública podcast_shows" ON public.podcast_shows FOR SELECT USING (true);
CREATE POLICY "Leitura pública podcast_episodes" ON public.podcast_episodes FOR SELECT USING (is_published = true);

-- 3.2 Políticas de Escrita (Apenas Autenticados)
-- Nota: Para maior segurança em produção, verifique se auth.uid() pertence a um admin.
CREATE POLICY "Escrita autenticada personal_info" ON public.personal_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada experiences" ON public.experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada education" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada languages" ON public.languages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada podcast_shows" ON public.podcast_shows FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada podcast_episodes" ON public.podcast_episodes FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 4. SEED DE DADOS INICIAIS
-- ==========================================

-- Inserindo Informações Pessoais Base
INSERT INTO public.personal_info (full_name, headline, bio) VALUES
('Odival Pereira', 'Encarregado do Departamento Contábil / Especialista em Agronegócio', 'Contador experiente com foco em gestão contábil, rural e tributária. Liderança de equipes e implementação de estratégias de compliance e Reforma Tributária.');

-- Inserindo Experiências Originais Adaptadas
INSERT INTO public.experiences (role, company, start_date, end_date, period_text, description, technologies, order_index) VALUES
('Encarregado do Departamento Contábil', 'Douralex Contabilidade LTDA', '2025-04-01', '2026-03-31', 'Abril/2025 – Março/2026', 'Liderança da equipe contábil e supervisão técnica de fechamentos, garantindo a integridade dos dados e o cumprimento de prazos. Implementação de estratégias de compliance para adaptação à Reforma Tributária.', ARRAY['Gestão', 'Compliance', 'Reforma Tributária'], 1),
('Encarregado do Departamento Contábil', 'Planacont Escritório Contábil LTDA', '2024-05-01', '2025-04-30', 'Maio/2024 – Abril/2025', 'Gestão integral dos setores contábil e rural, atendendo uma carteira diversificada de empresas e produtores rurais da região de Dourados. Estruturação de rotinas internas e suporte consultivo especializado.', ARRAY['Contabilidade Rural', 'Gestão de Setores', 'Consultoria'], 2),
('Contador Sênior / Supervisor', 'Carlos Augusto Bezerra Tavares LTDA (Contacar)', '2022-09-01', '2023-12-31', 'Setembro/2022 – Dezembro/2023', 'Gestão dos setores contábil, fiscal, rural e pessoal. Supervisão técnica de carteira de clientes corporativos de médio e grande porte. Foco em planejamento tributário estratégico e regularização de passivos contábeis.', ARRAY['Planejamento Tributário', 'Fiscal', 'Gestão de Equipe'], 3),
('Analista Fiscal', 'Rede SHZ (Administração / Postos)', '2020-05-01', '2022-01-31', 'Maio/2020 – Janeiro/2022', 'Apuração de tributos indiretos e gestão de conformidade fiscal para redes de combustíveis.', ARRAY['Tributos Indiretos', 'Conformidade Fiscal', 'Combustíveis'], 4);

-- Inserindo Projetos Originais
INSERT INTO public.projects (title, description, image, tags, link, order_index) VALUES
('Auditor Contábil Premium', 'Plataforma web robusta para integração entre cliente e contador, com foco em conciliação contábil automatizada, migrações de banco de dados e implementação de funcionalidades estratégicas.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', ARRAY['React', 'Automation', 'DB Migration'], '#', 1),
('Mix Credit Guru', 'Sistema de simulação avançada para análise técnica do impacto da Reforma Tributária (IBS/CBS).', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', ARRAY['Reforma Tributária', 'IBS/CBS', 'Simulation'], '#', 2),
('Soluções em Python', 'Desenvolvimento de scripts personalizados para tratamento massivo de dados fiscais e automação de rotinas repetitivas.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', ARRAY['Python', 'Data Processing', 'Automation'], '#', 3);

-- Inserindo Idiomas Originais (Exemplo genérico, ajustar conforme real)
INSERT INTO public.languages (name, proficiency, order_index) VALUES
('Inglês', 'Intermediário', 1),
('Espanhol', 'Básico', 2);

-- Inserindo Séries de Podcast Exemplo
INSERT INTO public.podcast_shows (title, slug, description, author, category) VALUES
('Reforma Tributária', 'reforma-tributaria', 'Discussões profundas sobre as mudanças e impactos da Reforma Tributária no Brasil.', 'Odival Pereira', 'Business > Taxes'),
('Tributação no Agro Negócio', 'tributacao-agronegocio', 'Tudo sobre a contabilidade rural e a tributação no agronegócio.', 'Odival Pereira', 'Business > Agriculture'),
('To ficando louco?!', 'to-ficando-louco', 'Histórias e desabafos do dia a dia da contabilidade.', 'Odival Pereira', 'Comedy > Careers');
