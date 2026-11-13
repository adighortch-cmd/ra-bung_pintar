import React from 'react';
import { User, Cpu } from 'lucide-react';
import { StudentProfile } from '../utils/rules';

interface HeaderProps {
  currentView: 'chat' | 'lab' | 'troubleshoot';
  onSelectView: (view: 'chat' | 'lab' | 'troubleshoot') => void;
  student: StudentProfile | null;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  student,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand wordmark with provided logo (clickable home) */}
        <button
          type="button"
          onClick={() => onSelectView('chat')}
          className="flex items-center gap-3 shrink-0 group text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          title="Kembali ke Beranda Chatbot Pembelajaran"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/40 group-hover:border-emerald-400 bg-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.25)] flex items-center justify-center transition-colors">
            <img
              src="https://lh3.googleusercontent.com/d/1FZcwtfEquYv239AnNPQRbBUSTtkFUydG"
              alt="Logo RA'BUNG-Pintar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to stylized SVG icon if image blocked
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
              RA'BUNG-Pintar
            </span>
          </div>
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectView('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'chat'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Chatbot Pembelajaran
          </button>
          <button
            onClick={() => onSelectView('lab')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'lab'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Praktikum Lab TJKT
          </button>
          <button
            onClick={() => onSelectView('troubleshoot')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'troubleshoot'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Troubleshooter AI
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 text-xs sm:text-sm font-medium transition-all shadow-sm whitespace-nowrap shrink-0"
            title="Pengaturan Profil Siswa"
            aria-label="Profil Siswa"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
              {student ? student.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="hidden sm:inline font-mono">{student ? `${student.name} (${student.grade})` : 'Masuk Profil'}</span>
            <span className="sm:hidden font-mono">{student ? student.grade : 'Profil'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#0b101c] border-t border-slate-800/70 text-xs overflow-x-auto">
        <button
          onClick={() => onSelectView('chat')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'chat' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Chatbot
        </button>
        <button
          onClick={() => onSelectView('lab')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'lab' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Praktikum
        </button>
        <button
          onClick={() => onSelectView('troubleshoot')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'troubleshoot' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Troubleshooter
        </button>
      </div>
    </header>
  );
};
