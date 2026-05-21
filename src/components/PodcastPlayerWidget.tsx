import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Headphones,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronRight,
  Podcast,
  Clock,
  Music2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Types ──────────────────────────────────────────────────────────────
interface PodcastShow {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url?: string;
  author?: string;
  category?: string;
}

interface PodcastEpisode {
  id: string;
  show_id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds?: number;
  cover_image_url?: string;
  is_published: boolean;
}

// ─── Mock Data (Fallback) ───────────────────────────────────────────────
const MOCK_SHOWS: PodcastShow[] = [
  {
    id: 'show-1',
    title: 'Reforma Tributária',
    slug: 'reforma-tributaria',
    description: 'Discussões profundas sobre as mudanças e impactos da Reforma Tributária no Brasil.',
    author: 'Odival Pereira',
    category: 'Business > Taxes',
  },
  {
    id: 'show-2',
    title: 'Tributação no Agro Negócio',
    slug: 'tributacao-agronegocio',
    description: 'Tudo sobre a contabilidade rural e a tributação no agronegócio.',
    author: 'Odival Pereira',
    category: 'Business > Agriculture',
  },
  {
    id: 'show-3',
    title: 'Tô ficando louco?!',
    slug: 'to-ficando-louco',
    description: 'Histórias e desabafos do dia a dia da contabilidade.',
    author: 'Odival Pereira',
    category: 'Comedy > Careers',
  },
];

const MOCK_EPISODES: PodcastEpisode[] = [
  {
    id: 'ep-1',
    show_id: 'show-1',
    title: 'O que muda com o IBS e CBS?',
    description: 'Entenda as principais mudanças trazidas pela reforma tributária.',
    audio_url: '',
    duration_seconds: 1245,
    is_published: true,
  },
  {
    id: 'ep-2',
    show_id: 'show-1',
    title: 'Impactos no Simples Nacional',
    description: 'Como o Simples Nacional será afetado pela nova legislação.',
    audio_url: '',
    duration_seconds: 980,
    is_published: true,
  },
  {
    id: 'ep-3',
    show_id: 'show-2',
    title: 'Funrural: Guia Completo',
    description: 'Tudo que você precisa saber sobre o Funrural atualizado.',
    audio_url: '',
    duration_seconds: 1560,
    is_published: true,
  },
  {
    id: 'ep-4',
    show_id: 'show-3',
    title: 'Quando o SPED não fecha...',
    description: 'Relatos cômicos sobre o dia a dia na contabilidade.',
    audio_url: '',
    duration_seconds: 720,
    is_published: true,
  },
];

