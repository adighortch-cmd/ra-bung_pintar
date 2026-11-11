import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Trophy,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, calculateQuizResult } from '../utils/rules';
import { SAMPLE_QUIZZES, QuizQuestion } from '../data/sampleQuizzes';
import { CURRICULUM_DATA } from '../data/curriculum';

interface QuizArenaViewProps {
  student: StudentProfile;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({ student }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    const filtered = SAMPLE_QUIZZES.filter((q) => q.grade === student.grade);
    return filtered.length > 0 ? filtered : SAMPLE_QUIZZES;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Semua Topik');

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectAnswer = (optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const result = calculateQuizResult(userAnswers, questions);
    if (result.percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRetryQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  const handleGenerateNewAIQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: student.grade,
          topic: selectedTopic === 'Semua Topik' ? 'Dasar Jaringan & Server TJKT' : selectedTopic,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const formatted = data.questions.map((q: any, idx: number) => ({
          id: Date.now() + idx,
          grade: student.grade,
          topic: selectedTopic,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        }));

        setQuestions(formatted);
        setUserAnswers({});
        setCurrentIndex(0);
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error('Error generating AI quiz:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const result = calculateQuizResult(userAnswers, questions);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      {/* Quiz Header & Generator Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Arena Evaluasi & Kuis Kejuruan TJKT
            </span>
          </div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl mt-1">
            Uji Pemahaman Kelas {student.grade} TJKT
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Latihan soal terstruktur untuk menguji pemahaman teori, konfigurasi terminal, dan analisis jaringan.
          </p>
        </div>

        <button
          onClick={handleGenerateNewAIQuiz}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 shadow-sm"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Membuat Soal AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Buat 5 Soal Baru dengan AI</span>
            </>
          )}
        </button>
      </div>

      {/* Main Question Card or Score Result */}
      {isSubmitted ? (
        /* Result Screen */
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="font-display font-extrabold text-2xl text-white">
              Hasil Evaluasi: {result.score} / 100
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Benar {result.correctCount} dari {result.total} soal ({result.percentage}%)
            </p>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              {result.percentage >= 80
                ? 'Luar biasa! Penguasaan materi Anda sangat baik.'
                : result.percentage >= 60
                ? 'Bagus! Terus tingkatkan dengan membaca kembali pembahasannya.'
                : "Jangan berkecil hati, pelajari kembali pembahasannya bersama RA'BUNG-Pintar!"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetryQuiz}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Kuis Ini</span>
            </button>
            <button
              onClick={handleGenerateNewAIQuiz}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coba Topik Soal Baru</span>
            </button>
          </div>

          {/* Question Review Accordion */}
          <div className="mt-6 text-left space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Pembahasan Lengkap:
            </h4>
            {questions.map((q, idx) => {
              const selected = userAnswers[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium text-white">
                      {idx + 1}. {q.question}
                    </span>
                  </div>
                  <p className="text-slate-300 pl-6">
                    Jawaban Anda:{' '}
                    <span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {selected !== undefined ? q.options[selected] : '(Tidak dijawab)'}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-emerald-300 pl-6">
                      Kunci Jawaban:{' '}
                      <span className="font-semibold">{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                  <p className="text-slate-400 pl-6 text-[11px] italic">
                    💡 Pembahasan: {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-5">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-emerald-400">Topik: {currentQ?.topic}</span>
            <span className="font-mono">
              Soal {currentIndex + 1} dari {totalQuestions}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Pertanyaan #{currentIndex + 1}:
            </span>
            <h3 className="font-display font-semibold text-white text-base sm:text-lg leading-relaxed">
              {currentQ?.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ?.options.map((option, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-900 disabled:opacity-40 text-slate-300 border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Sebelumnya
            </button>

            {currentIndex + 1 < totalQuestions ? (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                Selesaikan & Lihat Nilai
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
