"use client";

import { Module } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface CourseHeaderProps {
  modules: Module[];
}

export const CourseHeader = ({ modules }: CourseHeaderProps) => {
  const { progress } = useProgress();

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = progress.completedLessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="bg-black text-white py-12 px-6 lg:px-8 mb-8 rounded-3xl shadow-2xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Plataforma de Cursos
        </h1>
        <p className="text-lg lg:text-xl text-blue-100 mb-6">
          Aprenda no seu ritmo e desenvolva suas habilidades
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Progresso Geral</span>
            <span className="text-sm font-bold">
              {completedLessons}/{totalLessons} Videos
            </span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-right">
            <span className="text-2xl font-bold">{progressPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

