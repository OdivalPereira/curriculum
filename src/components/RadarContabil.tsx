import { useState } from 'react';
import { Bot, Search, Loader2, AlertCircle } from 'lucide-react';
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

export function RadarContabil() {
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

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, promptInstruction })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data = await res.json();
      
      if (data.error) {
        setErrorMsg(data.error);
      } else {
        setResult(data);
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
