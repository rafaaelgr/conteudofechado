"use client";

import { courseModules } from "@/data/courseData";
import { Module } from "@/types/course";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroProps {
    featuredModule: Module;
    onPlay: () => void;
}

export const Hero = ({ featuredModule, onPlay }: HeroProps) => {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [previewVideoUrl, setPreviewVideoUrl] = useState("");

    useEffect(() => {
        if (!showInfoModal) {
            setPreviewVideoUrl("");
            return;
        }

        const updateVideo = () => {
            const allLessons = courseModules.flatMap(m => m.lessons).filter(l => l.videoId);
            if (allLessons.length === 0) return;

            const randomLesson = allLessons[Math.floor(Math.random() * allLessons.length)];

            // Parse duration MM:SS to seconds
            const [min, sec] = (randomLesson.duration || "00:00").split(':').map(Number);
            const durationSec = (min * 60) + sec;

            // Pick random start time (leave at least 5 seconds)
            const maxStart = Math.max(0, durationSec - 10);
            const startTime = Math.floor(Math.random() * maxStart);

            const baseUrl = `https://scripts.converteai.net/2bad9c2e-d4ab-4547-8540-c55f45dab1e5/players/${randomLesson.videoId}/v4/embed.html`;
            // Add random cache buster to prevent caching issues if same video selected
            const url = `${baseUrl}?autoplay=true&muted=true&controls=false&start=${startTime}&t=${startTime}`;
            setPreviewVideoUrl(url);
        };

        updateVideo();
        const interval = setInterval(updateVideo, 5000); // Switch every 5 seconds for "pieces" effect

        return () => clearInterval(interval);
    }, [showInfoModal]);

    if (!featuredModule) return null;

    return (
        <>
            <div className="relative w-full h-[80vh] md:h-[56.25vw] md:max-h-[80vh] md:min-h-[500px]">
                <div className="absolute inset-0">
                    <img
                        src="/module1.png"
                        alt={featuredModule.title}
                        className="w-full h-full object-cover brightness-40"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-black/40"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-[#141414]/80 via-transparent to-transparent"></div>
                </div>

                <div className="absolute bottom-20 md:top-[30%] left-4 md:left-12 max-w-xl md:max-w-2xl text-white z-10 md:bottom-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black mb-2 md:mb-4 drop-shadow-lg leading-tight uppercase">
                            Entenda as jogadas que estou utilizando para jogar na roleta!
                        </h1>

                        <div className="flex items-center gap-3 mb-4 md:mb-6 text-[#0261FF] font-bold text-xs md:text-base">
                            <span>100% Relevante</span>
                            <span className="text-gray-300 font-normal">2025</span>
                            <span className="border border-gray-500 px-1 text-[10px] md:text-xs text-gray-300 rounded-sm">+18</span>
                        </div>

                        <p className="text-sm md:text-xl text-shadow-md mb-6 md:mb-8 line-clamp-3 text-gray-200 drop-shadow-md hidden md:block">
                            {featuredModule.description}
                        </p>

                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                onClick={onPlay}
                                className="md:flex-none flex items-center justify-center gap-2 bg-[#0261FF] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-bold text-sm md:text-lg hover:bg-[#0261FF]/90 transition hover:shadow-[0_0_20px_rgba(2,97,255,0.5)]"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Assistir
                            </button>
                            {/* <button
                                onClick={() => setShowInfoModal(true)}
                                className="md:flex-none flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-bold text-sm md:text-lg hover:bg-white/20 transition border border-white/10"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Info
                            </button> */}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* <AnimatePresence>
                {showInfoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInfoModal(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#181818] rounded-xl shadow-2xl overflow-hidden max-h-full flex flex-col"
                        >
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#181818]/50 backdrop-blur flex items-center justify-center text-white hover:bg-[#181818] transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="overflow-y-auto custom-scrollbar">
                                <div className="relative w-full aspect-video bg-black overflow-hidden">
                                    
                                    <div className="absolute inset-0 bg-linear-to-t from-[#181818] to-transparent" />

                                    <div className="absolute bottom-8 left-8 max-w-lg">
                                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                                            {featuredModule.title}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => {
                                                    onPlay();
                                                    setShowInfoModal(false);
                                                }}
                                                className="flex items-center gap-2 bg-[#0261FF] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#0261FF]/90 transition"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                                Assistir
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 grid md:grid-cols-[2fr_1fr] gap-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4 text-[#0261FF] font-bold">
                                            <span>98% Relevante</span>
                                            <span className="text-gray-400 font-normal">2024</span>
                                            <span className="border border-gray-600 px-1 text-xs text-gray-400 rounded-sm">16+</span>
                                            <span className="text-gray-400 font-normal">{featuredModule.lessons.length} Episódios</span>
                                        </div>

                                        <p className="text-white text-lg leading-relaxed mb-8">
                                            {featuredModule.description}
                                        </p>

                                        <div className="border-t border-white/10 pt-6">
                                            <h3 className="text-xl font-bold text-white mb-4">Episódios</h3>
                                            <div className="space-y-4">
                                                {featuredModule.lessons.map((lesson, idx) => (
                                                    <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition group cursor-pointer">
                                                        <div className="text-2xl font-bold text-gray-500 group-hover:text-white w-8">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <h4 className="font-bold text-white">{lesson.title}</h4>
                                                                <span className="text-sm text-gray-400">{lesson.duration}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-400 line-clamp-2">{lesson.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 text-sm">
                                        <div>
                                            <span className="block text-gray-500 mb-1">Elenco:</span>
                                            <span className="text-gray-300 hover:underline cursor-pointer">Rafael Rocha</span>, <span className="text-gray-300 hover:underline cursor-pointer">Equipe Academy</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 mb-1">Gêneros:</span>
                                            <span className="text-gray-300 hover:underline cursor-pointer">Educação</span>, <span className="text-gray-300 hover:underline cursor-pointer">Tecnologia</span>, <span className="text-gray-300 hover:underline cursor-pointer">Desenvolvimento</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 mb-1">Este título é:</span>
                                            <span className="text-gray-300">Inspirador</span>, <span className="text-gray-300">Prático</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence> */}
        </>
    );
};
