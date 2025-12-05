"use client";

import { useState, useEffect } from "react";
import { PlanType } from "@/types/course";

interface AuthState {
  isAuthenticated: boolean;
  plan: PlanType | null;
  isLoading: boolean;
}

const PASSWORDS: Record<string, PlanType> = {
  sousupremo: "diamante",
  sououro: "ouro",
  timeprata: "prata",
};

const PLAN_HIERARCHY: Record<PlanType, number> = {
  prata: 1,
  ouro: 2,
  diamante: 3,
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    plan: null,
    isLoading: true,
  });

  useEffect(() => {
    const storedPlan = localStorage.getItem("userPlan") as PlanType | null;
    if (storedPlan && (storedPlan === "diamante" || storedPlan === "ouro" || storedPlan === "prata")) {
      setAuthState({
        isAuthenticated: true,
        plan: storedPlan,
        isLoading: false,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        plan: null,
        isLoading: false,
      });
    }
  }, []);

  const login = (password: string): boolean => {
    // Normaliza a senha: converte para minúsculas e remove espaços
    const normalizedPassword = password.toLowerCase().replace(/\s+/g, '');
    const plan = PASSWORDS[normalizedPassword];
    if (plan) {
      localStorage.setItem("userPlan", plan);
      setAuthState({
        isAuthenticated: true,
        plan,
        isLoading: false,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("userPlan");
    setAuthState({
      isAuthenticated: false,
      plan: null,
      isLoading: false,
    });
  };

  const hasAccessToModule = (requiredPlan: PlanType): boolean => {
    return true
  };

  const hasAccessToLesson = (requiredPlan?: PlanType): boolean => {
    if (!requiredPlan) return true;
    if (!authState.plan) return false;
    return PLAN_HIERARCHY[authState.plan] >= PLAN_HIERARCHY[requiredPlan];
  };

  const getPlanBadgeColor = (plan: PlanType): string => {
    switch (plan) {
      case "diamante":
        return "from-cyan-400 to-blue-600";
      case "ouro":
        return "from-yellow-400 to-orange-500";
      case "prata":
        return "from-gray-300 to-gray-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getPlanName = (plan: PlanType): string => {
    switch (plan) {
      case "diamante":
        return "Diamante";
      case "ouro":
        return "Ouro";
      case "prata":
        return "Prata";
      default:
        return "";
    }
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    plan: authState.plan,
    isLoading: authState.isLoading,
    login,
    logout,
    hasAccessToModule,
    hasAccessToLesson,
    getPlanBadgeColor,
    getPlanName,
  };
};
