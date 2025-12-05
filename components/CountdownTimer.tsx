"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  releaseDate: string;
  lessonTitle: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ releaseDate, lessonTitle }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReleased, setIsReleased] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const difference = new Date(releaseDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsReleased(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseDate]);

  if (!isMounted) return null;

  if (isReleased) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full bg-black/80 backdrop-blur-sm p-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0261FF]/20 flex items-center justify-center border border-[#0261FF]/50 shadow-[0_0_30px_rgba(2,97,255,0.3)]">
            <svg className="w-10 h-10 text-[#0261FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Conteúdo Liberado!</h3>
          <p className="text-gray-400">Atualize a página para assistir a esta aula.</p>
        </motion.div>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: "DIAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MINUTOS", value: timeLeft.minutes },
    { label: "SEGUNDOS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black/90 p-6 md:p-12 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#0261FF]/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#0261FF]/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0261FF]/10 border border-[#0261FF]/20 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0261FF] animate-pulse" />
            <span className="text-[#0261FF] text-xs font-bold tracking-widest uppercase">Em Breve</span>
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            {lessonTitle}
          </h2>

          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm md:text-base">
            <span>Disponível em</span>
            <span className="text-white font-medium">
              {new Date(releaseDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 w-full">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              className="flex flex-col items-center group"
            >
              <div className="relative">
                <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter tabular-nums leading-none group-hover:text-[#0261FF] transition-colors duration-500">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="absolute -inset-4 bg-[#0261FF]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="mt-4 text-xs md:text-sm font-medium text-gray-500 tracking-[0.2em] group-hover:text-[#0261FF]/80 transition-colors duration-300">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
