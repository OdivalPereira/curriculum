import { Navbar } from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { Hero } from './components/Hero';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { RadarContabil } from './components/RadarContabil';
import { MediaSection } from './components/MediaSection';

export default function App() {
  return (
    <ThemeProvider>
      <div className="bg-slate-50 dark:bg-[#0F1115] min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white transition-colors duration-300">
        <Navbar />
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 pb-12 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/3 flex flex-col gap-6">
          <Hero />
          <Education />
          <Contact />
        </aside>
        
        <main className="w-full lg:w-2/3 flex flex-col gap-6">
          <Experience />
          <Projects />
          <MediaSection />
          <RadarContabil />
          
          <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-widest font-bold gap-4">
            <span>Curriculum v2.0.0</span>
            <span>Built with React & Tailwind</span>
            <span>© {new Date().getFullYear()} Odival Martins Pereira</span>
          </footer>
        </main>
      </div>
    </div>
    </ThemeProvider>
  );
}
