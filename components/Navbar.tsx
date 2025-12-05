"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { UpgradeModal } from "@/components/UpgradeModal";

interface NavbarProps {
    onLogout?: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { plan, getPlanBadgeColor, getPlanName } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setShowMenu(false);
        if (onLogout) {
            onLogout();
        }
    };

    const handleUpgrade = (url: string) => {
        setShowMenu(false);
        setUpgradeUrl(url);
    };

    return (
        <>
            <UpgradeModal
                isOpen={!!upgradeUrl}
                onClose={() => setUpgradeUrl(null)}
                url={upgradeUrl}
            />
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
                    : "bg-linear-to-b from-black/80 via-black/40 to-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={48}
                                height={48}
                                className="object-contain drop-shadow-[0_0_15px_rgba(2,97,255,0.5)]"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-white font-black text-xl md:text-2xl leading-none tracking-tighter uppercase drop-shadow-lg">
                                <span className="text-[#0261FF] relative inline-block">
                                    Conteúdo
                                    <span className="absolute inset-0 bg-[#0261FF]/20 blur-lg -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                </span>
                                <span className="text-white/90 ml-1">Fechado</span>
                            </h1>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {plan && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`hidden md:flex px-4 py-1.5 rounded-full bg-linear-to-r ${getPlanBadgeColor(plan)} text-white font-bold text-xs shadow-[0_0_20px_rgba(0,0,0,0.3)] items-center gap-2 ring-1 ring-white/20`}
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="uppercase tracking-wide text-[10px]">Plano {getPlanName(plan)}</span>
                            </motion.div>
                        )}

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="group flex items-center gap-3 focus:outline-none"
                            >
                                <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full p-[2px] bg-linear-to-tr from-[#0261FF] to-[#00C6FF] hover:shadow-[0_0_20px_rgba(2,97,255,0.5)] transition-all duration-300">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black relative">
                                        <img
                                            src="https://github.com/shadcn.png"
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#141414]"></div>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-4 w-64 bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5"
                                    >
                                        <div className="p-4 border-b border-white/5 bg-white/2">
                                            <p className="text-sm font-semibold text-white">Minha Conta</p>
                                            {plan && (
                                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                                                    <div className={`w-2 h-2 rounded-full bg-linear-to-r ${getPlanBadgeColor(plan)}`}></div>
                                                    Plano {getPlanName(plan)} Ativo
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-2">
                                            {plan === "prata" && (
                                                <div className="flex flex-col gap-1 mb-2">
                                                    <button
                                                        onClick={() => handleUpgrade('https://go.perfectpay.com.br/PPU38CQ4BET')}
                                                        className="w-full px-3 py-2.5 text-left text-sm text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 rounded-xl transition-colors flex items-center gap-3 group"
                                                    >
                                                        <div className="w-4 h-4 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
                                                            <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Upgrade para Ouro
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpgrade('https://go.perfectpay.com.br/PPU38CQ4BF3')}
                                                        className="w-full px-3 py-2.5 text-left text-sm text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 rounded-xl transition-colors flex items-center gap-3 group"
                                                    >
                                                        <div className="w-4 h-4 rounded-full bg-linear-to-r from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Upgrade para Diamante
                                                    </button>
                                                </div>
                                            )}

                                            {plan === "ouro" && (
                                                <div className="mb-2">
                                                    <button
                                                        onClick={() => handleUpgrade('https://go.perfectpay.com.br/PPU38CQ4BF7')}
                                                        className="w-full px-3 py-2.5 text-left text-sm text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 rounded-xl transition-colors flex items-center gap-3 group"
                                                    >
                                                        <div className="w-4 h-4 rounded-full bg-linear-to-r from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Upgrade para Diamante
                                                    </button>
                                                </div>
                                            )}

                                            <div className="h-px bg-white/10 my-2 mx-2"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors flex items-center gap-3 group"
                                            >
                                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sair da Conta
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.nav>
        </>
    );
};
