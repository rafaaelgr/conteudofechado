export type PlanType = "diamante" | "ouro" | "prata";

export interface LessonButton {
  id: string;
  label: string;
  url: string;
  variant?: "primary" | "secondary" | "outline" | "instagram";
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId?: string;
  videoUrl?: string;
  description: string;
  content?: string;
  email?: string;
  buttons?: LessonButton[];
  requiredPlan?: PlanType;
  releaseDate?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  requiredPlan?: PlanType;
}

export interface CourseProgress {
  completedLessons: string[];
}

export interface UserAuth {
  isAuthenticated: boolean;
  plan: PlanType | null;
}

