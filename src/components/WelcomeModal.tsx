import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Trash2 } from 'lucide-react';
import { StudentProfile } from '../utils/rules';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
  initialProfile: StudentProfile | null;
  onResetAllData?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
  onResetAllData,
}) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<'X' | 'XI' | 'XII'>('XI');
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setGrade(initialProfile.grade);
    } else {
      setName('');
      setGrade('XI');
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Silakan masukkan nama lengkap atau panggilan Anda.');
      return;
    }

    onSave({
      name: cleanName,
      grade,
      department: 'TJKT (Teknik Jaringan Komputer & Telekomunikasi)',
      theme: 'dark',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
        {/* Close button if profile already exists */}
        {initialProfile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <img
              src="https://lh3.googleusercontent.com/d/1FZcwtfEquYv239AnNPQRbBUSTtkFUydG"
              alt="Logo RA'BUNG-Pintar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              {initialProfile ? 'Pengaturan Profil Siswa' : "Selamat Datang di RA'BUNG-Pintar"}
            </h3>
            <p className="text-xs text-slate-400">SMKN 3 Tana Toraja — Jurusan TJKT</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Lengkap / Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Andi Pratama"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tingkat Kelas (TJKT)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['X', 'XI', 'XII'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                    grade === g
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-900 text-slate-400 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  Kelas {g}
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                    {g === 'X' ? 'Fase E Dasar' : 'Fase F Kejuruan'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 block mb-0.5">Karakter RA'BUNG-Pintar:</span>
            RA'BUNG-Pintar akan menyapa dengan nama Anda, menyesuaikan tingkat kesulitan materi, dan membimbing praktikum laboratorium TJKT secara sabar dan terstruktur.
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            {initialProfile && onResetAllData ? (
              confirmReset ? (
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950/40 border border-rose-800/60">
                  <span className="text-[11px] text-rose-300 font-semibold px-1">Yakin hapus?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllData();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-2 py-1 text-xs rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all"
                  >
                    Ya, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-800/40 transition-colors"
                  title="Hapus semua data lokal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              )
            ) : <div />}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>{initialProfile ? 'Simpan Perubahan' : 'Mulai Belajar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
