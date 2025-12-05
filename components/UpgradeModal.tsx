"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
}

export const UpgradeModal = ({ isOpen, onClose, url }: UpgradeModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!url) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl h-[85vh] md:h-[90vh] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center gap-2">
                <span className="w-1 h-6 bg-[#0261FF] rounded-full"></span>
                <h3 className="font-bold text-white text-sm md:text-base">Finalizar Upgrade</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 w-full h-full relative pt-16 bg-[#141414]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0261FF]"></div>
                    <p className="text-gray-400 text-sm animate-pulse">Carregando checkout seguro...</p>
                  </div>
                </div>
              )}
              <iframe
                src={url}
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
