import { motion } from 'motion/react';

export function Education() {
  return (
    <section id="education" className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-6">
       <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6 flex items-center gap-2">
         Formação Acadêmica
       </h3>
       <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h4 className="text-sm font-semibold text-white">Bacharelado em Ciências Contábeis</h4>
            <p className="text-xs text-slate-400 mt-1">UNIPRUDENTE / Faculdade de Ponta Porã</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h4 className="text-sm font-semibold text-white">MBA em Gestão Tributária</h4>
            <p className="text-xs text-emerald-400 mt-1 font-mono uppercase tracking-tighter">Em andamento</p>
          </motion.div>
       </div>
    </section>
  );
}
