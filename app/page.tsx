"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/course");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(password);
      if (success) {
        router.push("/course");
      } else {
        setError("Senha incorreta. Tente novamente.");
        setPassword("");
        setIsSubmitting(false);
      }
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0261FF]"></div>
          <p className="text-gray-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/module1.png"
          alt="Background"
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/80 to-black/60" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-white font-bold text-3xl tracking-tighter uppercase">
                <span className="text-[#0261FF]">Conteúdo</span> fechado
              </div>
            </div>

            <h1 className="text-xl font-medium text-gray-200 mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-400 text-sm">
              Digite sua senha para acessar a plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                Senha de Acesso
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#1a1a1a]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#0261FF] focus:ring-1 focus:ring-[#0261FF] transition-all text-white placeholder-gray-600 backdrop-blur-sm group-hover:border-white/20"
                  placeholder="Digite sua senha..."
                  required
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0261FF] hover:bg-[#0052d9] text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(2,97,255,0.3)] hover:shadow-[0_0_30px_rgba(2,97,255,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-wide text-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Acessando...
                </span>
              ) : (
                "Entrar na Plataforma"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          &copy; {new Date().getFullYear()} Conteúdo Fechado. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
}
