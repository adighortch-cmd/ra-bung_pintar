import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#070b13] py-6 px-4 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-white tracking-tight">RA'BUNG-Pintar</span>
          <span aria-hidden="true">·</span>
          <span>SMKN 3 Tana Toraja</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">Jurusan TJKT</span>
        </div>

        <div className="italic text-slate-300">
          "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."
        </div>

        <div className="font-mono text-emerald-400/90 text-[11px]">
          By: @adighoro_smkn3tator
        </div>
      </div>
    </footer>
  );
};
