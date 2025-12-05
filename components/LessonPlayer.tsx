"use client";

import { Module, Lesson, LessonButton } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";

interface LessonPlayerProps {
  modules: Module[];
  currentLesson: Lesson;
  currentModule: Module;
  onBack: () => void;
  onSelectLesson: (lesson: Lesson, module: Module) => void;
}

const VturbVideo = ({ videoId }: { videoId: string }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = `https://scripts.converteai.net/2bad9c2e-d4ab-4547-8540-c55f45dab1e5/players/${videoId}/v4/embed.html`;
      const fullUrl = `${baseUrl}${window.location.search || '?'}&vl=${encodeURIComponent(window.location.href)}`;
      setSrc(fullUrl);
    }
  }, [videoId]);

  useEffect(() => {
    const scriptId = "vturb-sdk";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  if (!src) return <div className="w-full h-full bg-black animate-pulse" />;

  return (
    <div id={`ifr_${videoId}_wrapper`} className="w-full h-full flex items-center justify-center bg-black">
      <div id={`ifr_${videoId}_aspect`} className="w-full relative h-full">
        <iframe
          frameBorder="0"
          allowFullScreen
          src={src}
          id={`ifr_${videoId}`}
          className="absolute inset-0 w-full h-full"
          referrerPolicy="origin"
        />
      </div>
    </div>
  );
};

export const LessonPlayer = ({
  modules,
  currentLesson,
  currentModule,
  onBack,
  onSelectLesson,
}: LessonPlayerProps) => {
  const { isLessonCompleted, toggleLessonComplete } = useProgress();
  const { hasAccessToLesson, plan, getPlanName } = useAuth();
  const [showControls, setShowControls] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

  const hasAccess = hasAccessToLesson(currentLesson.requiredPlan);
  const isNotYetReleased = currentLesson.releaseDate && new Date(currentLesson.releaseDate) > new Date();

  // Criar lista plana de todas as Videos com seus módulos
  const allLessons = modules.flatMap(module =>
    module.lessons.map(lesson => ({ lesson, module }))
  );

  // Encontrar índice da Video atual
  const currentLessonIndex = allLessons.findIndex(
    item => item.lesson.id === currentLesson.id
  );

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      const previous = allLessons[currentLessonIndex - 1];
      onSelectLesson(previous.lesson, previous.module);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const next = allLessons[currentLessonIndex + 1];
      onSelectLesson(next.lesson, next.module);
    }
  };

  useEffect(() => {
    if (currentModule) {
      setExpandedModules(prev => {
        if (prev.includes(currentModule.id)) return prev;
        return [...prev, currentModule.id];
      });
    }
  }, [currentModule]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleScreenClick = () => {
    if (isMobile) setShowControls(!showControls);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#141414] text-white z-50 flex flex-col"
      onMouseMove={handleMouseMove}
      onClick={handleScreenClick}
    >
      <div className={`absolute top-0 left-0 right-0 p-4 md:p-6 z-20 transition-opacity duration-300 bg-linear-to-b from-black/80 to-transparent pointer-events-none flex justify-between items-start`}>
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition pointer-events-auto">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="font-bold text-base md:text-lg">Voltar</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white/80 hover:text-white transition pointer-events-auto p-3 md:p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 border border-white/10"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`relative flex-1 flex-col bg-black flex overflow-y-auto transition-all duration-500 ${isSidebarOpen && !isMobile ? 'mr-96' : 'mr-0'}`}>
          <div className="flex flex-col min-h-full">
            <div className="relative w-full bg-black flex items-center justify-center shrink-0 min-h-[250px] md:min-h-[50vh]">
              <div className={`w-full h-full max-w-[1920px] mx-auto bg-zinc-900 relative group overflow-hidden ${(!hasAccess || (isNotYetReleased && currentLesson.releaseDate))
                ? 'min-h-[450px] md:min-h-0 md:aspect-video'
                : 'aspect-video'
                }`}>
                {isNotYetReleased && currentLesson.releaseDate ? (
                  <CountdownTimer releaseDate={currentLesson.releaseDate} lessonTitle={currentLesson.title} />
                ) : !hasAccess ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 overflow-y-auto">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 md:p-8 max-w-lg mx-4"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-linear-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 flex items-center justify-center">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">Video Bloqueado</h3>
                      <p className="text-gray-300 mb-3 md:mb-4 text-xs md:text-base px-2">
                        Esta Video está disponível apenas para o plano{" "}
                        <span className="font-bold text-transparent bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text">
                          {currentLesson.requiredPlan?.toUpperCase()}
                        </span>
                        {" "}ou superior.
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6">
                        Seu plano atual:{" "}
                        <span className="font-bold text-gray-300">
                          {plan ? getPlanName(plan) : "Nenhum"}
                        </span>
                      </p>
                      <div className="mt-4 md:mt-8 px-4 md:px-6 py-2 md:py-3 bg-linear-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full inline-block">
                        <span className="text-yellow-300 text-xs md:text-sm font-medium">
                          Faça upgrade para desbloquear
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ) : currentLesson.videoId ? (
                  <VturbVideo videoId={currentLesson.videoId} />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none"></div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-110 transition transform">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 right-0 p-4 md:p-8 transition-opacity duration-300 bg-linear-to-t from-black/90 via-black/60 to-transparent`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="max-w-7xl mx-auto w-full">
                        <h2 className="text-lg md:text-3xl font-bold mb-2 truncate">{currentLesson.title}</h2>
                        <p className="text-gray-300 mb-4 text-sm hidden md:block max-w-2xl">{currentLesson.description}</p>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleLessonComplete(currentLesson.id)}
                              className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${isLessonCompleted(currentLesson.id)
                                ? 'bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/30'
                                : 'bg-[#0261FF] text-white hover:bg-[#0261FF]/80 hover:shadow-[0_0_15px_rgba(2,97,255,0.4)]'}`}
                            >
                              {isLessonCompleted(currentLesson.id) && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              )}
                              {isLessonCompleted(currentLesson.id) ? 'Concluído' : 'Assisti Completo'}
                            </button>

                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white/80 hover:text-white hover:scale-110 transition p-3 md:p-2 bg-white/10 rounded-full backdrop-blur-sm">
                              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Navegação para Videos bloqueadas ou com countdown */}
            {(!hasAccess || isNotYetReleased) && (
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm transition-all ${hasPrevious
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/20'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden md:inline">Video Anterior</span>
                    <span className="md:hidden">Anterior</span>
                  </button>

                  <div className="flex-1 text-center">
                    <p className="text-gray-400 text-xs md:text-sm">
                      Video {currentLessonIndex + 1} de {allLessons.length}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm transition-all ${hasNext
                      ? 'bg-[#0261FF] text-white hover:bg-[#0261FF]/80 hover:shadow-[0_0_15px_rgba(2,97,255,0.4)]'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                      }`}
                  >
                    <span className="hidden md:inline">Próxima Video</span>
                    <span className="md:hidden">Próxima</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {hasAccess && !isNotYetReleased && (
              <div className="w-full max-w-7xl  mx-auto px-4 md:px-8 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="w-full md:w-auto">
                    <h1 className="text-xl md:text-3xl font-bold mb-2">{currentLesson.title}</h1>
                    <p className="text-gray-400 text-sm md:text-base">{currentLesson.description}</p>
                  </div>
                  {currentLesson.videoId && (
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => toggleLessonComplete(currentLesson.id)}
                        className={`flex-1 md:flex-none px-4 py-3 md:px-6 md:py-2.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${isLessonCompleted(currentLesson.id)
                          ? 'bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/30'
                          : 'bg-[#0261FF] text-white hover:bg-[#0261FF]/80 hover:shadow-[0_0_15px_rgba(2,97,255,0.4)]'}`}
                      >
                        {isLessonCompleted(currentLesson.id) && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        )}
                        {isLessonCompleted(currentLesson.id) ? 'Concluído' : 'Assisti Completo'}
                      </button>
                      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white/80 hover:text-white hover:scale-110 transition p-3 md:p-2 bg-white/10 rounded-full backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Botões de Navegação */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                  <button
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm transition-all ${hasPrevious
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/20'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden md:inline">Video Anterior</span>
                    <span className="md:hidden">Anterior</span>
                  </button>

                  <div className="flex-1 text-center">
                    <p className="text-gray-400 text-xs md:text-sm">
                      Video {currentLessonIndex + 1} de {allLessons.length}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm transition-all ${hasNext
                      ? 'bg-[#0261FF] text-white hover:bg-[#0261FF]/80 hover:shadow-[0_0_15px_rgba(2,97,255,0.4)]'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                      }`}
                  >
                    <span className="hidden md:inline">Próxima Video</span>
                    <span className="md:hidden">Próxima</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {(currentLesson.content || (currentLesson.buttons && currentLesson.buttons.length > 0)) && (
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden transition-all duration-300 shadow-xl">
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="w-full flex items-center justify-between p-4 md:p-6 bg-white/5 hover:bg-white/10 transition text-left"
                    >
                      <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#0261FF] rounded-full"></span>
                        Material Complementar
                      </h3>
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isDescriptionExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 md:p-8 pt-0 border-t border-white/5">
                            {currentLesson.content && (
                              <div className="mb-2 pt-2">
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                  {currentLesson.content}
                                </div>
                              </div>
                            )}

                            {currentLesson.email && (
                              <div className="mb-6">
                                <div className="text-gray-300 font-bold leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                  {currentLesson.email}
                                </div>
                              </div>
                            )}

                            {currentLesson.buttons && currentLesson.buttons.length > 0 && (
                              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2">
                                {currentLesson.buttons.map((button) => {
                                  const handleButtonClick = () => {
                                    window.open(button.url, '_blank', 'noopener,noreferrer');
                                  };

                                  const getButtonStyles = () => {
                                    switch (button.variant) {
                                      case 'primary':
                                        return 'bg-green-700 text-white hover:bg-green-700/80 border-transparent';
                                      case 'instagram':
                                        return 'bg-purple-700 text-white hover:bg-purple-700/80 border-transparent';
                                      case 'secondary':
                                        return 'bg-white/10 text-white hover:bg-white/20 border-white/10';
                                      case 'outline':
                                        return 'bg-transparent text-white hover:bg-white/5 border-white/20';
                                      default:
                                        return 'bg-blue-400 text-white hover:bg-blue-400/80 hover:shadow-[0_0_15px_rgba(2,97,255,0.4)] border-transparent';
                                    }
                                  };

                                  return (
                                    <button
                                      key={button.id}
                                      onClick={handleButtonClick}
                                      className={`px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all border ${getButtonStyles()} flex items-center justify-center gap-2 hover:scale-105 transform`}
                                    >
                                      {button.label}
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed md:absolute right-0 top-0 bottom-0 w-full md:w-96 bg-[#141414]/95 backdrop-blur-xl border-l border-white/5 overflow-y-auto z-40 ${isMobile ? 'pt-16' : ''}`}
            >
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#0261FF] rounded-full"></span>
                  Videos
                </h3>
                <div className="space-y-6">
                  {modules.map((module, mIdx) => (
                    <div key={module.id} className="mb-6 last:mb-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full text-[#0261FF] text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2 hover:opacity-80 transition text-left"
                      >
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 ${expandedModules.includes(module.id) ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                        {module.title}
                        <div className="h-px flex-1 bg-linear-to-r from-[#0261FF]/30 to-transparent"></div>
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedModules.includes(module.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-2">
                              {module.lessons.map((lesson, lIdx) => {
                                const isCurrent = lesson.id === currentLesson.id;
                                const isCompleted = isLessonCompleted(lesson.id);
                                const lessonHasAccess = hasAccessToLesson(lesson.requiredPlan);
                                const lessonNotYetReleased = lesson.releaseDate && new Date(lesson.releaseDate) > new Date();
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => {
                                      onSelectLesson(lesson, module);
                                      if (isMobile) setIsSidebarOpen(false);
                                    }}
                                    className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border border-transparent ${isCurrent
                                      ? 'bg-white/10 border-white/10'
                                      : 'hover:bg-white/5'
                                      } ${!lessonHasAccess || lessonNotYetReleased ? 'opacity-60' : ''}`}
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${!lessonHasAccess
                                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                      : lessonNotYetReleased
                                        ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                        : isCurrent
                                          ? 'bg-[#0261FF] text-white shadow-[0_0_10px_rgba(2,97,255,0.4)]'
                                          : isCompleted
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : 'bg-white/5 text-gray-500 group-hover:bg-white/10'
                                      }`}>
                                      {!lessonHasAccess ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                      ) : lessonNotYetReleased ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      ) : isCurrent ? (
                                        <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                      ) : isCompleted ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                      ) : (
                                        <span className="text-[10px] font-bold">{lIdx + 1}</span>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col gap-0.5">
                                        <h4 className={`text-sm font-medium leading-tight ${isCurrent ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-300 group-hover:text-white'}`}>
                                          {lesson.title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-medium text-gray-500">
                                            {lesson.duration}
                                          </span>
                                          {!lessonHasAccess && lesson.requiredPlan && (
                                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                              {lesson.requiredPlan}
                                            </span>
                                          )}
                                          {lessonNotYetReleased && (
                                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                              Em Breve
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
