import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface RobotMascotProps {
  status?: 'standby' | 'thinking' | 'speaking' | 'listening';
  studentName?: string;
  compact?: boolean;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  status = 'standby',
  studentName = 'Siswa',
  compact = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeakGreeting = () => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const text = `Halo ${studentName}! Saya RA'BUNG-Pintar, asisten belajar AI dan mentor praktikum TJKT SMKN 3 Tana Toraja. Belajar cerdas, praktik tuntas, masa depan berkualitas!`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const getStatusLabel = () => {
    if (isPlayingAudio || status === 'speaking') return 'Sedang Menjelaskan';
    if (status === 'thinking') return 'Sedang Memproses...';
    if (status === 'listening') return 'Mendengarkan';
    return 'Siap Membantu';
  };

  const avatarSrc = 'https://lh3.googleusercontent.com/d/1FZcwtfEquYv239AnNPQRbBUSTtkFUydG';
  const fallbackAvatar = '/src/assets/images/rpm_robot_avatar_1794399135353.jpg';

  if (compact) {
    return (
      <div className="relative group shrink-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <img
            src={avatarSrc}
            alt="RA'BUNG-Pintar"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
            }}
          />
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#090d16] ${
            status === 'thinking'
              ? 'bg-amber-400 animate-pulse'
              : status === 'speaking' || isPlayingAudio
              ? 'bg-cyan-400 animate-ping'
              : 'bg-emerald-400'
          }`}
          title={getStatusLabel()}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/20 border border-slate-800/80 shadow-md">
      {/* Avatar Container with glowing border */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 duration-200">
          <img
            src={avatarSrc}
            alt="RA'BUNG-Pintar Mascot"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
            }}
          />
        </div>
        {/* Eye/Circuits glow effect */}
        <div
          className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
            status === 'thinking'
              ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
              : status === 'speaking' || isPlayingAudio
              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
          }`}
        >
          {status === 'thinking' ? 'AI THINK' : "RA'BUNG"}
        </div>
      </div>

      {/* Info & Voice trigger */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-white text-base sm:text-lg tracking-tight truncate">
            RA'BUNG-Pintar
          </h2>
          <span className="hidden sm:inline text-xs text-slate-400">· SMKN 3 Tana Toraja</span>
        </div>
        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
          {getStatusLabel()}
          <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
            {isPlayingAudio ? '• Audio aktif' : '• Model: Gemini 3.8 Flash'}
          </span>
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSpeakGreeting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors"
            title="Dengarkan sapaan suara RA'BUNG-Pintar"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingAudio ? 'Hentikan Suara' : 'Sapaan Suara'}</span>
          </button>
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas"
          </span>
        </div>
      </div>
    </div>
  );
};
