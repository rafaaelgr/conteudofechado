"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  useEffect(() => {
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
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseDate]);

  if (isReleased) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full bg-linear-to-br from-green-900/20 via-black to-green-900/20 p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center px-4"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)]">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Video Liberada!</h3>
          <p className="text-gray-300 text-sm md:text-base">Recarregue a página para assistir</p>
        </motion.div>
      </motion.div>
    );
  }

  const timeBlocks = [
    { label: "DIAS", value: timeLeft.days, gradient: "from-purple-500 to-pink-500" },
    { label: "HORAS", value: timeLeft.hours, gradient: "from-pink-500 to-red-500" },
    { label: "MINUTOS", value: timeLeft.minutes, gradient: "from-red-500 to-orange-500" },
    { label: "SEGUNDOS", value: timeLeft.seconds, gradient: "from-orange-500 to-yellow-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-linear-to-br from-purple-900/20 via-black to-blue-900/20 p-4 md:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 md:mb-12 px-4"
      >
        <div className="inline-block mb-3 md:mb-4 px-4 md:px-6 py-1.5 md:py-2 bg-linear-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full">
          <span className="text-purple-300 text-xs md:text-sm font-bold uppercase tracking-wider">Em Breve</span>
        </div>
        <h2 className="text-xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent px-2">
          {lessonTitle}
        </h2>
        <p className="text-gray-300 text-xs md:text-lg max-w-md mx-auto px-2">
          Falta pouco! Este vídeo exclusivo será lançado em:
        </p>
        <p className="text-purple-400 font-bold text-sm md:text-xl mt-2">
          {new Date(releaseDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 w-full max-w-4xl px-4 md:px-0">
        {timeBlocks.map((block, index) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl blur-lg md:blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105">
              <div className={`text-2xl md:text-5xl lg:text-6xl font-bold bg-linear-to-br ${block.gradient} bg-clip-text text-transparent mb-1 md:mb-3 tabular-nums`}>
                {String(block.value).padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">
                {block.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};
