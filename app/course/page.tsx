"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Module, Lesson } from "@/types/course";
import { courseModules } from "@/data/courseData";
import { ModuleCard } from "@/components/ModuleCard";
import { LessonPlayer } from "@/components/LessonPlayer";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Course() {
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const { isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    // All modules are now available, access control is at lesson level
    const availableModules = courseModules;

    const handleSelectModule = (moduleId: string) => {
        const module = availableModules.find((m) => m.id === moduleId);
        if (module) {
            setSelectedModule(module);
            setSelectedLesson(module.lessons[0]);
        }
    };

    const handleBack = () => {
        setSelectedModule(null);
        setSelectedLesson(null);
    };

    const handleSelectLesson = (lesson: Lesson, module: Module) => {
        setSelectedLesson(lesson);
        setSelectedModule(module);
    };

    const handlePlayFeatured = () => {
        if (availableModules.length > 0) {
            handleSelectModule(availableModules[0].id);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="animate-spin h-12 w-12 text-[#0261FF]"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white selection:bg-[#0261FF] selection:text-white">
            <AnimatePresence mode="wait">
                {selectedModule && selectedLesson ? (
                    <motion.div
                        key="player"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-50"
                    >
                        <LessonPlayer
                            modules={availableModules}
                            currentLesson={selectedLesson}
                            currentModule={selectedModule}
                            onBack={handleBack}
                            onSelectLesson={handleSelectLesson}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Navbar onLogout={handleLogout} />

                        {availableModules.length > 0 && (
                            <Hero
                                featuredModule={availableModules[0]}
                                onPlay={handlePlayFeatured}
                            />
                        )}

                        <div className="relative z-20 -mt-10 md:-mt-20 pb-20 px-4 md:px-12 space-y-12">
                            <section>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 hover:text-gray-300 transition cursor-pointer inline-block">
                                    Seus Módulos
                                </h2>
                                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:snap-none md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                                    {availableModules.map((module, index) => (
                                        <div key={module.id} className="shrink-0 w-[85vw] sm:w-[45vw] md:w-auto snap-center md:snap-align-none">
                                            <ModuleCard
                                                module={module}
                                                onSelectModule={handleSelectModule}
                                                index={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
