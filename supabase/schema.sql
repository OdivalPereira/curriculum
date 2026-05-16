-- ==========================================
-- SUPABASE SCHEMA - CURRÍCULO ONLINE
-- ==========================================

-- 1. Criação das Tabelas
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Configuração de Segurança (RLS - Row Level Security)
-- Habilitar RLS nas tabelas
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir LEITURA PÚBLICA (qualquer um pode ver o seu currículo)
CREATE POLICY "Experiências são públicas" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Projetos são públicos" ON public.projects FOR SELECT USING (true);

-- (Nota: Para inserir/editar dados futuramente pelo painel admin, você usará a role de autenticação do Supabase)


-- ==========================================
-- SEED DE DADOS INICIAIS
-- ==========================================

-- Inserindo Experiências
INSERT INTO public.experiences (role, company, period, description, technologies) VALUES
('Encarregado do Departamento Contábil', 'Douralex Contabilidade LTDA', 'Abril/2025 – Março/2026', 'Liderança da equipe contábil e supervisão técnica de fechamentos, garantindo a integridade dos dados e o cumprimento de prazos. Implementação de estratégias de compliance para adaptação à Reforma Tributária.', ARRAY['Gestão', 'Compliance', 'Reforma Tributária']),
('Encarregado do Departamento Contábil', 'Planacont Escritório Contábil LTDA', 'Maio/2024 – Abril/2025', 'Gestão integral dos setores contábil e rural, atendendo uma carteira diversificada de empresas e produtores rurais da região de Dourados. Estruturação de rotinas internas e suporte consultivo especializado.', ARRAY['Contabilidade Rural', 'Gestão de Setores', 'Consultoria']),
('Contador Sênior / Supervisor', 'Carlos Augusto Bezerra Tavares LTDA (Contacar)', 'Setembro/2022 – Dezembro/2023', 'Gestão dos setores contábil, fiscal, rural e pessoal. Supervisão técnica de carteira de clientes corporativos de médio e grande porte. Foco em planejamento tributário estratégico e regularização de passivos contábeis.', ARRAY['Planejamento Tributário', 'Fiscal', 'Gestão de Equipe']),
('Analista Fiscal', 'Rede SHZ (Administração / Postos)', 'Maio/2020 – Janeiro/2022', 'Apuração de tributos indiretos e gestão de conformidade fiscal para redes de combustíveis.', ARRAY['Tributos Indiretos', 'Conformidade Fiscal', 'Combustíveis']);

-- Inserindo Projetos
INSERT INTO public.projects (title, description, image, tags, link) VALUES
('Auditor Contábil Premium', 'Plataforma web robusta para integração entre cliente e contador, com foco em conciliação contábil automatizada, migrações de banco de dados e implementação de funcionalidades estratégicas.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', ARRAY['React', 'Automation', 'DB Migration'], '#'),
('Mix Credit Guru', 'Sistema de simulação avançada para análise técnica do impacto da Reforma Tributária (IBS/CBS).', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', ARRAY['Reforma Tributária', 'IBS/CBS', 'Simulation'], '#'),
('Soluções em Python', 'Desenvolvimento de scripts personalizados para tratamento massivo de dados fiscais e automação de rotinas repetitivas.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', ARRAY['Python', 'Data Processing', 'Automation'], '#');
