"use client";

import { Module } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";

interface ModuleCardProps {
  module: Module;
  onSelectModule: (moduleId: string) => void;
  index: number;
  isLocked?: boolean;
}

export const ModuleCard = ({ module, onSelectModule, index, isLocked = false }: ModuleCardProps) => {
  const { progress, getModuleProgress } = useProgress();
  const { getPlanBadgeColor, getPlanName } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const completedInModule = module.lessons.length > 0
    ? module.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length
    : 0;

  const progressPercentage = module.lessons.length > 0
    ? getModuleProgress(module.lessons.length, completedInModule)
    : 0;

  const images = [
    "/module1.png",
    "/module3.png",
    "/module4.png",
    "/module6.png",
  ];

  const bgImage = images[index % images.length];

  return (
    <div
      className={`relative w-full aspect-video bg-[#181818] rounded-lg h-[550px] group transition-all duration-300 z-0 hover:z-50 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isLocked && onSelectModule(module.id)}
    >
      <img
        src={bgImage}
        alt={module.title}
        className={`w-full h-full object-cover rounded-lg border border-white/5 group-hover:border-[#0261FF]/50 transition-colors ${isLocked ? 'opacity-30 grayscale' : ''}`}
      />

      {isLocked && module.requiredPlan && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
          <div className="text-center p-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-white font-bold mb-2">Módulo Bloqueado</p>
            <div className={`px-3 py-1 rounded-lg bg-linear-to-r ${getPlanBadgeColor(module.requiredPlan)} text-white text-xs font-bold inline-flex items-center gap-1`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {getPlanName(module.requiredPlan)}
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-[#181818] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10"
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: isHovered ? 1.01 : 1,
          y: isHovered ? -5 : 0,
          opacity: isHovered ? 1 : 0,
          zIndex: isHovered ? 50 : 0
        }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{ pointerEvents: isHovered ? 'auto' : 'none', display: isHovered ? 'block' : 'none' }}
      >
        <div className="relative w-full h-96">
          <img
            src={bgImage}
            alt={module.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#181818] to-transparent opacity-90"></div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#0261FF]/90 backdrop-blur flex items-center justify-center shadow-lg shadow-[#0261FF]/20">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <button className="w-8 h-8 rounded-full bg-[#0261FF] text-white flex items-center justify-center hover:bg-[#0261FF]/90 transition shadow shadow-[#0261FF]/20">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
            <button className="w-8 h-8 rounded-full border-2 border-gray-600 text-gray-400 flex items-center justify-center ml-auto hover:border-white hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span className="text-[#0261FF]">98% Relevante</span>
            <span className="border border-gray-600 px-1 rounded text-gray-500">16+</span>
            <span>{module.lessons.length} Eps</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-gray-200 text-xs font-bold">{module.title}</span>
          </div>

          {progressPercentage > 0 && (
            <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-[#0261FF]" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