// ─── Utilities ──────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ─── Component ──────────────────────────────────────────────────────────
export function PodcastPlayerWidget() {
  // UI State
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);

  // Data
  const [shows, setShows] = useState<PodcastShow[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  // Player State
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ─── Fetch Data ─────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        const [showsRes, episodesRes] = await Promise.all([
          supabase.from('podcast_shows').select('*').order('created_at', { ascending: true }),
          supabase.from('podcast_episodes').select('*').eq('is_published', true).order('publish_date', { ascending: false }),
        ]);

        if (showsRes.data && showsRes.data.length > 0) {
          setShows(showsRes.data);
        } else {
          setShows(MOCK_SHOWS);
        }

        if (episodesRes.data && episodesRes.data.length > 0) {
          setEpisodes(episodesRes.data);
        } else {
          setEpisodes(MOCK_EPISODES);
        }
      } catch (err) {
        console.error('Error fetching podcast data:', err);
        setShows(MOCK_SHOWS);
        setEpisodes(MOCK_EPISODES);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ─── Audio Event Handlers ───────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentEpisode]);

  // ─── Playback Controls ─────────────────────────────────────────────
  const playEpisode = useCallback((episode: PodcastEpisode) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    setCurrentEpisode(episode);
    setCurrentTime(0);
    
    if (episode.audio_url) {
      audio.src = episode.audio_url;
      audio.load();
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      // Mock: set duration from episode data
      setDuration(episode.duration_seconds || 0);
      setIsPlaying(false);
    }
  }, [currentEpisode, isPlaying]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;

    if (!currentEpisode.audio_url) {
      // For mock episodes without real audio
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentEpisode]);

  const handleNext = useCallback(() => {
    if (!currentEpisode) return;
    const showEpisodes = episodes.filter(ep => ep.show_id === currentEpisode.show_id);
    const currentIdx = showEpisodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIdx < showEpisodes.length - 1) {
      playEpisode(showEpisodes[currentIdx + 1]);
    }
  }, [currentEpisode, episodes, playEpisode]);

  const handlePrev = useCallback(() => {
    if (!currentEpisode) return;
    const showEpisodes = episodes.filter(ep => ep.show_id === currentEpisode.show_id);
    const currentIdx = showEpisodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIdx > 0) {
      playEpisode(showEpisodes[currentIdx - 1]);
    }
  }, [currentEpisode, episodes, playEpisode]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = percent * (duration || 0);
    
    setCurrentTime(seekTime);
    if (audio && currentEpisode?.audio_url) {
      audio.currentTime = seekTime;
    }
  }, [duration, currentEpisode]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // ─── Get Show for Episode ──────────────────────────────────────────
  const getShowForEpisode = (episode: PodcastEpisode) => 
    shows.find(s => s.id === episode.show_id);

  const getEpisodesForShow = (showId: string) =>
    episodes.filter(ep => ep.show_id === showId);

  const totalEpisodes = episodes.length;

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      {/* Backdrop overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[998]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">
        {/* ─── Expanded Panel ─────────────────────────────────────── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-[360px] sm:w-[390px] max-h-[520px] bg-[#1A1D24] border border-slate-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                    <Podcast size={14} className="text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Podcasts</h3>
                  {totalEpisodes > 0 && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                      {totalEpisodes} ep.
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Minimizar player"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Now Playing */}
              {currentEpisode && (
                <div className="px-5 py-4 bg-[#0F1115]/60 border-b border-slate-800/40">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600/30 to-emerald-500/20 border border-slate-700/40 flex items-center justify-center shrink-0 overflow-hidden">
                      {currentEpisode.cover_image_url ? (
                        <img src={currentEpisode.cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Music2 size={20} className="text-indigo-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{currentEpisode.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">
                        {getShowForEpisode(currentEpisode)?.title || 'Podcast'}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div 
                    ref={progressRef}
                    onClick={handleSeek}
                    className="group relative w-full h-1.5 bg-slate-800 rounded-full cursor-pointer mb-2 hover:h-2 transition-all"
                  >
                    <div 
                      className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-indigo-500/30"
                      style={{ left: duration ? `calc(${(currentTime / duration) * 100}% - 6px)` : '0' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-600">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration || currentEpisode.duration_seconds || 0)}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-5 mt-3">
                    <button
                      onClick={handlePrev}
                      className="p-1 text-slate-500 hover:text-indigo-400 transition-colors disabled:opacity-30"
                      aria-label="Episódio anterior"
                    >
                      <SkipBack size={16} />
                    </button>
                    <button
                      onClick={togglePlayPause}
                      className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/25"
                      aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 text-slate-500 hover:text-indigo-400 transition-colors disabled:opacity-30"
                      aria-label="Próximo episódio"
                    >
                      <SkipForward size={16} />
                    </button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2 mt-3 px-2">
                    <button onClick={toggleMute} className="text-slate-500 hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="podcast-volume-slider flex-1 h-1 appearance-none bg-slate-800 rounded-full cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Episode List */}
              <div className="flex-1 overflow-y-auto podcast-scrollbar">
                {loading ? (
                  <div className="p-5 space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-800/60 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-slate-800/40 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-2">
                    {shows.map(show => {
                      const showEpisodes = getEpisodesForShow(show.id);
                      const isOpen = expandedShowId === show.id;

                      return (
                        <div key={show.id} className="border-b border-slate-800/30 last:border-0">
                          {/* Series Header (Accordion) */}
                          <button
                            onClick={() => setExpandedShowId(isOpen ? null : show.id)}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors text-left"
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500/15 to-orange-500/10 border border-slate-800/50 flex items-center justify-center shrink-0">
                              <Podcast size={16} className="text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{show.title}</p>
                              <p className="text-[10px] text-slate-500 truncate">{show.description}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono text-slate-600">{showEpisodes.length} ep.</span>
                              <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight size={14} className="text-slate-600" />
                              </motion.div>
                            </div>
                          </button>

                          {/* Episodes (Accordion Content) */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-2">
                                  {showEpisodes.length === 0 ? (
                                    <p className="text-[11px] text-slate-600 px-2 py-3 text-center italic">
                                      Nenhum episódio publicado ainda.
                                    </p>
                                  ) : (
                                    showEpisodes.map(episode => {
                                      const isActive = currentEpisode?.id === episode.id;
                                      const isEpisodePlaying = isActive && isPlaying;

                                      return (
                                        <button
                                          key={episode.id}
                                          onClick={() => playEpisode(episode)}
                                          className={`
                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left mb-1
                                            ${isActive 
                                              ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-sm shadow-indigo-500/5' 
                                              : 'hover:bg-slate-800/40 border border-transparent'
                                            }
                                          `}
                                        >
                                          <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
                                            ${isActive 
                                              ? 'bg-indigo-500 text-white' 
                                              : 'bg-slate-800/60 text-slate-500 hover:text-indigo-400 hover:bg-slate-800'
                                            }
                                          `}>
                                            {isEpisodePlaying ? (
                                              <Pause size={12} />
                                            ) : (
                                              <Play size={12} className="ml-0.5" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-[11px] font-medium truncate ${isActive ? 'text-indigo-300' : 'text-slate-300'}`}>
                                              {episode.title}
                                            </p>
                                            {episode.description && (
                                              <p className="text-[10px] text-slate-600 truncate mt-0.5">
                                                {episode.description}
                                              </p>
                                            )}
                                          </div>
                                          {episode.duration_seconds && (
                                            <span className="flex items-center gap-1 text-[9px] font-mono text-slate-600 shrink-0 bg-slate-800/40 px-1.5 py-0.5 rounded">
                                              <Clock size={9} />
                                              {formatDuration(episode.duration_seconds)}
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 border-t border-slate-800/40 bg-[#0F1115]/40">
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest text-center">
                  Podcasts por Odival Pereira
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── FAB Button ─────────────────────────────────────────── */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center
            shadow-xl transition-all duration-300
            ${isExpanded 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 shadow-slate-900/50' 
              : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/30 podcast-fab-pulse'
            }
          `}
          aria-label={isExpanded ? 'Fechar player de podcast' : 'Abrir player de podcast'}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Headphones size={22} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Episode count badge */}
          {!isExpanded && totalEpisodes > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
              {totalEpisodes > 9 ? '9+' : totalEpisodes}
            </span>
          )}

          {/* Playing indicator */}
          {!isExpanded && isPlaying && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-[2px]">
              <span className="w-[2px] h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-[2px] h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-[2px] h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
