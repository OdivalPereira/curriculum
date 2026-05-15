import { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Code2, ExternalLink, Github, Linkedin, Mail, MapPin, User, Bot, Search, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

interface AIResult {
  markdownText: string;
  chart?: {
    title: string;
    type: 'bar' | 'line' | 'pie';
    data: Array<{ name: string; value: number }>;
  } | null;
  timeline?: {
    title: string;
    items: Array<{ date: string; event: string; description: string }>;
  } | null;
}

const experience = [
  {
    role: "Contador Sênior & Desenvolvedor",
    company: "Setor Contábil / Autólogo",
    period: "2020 - Presente",
    description: "Responsável por toda a rotina contábil e fiscal, além do desenvolvimento de ferramentas integradas para automação de processos contábeis e melhoria de performance.",
    technologies: ["Contabilidade", "Fiscal", "Python", "Automação"],
  },
  {
    role: "Analista Contábil Pleno",
    company: "Consultoria Financeira",
    period: "2016 - 2020",
    description: "Fechamento contábil, análise de balanços, apuração de impostos e entrega de obrigações acessórias. Implementação de scripts em VBA/Python para redução de trabalho manual.",
    technologies: ["Tributário", "Obrigações", "Excel/VBA", "Scripts"],
  },
  {
    role: "Assistente Contábil",
    company: "Empresa de Auditoria",
    period: "2013 - 2016",
    description: "Lançamentos contábeis, conciliação bancária e suporte geral à auditoria externa, garantindo a conformidade dos dados financeiros.",
    technologies: ["Lançamentos", "Conciliação", "Auditoria", "ERP"],
  }
];

const projects = [
  {
    title: "Automação de Notas Fiscais",
    description: "Ferramenta desenvolvida para extração automática de dados de NFs e importação direta para o sistema contábil ERP.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "Automação", "ERP"],
    link: "#"
  },
  {
    title: "Dashboard Financeiro",
    description: "Painel interativo para análise de indicadores financeiros (EBITDA, Liquidez) alimentado em tempo real pelos dados da contabilidade.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "TypeScript", "Tailwind"],
    link: "#"
  },
  {
    title: "Sistema de Conciliação",
    description: "Aplicação construída para automatizar o processo de conciliação cruzando extratos bancários com o razão contábil de forma inteligente.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "Lógica", "Desenvolvimento"],
    link: "#"
  },
  {
    title: "Validador SPED Fiscal",
    description: "Script para pré-validação de arquivos do SPED Fiscal antes do envio, identificando inconsistências comuns de forma rápida.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    tags: ["Tributos", "Script", "Excel"],
    link: "#"
  }
];

const skills = [
  "Contabilidade", "Fiscal", "Tributário", "Python", "React", "Automação", "Excel Avançado", "SQL", "Análise de Dados"
];

function Hero() {
  return (
    <section id="about" className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-mono tracking-widest uppercase text-slate-500 mb-4 hidden">Hello, I am</p>
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-white">OD</div>
        <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
          Odival. <br className="hidden" />
          <span className="hidden">Software Engineer.</span>
        </h1>
        <p className="text-indigo-400 font-mono text-sm mt-1">Contador & Desenvolvedor de Ferramentas</p>
        <p className="text-slate-400 text-sm mt-4 leading-relaxed">
          Sou contador de profissão com forte base técnica em programação.
          Atuo unindo minha expertise contábil ao desenvolvimento de ferramentas 
          excepcionais para automação e análise de dados no setor financeiro.
        </p>

        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-indigo-500"></div></div>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="w-[92%] h-full bg-emerald-500"></div></div>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-amber-500"></div></div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Links Rápidos</h3>
          <a href="#contact" className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-slate-400">Entrar em contato</span>
          </a>
          <a href="#projects" className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-mono text-slate-400">Ver Projetos</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
        <Briefcase size={20} className="text-indigo-400" />
        Experiência Profissional
      </h2>

      <div className="space-y-6">
        {experience.map((job, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index} 
            className="relative pl-8 border-l border-slate-800"
          >
            <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
            <div className="flex flex-col sm:flex-row justify-between gap-1">
              <h4 className="text-white font-medium">{job.company}</h4>
              <span className="text-xs font-mono text-indigo-400">{job.period}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold">{job.role}</p>
            <p className="text-sm text-slate-400 mt-2">
              {job.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.technologies.map(tech => (
                <span key={tech} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 uppercase font-bold">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
        <Code2 size={20} className="text-emerald-400" />
        Projetos Selecionados
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {projects.map((project, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index} 
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/50 transition-colors flex flex-col group relative"
          >
            <div className="overflow-hidden rounded-lg bg-slate-800 aspect-video mb-4 relative">
              <img 
                src={project.image} 
                alt={project.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:opacity-0 transition-opacity duration-300"></div>
              <a href={project.link} className="absolute inset-0 z-10">
                <span className="sr-only">View project</span>
              </a>
            </div>
            
            <div className="flex flex-col flex-1">
              <h4 className="text-white font-semibold flex justify-between items-center group-hover:text-amber-400 transition-colors">
                 {project.title}
                 <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
              </h4>
              <p className="text-xs text-slate-500 mt-2 flex-1">{project.description}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {project.tags.map(tag => (
                   <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 uppercase font-bold">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        {/* Mock "View More" card like the target theme */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/50 transition-colors flex flex-col items-center justify-center border-dashed cursor-pointer min-h-[220px]">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-lg group-hover:text-white transition-colors">+</div>
          <span className="text-xs text-slate-500 mt-2 font-mono group-hover:text-white transition-colors">Ver Mais Projetos</span>
        </div>
      </div>
    </section>
  );
}

function RadarContabil() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AIResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMode, setResponseMode] = useState<'completa' | 'simples'>('completa');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    
    try {
      const promptInstruction = responseMode === 'completa' 
        ? "Forneça uma resposta rica, pontual e detalhada, trazendo as notícias e normativas mais recentes. Estruture bem a informação e inclua as fontes. Use tabelas em markdown no texto para comparar dados ou normas se aplicável."
        : "FOR DUMMIES: Forneça uma resposta extremamente simples, didática e curta, com foco exclusivo em leigos que não entendem nada de contabilidade. Use analogias, evite jargões complexos. Vá direto ao ponto e foque em 'o que significa isso de forma simples e direta'.";

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Você é um assistente proativo especializado em contabilidade, finanças corporativas e direito tributário brasileiro.
        Faça uma pesquisa atualizada na internet sobre o tema: "${query}".

        ${promptInstruction}

        OBRIGATÓRIO: Retorne os dados estritamente em um JSON nativo, com a exata estrutura abaixo:
        {
          "markdownText": "Sua resposta explicativa formatada em Markdown (use tabelas em markdown aqui se ajudar). Inclua obrigatoriamente as fontes ao final.",
          "chart": {
             "title": "Título do Gráfico",
             "type": "bar", // ou "line" ou "pie"
             "data": [ { "name": "Rótulo", "value": 10 } ]
          }, // ou null se não houver dados quantitativos ou de valores comparáveis
          "timeline": {
             "title": "Acontecimentos Cronológicos",
             "items": [ { "date": "Data", "event": "Evento", "description": "Breve explicação" } ]
          } // ou null se não houver histórico para mostrar
        }
        
        Você deve identificar dados e criar ilustrações sempre que possível (por exemplo, construir um 'chart' para alíquotas ou valores ou quantidade, e 'timeline' para mostrar a linha do tempo de uma lei ou fato novo). Seja arrojado, se houver qualquer número que dê para preencher um gráfico, preencha.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        }
      });

      if (response.text) {
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
           jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonStr.startsWith("```")) {
           jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
        }
        const parsed = JSON.parse(jsonStr) as AIResult;
        setResult(parsed);
      } else {
        setErrorMsg('Nenhum texto retornado pela IA.');
      }
    } catch (error) {
      setErrorMsg('Ocorreu um erro ao buscar as informações ou ao processar o formato JSON. Verifique o console para mais detalhes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!result?.chart || !result.chart.data || result.chart.data.length === 0) return null;
    const { title, type, data } = result.chart;

    return (
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-5 mt-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">{title}</h3>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0F1115', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                   {data.map((entry, index) => (
                      <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                </Bar>
              </BarChart>
            ) : type === 'pie' ? (
              <PieChart>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0F1115', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#6366f1" label={({name, percent}) => `\${name} \${(percent * 100).toFixed(0)}%`}>
                   {data.map((entry, index) => (
                      <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                </Pie>
              </PieChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0F1115', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    if (!result?.timeline || !result.timeline.items || result.timeline.items.length === 0) return null;
    return (
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 mt-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">{result.timeline.title}</h3>
        <div className="space-y-6">
          {result.timeline.items.map((item, idx) => (
            <div key={idx} className="relative pl-8 border-l-2 border-slate-700 pb-2 last:pb-0">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-white">{item.event}</h4>
                <span className="text-[10px] sm:self-start font-mono text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded">{item.date}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="assistente" className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
        <Bot size={20} className="text-amber-400" />
        Assistente Contábil de IA
      </h2>

      <div className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Para agregar valor real ao negócio, desenvolvi este assistente integrado à web. 
          Pergunte sobre atualizações fiscais, mudanças de alíquotas ou as últimas obrigações do SPED (ex: "Qual a novidade do ICMS em SP?"):
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold tracking-widest">Modo de Resposta:</span>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setResponseMode('completa')}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 \${responseMode === 'completa' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Detalhada
              </button>
              <button
                type="button"
                onClick={() => setResponseMode('simples')}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 \${responseMode === 'simples' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Direta & Simples
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Últimas notícias sobre a reforma tributária..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors focus:ring-1 focus:ring-indigo-500"
              />
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
              {loading ? 'Buscando...' : 'Pesquisar'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{errorMsg}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-6 text-sm text-slate-300 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/50 text-[10px] uppercase font-mono tracking-widest text-slate-500">
              <span>Resultado da IA</span>
              <span className={responseMode === 'completa' ? 'text-indigo-400' : 'text-emerald-400'}>
                Modo: {responseMode === 'completa' ? 'Detalhado' : 'Direto & Simples'}
              </span>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none prose-a:text-indigo-400 prose-headings:text-slate-200">
              <Markdown>{result.markdownText}</Markdown>
            </div>

            {renderChart()}
            {renderTimeline()}
          </div>
        )}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col">
       <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
         className="flex flex-col h-full"
       >
          <div className="mb-8">
             <User size={24} className="text-indigo-400 mb-4" />
             <h2 className="text-lg font-bold text-white mb-2">Vamos conversar.</h2>
             <p className="text-sm text-slate-400 mb-4">
               Estou disponível para novas oportunidades de automação e projetos integrados de finanças. Entre em contato para batermos um papo!
             </p>
             <a href="mailto:odivalmp@gmail.com" className="inline-block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-bold uppercase tracking-widest transition-colors">
               odivalmp@gmail.com
             </a>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800">
             <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Perfis</h3>
             <div className="space-y-2">
                <a href="#" className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
                    <Github size={14} className="text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">github.com/odival</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
                    <Linkedin size={14} className="text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">linkedin.com/in/odival</span>
                </a>
             </div>
             
             <div className="flex items-center gap-2 mt-6 text-slate-400">
                <MapPin size={16} className="text-emerald-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Remote / Earth</span>
             </div>
          </div>
       </motion.div>
    </section>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 inset-x-0 bg-[#0F1115]/80 backdrop-blur-md z-50 border-b border-slate-800 mb-8">
      <div className="max-w-[1024px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#about" className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
           <span className="w-6 h-6 rounded bg-indigo-500 text-[10px] flex items-center justify-center text-white">O.</span>
           Odival
        </a>
        <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest font-bold text-slate-500">
           <a href="#about" className="hover:text-white transition-colors">Sobre</a>
           <a href="#experience" className="hover:text-white transition-colors">Experiência</a>
           <a href="#projects" className="hover:text-white transition-colors">Projetos</a>
           <a href="#assistente" className="hover:text-white transition-colors">Assistente IA</a>
           <a href="#contact" className="hover:text-white transition-colors">Contato</a>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="bg-[#0F1115] min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">
      <Navbar />
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 pb-12 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/3 flex flex-col gap-6">
          <Hero />
          <Contact />
        </aside>
        
        <main className="w-full lg:w-2/3 flex flex-col gap-6">
          <Experience />
          <Projects />
          <RadarContabil />
          
          <footer className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 uppercase tracking-widest font-bold gap-4">
            <span>Curriculum v1.0.0</span>
            <span>Built with React & Tailwind</span>
            <span>© {new Date().getFullYear()} Odival</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
