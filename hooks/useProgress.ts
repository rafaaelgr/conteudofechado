"use client";

import { useState, useEffect } from "react";
import { CourseProgress } from "@/types/course";

const STORAGE_KEY = "course-progress";

export const useProgress = () => {
    const [progress, setProgress] = useState<CourseProgress>({
        completedLessons: [],
    });

    useEffect(() => {
        const storedProgress = localStorage.getItem(STORAGE_KEY);
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
    }, []);

    const saveProgress = (newProgress: CourseProgress) => {
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    };

    const toggleLessonComplete = (lessonId: string) => {
        const newCompletedLessons = progress.completedLessons.includes(lessonId)
            ? progress.completedLessons.filter((id) => id !== lessonId)
            : [...progress.completedLessons, lessonId];

        saveProgress({ completedLessons: newCompletedLessons });
    };

    const isLessonCompleted = (lessonId: string): boolean => {
        return progress.completedLessons.includes(lessonId);
    };

    const getModuleProgress = (totalLessons: number, completedInModule: number): number => {
        if (totalLessons === 0) return 0;
        return Math.round((completedInModule / totalLessons) * 100);
    };

    return {
        progress,
        toggleLessonComplete,
        isLessonCompleted,
        getModuleProgress,
    };
};

