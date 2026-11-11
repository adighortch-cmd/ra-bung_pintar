import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { PRACTICAL_LABS, PracticalLab } from '../data/labs';
import { simulateTerminalCommand } from '../utils/rules';

interface LabSimulatorViewProps {
  onAskRPMAboutLab?: (labTitle: string, question: string) => void;
}

export const LabSimulatorView: React.FC<LabSimulatorViewProps> = ({ onAskRPMAboutLab }) => {
  const [selectedLabId, setSelectedLabId] = useState<string>(PRACTICAL_LABS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: 'input' | 'output' | 'system'; text: string }>
  >([
    {
      type: 'system',
      text: 'Debian GNU/Linux 12 (bookworm) — Laboratorium TJKT SMKN 3 Tana Toraja\nKetik "help" untuk bantuan atau ikuti petunjuk praktikum di panel kiri.',
    },
  ]);
  const [historyPointer, setHistoryPointer] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHint, setShowHint] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activeLab = PRACTICAL_LABS.find((l) => l.id === selectedLabId) || PRACTICAL_LABS[0];
  const activeStep = activeLab.steps[currentStepIndex] || activeLab.steps[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleSelectLab = (lab: PracticalLab) => {
    setSelectedLabId(lab.id);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setShowHint(false);
    setTerminalHistory([
      {
        type: 'system',
        text: `Memulai Praktikum: ${lab.title}\nLingkungan: Simulator Virtual TJKT SMKN 3 Tator\nSasaran: Selesaikan setiap langkah di panel kiri.`,
      },
    ]);
  };

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    // Record in input history
    setHistoryPointer((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const newHistory = [
      ...terminalHistory,
      { type: 'input' as const, text: `root@debian-tjkt:~# ${cmd}` },
    ];

    if (cmd === 'clear') {
      setTerminalHistory([]);
      setCommandInput('');
      return;
    }

    const simResult = simulateTerminalCommand(cmd, '/root', {
      labId: activeLab.id,
      stepIndex: currentStepIndex,
    });

    if (simResult.output !== '__CLEAR__') {
      newHistory.push({
        type: simResult.isError ? ('system' as const) : ('output' as const),
        text: simResult.output,
      });
    }

    // Check if this matches active step command
    const normalizedCmd = cmd.toLowerCase().replace(/\s+/g, ' ');
    const expectedCmd = activeStep.expectedCommand.toLowerCase().replace(/\s+/g, ' ');

    if (normalizedCmd === expectedCmd || normalizedCmd.startsWith(expectedCmd)) {
      if (!completedSteps.includes(activeStep.id)) {
        setCompletedSteps((prev) => [...prev, activeStep.id]);
        newHistory.push({
          type: 'system' as const,
          text: `[BERHASIL] Langkah ${activeStep.id} selesai! ${activeStep.explanation}`,
        });

        // Advance to next step if available
        if (currentStepIndex + 1 < activeLab.steps.length) {
          setCurrentStepIndex(currentStepIndex + 1);
          setShowHint(false);
        } else {
          newHistory.push({
            type: 'system' as const,
            text: `★★★ SELAMAT! Seluruh misi pada praktikum "${activeLab.title}" telah tuntas dilaksanakan! Kerja bagus! ★★★`,
          });
        }
      }
    }

    setTerminalHistory(newHistory);
    setCommandInput('');
  };

  const handleQuickInsert = (cmd: string) => {
    setCommandInput(cmd);
  };

  const handleResetLab = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setTerminalHistory([
      {
        type: 'system',
        text: `Praktikum "${activeLab.title}" di-reset. Silakan jalankan langkah pertama.`,
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Lab Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Simulator Praktikum Laboratorium TJKT
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-300 font-mono">SMKN 3 Tana Toraja</span>
          </div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl mt-0.5">
            {activeLab.title}
          </h2>
        </div>

        {/* Lab selector dropdown / buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {PRACTICAL_LABS.map((lab) => (
            <button
              key={lab.id}
              onClick={() => handleSelectLab(lab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all border ${
                selectedLabId === lab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {lab.title.split(':')[0].slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Zone Sandbox Split Layout as per Constitution (§2.A) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Zone: Guided Steps & Topology Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Lab Overview Card */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-emerald-400">{activeLab.category}</span>
              <span>Waktu: {activeLab.estimatedTime}</span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tujuan Praktikum:
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeLab.objective}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400 block mb-0.5">Topologi & Skenario:</span>
              <p>{activeLab.topologyDescription}</p>
            </div>
          </div>

          {/* Guided Steps Progression */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Tahapan Tugas Praktikum</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {completedSteps.length} / {activeLab.steps.length} Selesai
              </span>
            </div>

            <div className="space-y-2.5 flex-1">
              {activeLab.steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = idx === currentStepIndex && !isCompleted;

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                        : isCurrent
                        ? 'bg-slate-900 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.15)] text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                              isCurrent
                                ? 'border-emerald-400 text-emerald-400'
                                : 'border-slate-700 text-slate-600'
                            }`}
                          >
                            {step.id}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-snug">{step.instruction}</p>

                        {isCurrent && (
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400 font-mono">Perintah target:</span>
                              <button
                                onClick={() => handleQuickInsert(step.expectedCommand)}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs border border-emerald-500/40 transition-colors"
                                title="Klik untuk masukkan ke terminal"
                              >
                                {step.expectedCommand}
                              </button>
                            </div>

                            {showHint ? (
                              <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-800/40">
                                💡 <strong>Petunjuk:</strong> {step.hint}
                              </p>
                            ) : (
                              <button
                                onClick={() => setShowHint(true)}
                                className="text-[11px] text-slate-400 hover:text-amber-400 underline"
                              >
                                Butuh petunjuk?
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={handleResetLab}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Praktikum</span>
              </button>

              {onAskRPMAboutLab && (
                <button
                  onClick={() =>
                    onAskRPMAboutLab(
                      activeLab.title,
                      `Tolong jelaskan secara mendalam tentang praktikum "${activeLab.title}" langkah ke-${currentStepIndex + 1}.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tanya RA'BUNG-Pintar tentang Lab Ini</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone: Interactive Linux / Mikrotik Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[580px] rounded-2xl bg-[#090d16] border border-slate-800 overflow-hidden shadow-2xl">
          {/* Terminal Window Chrome / Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                root@debian-tjkt-smkn3:~#
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SIMULATOR AKTIF</span>
            </div>
          </div>

          {/* Terminal Output Log Area */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-2 bg-[#060a12] text-slate-300">
            {terminalHistory.map((item, idx) => (
              <div key={idx}>
                {item.type === 'input' ? (
                  <p className="text-emerald-400 font-semibold">{item.text}</p>
                ) : item.type === 'system' ? (
                  <p className="text-cyan-400/90 italic bg-cyan-950/20 p-1.5 rounded border-l-2 border-cyan-500">
                    {item.text}
                  </p>
                ) : (
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono">{item.text}</pre>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Command Input Prompt */}
          <form
            onSubmit={handleExecuteCommand}
            className="flex items-center gap-2 p-3 bg-slate-950 border-t border-slate-800 font-mono text-xs"
          >
            <span className="text-emerald-400 font-bold shrink-0">root@debian:~#</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Ketik perintah (contoh: ip a, ping 8.8.8.8, cat /etc/network/interfaces)..."
              className="flex-1 bg-transparent text-white outline-none focus:ring-0 placeholder-slate-600 font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              Eksekusi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
