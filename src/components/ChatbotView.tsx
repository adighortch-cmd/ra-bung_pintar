import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Lightbulb,
  FileCode,
  Terminal,
} from 'lucide-react';
import { StudentProfile } from '../utils/rules';
import { CURRICULUM_DATA, SubjectTopic } from '../data/curriculum';
import { RobotMascot } from './RobotMascot';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imagePreview?: string;
  modelUsed?: string;
}

interface ChatbotViewProps {
  student: StudentProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string, useThinking?: boolean) => Promise<void>;
  onClearHistory: () => void;
  onDeleteMessage?: (id: string) => void;
  onRegenerate: () => Promise<void>;
  isLoading: boolean;
  activeTopic: string;
  onSelectTopic: (topic: string) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  student,
  messages,
  onSendMessage,
  onClearHistory,
  onDeleteMessage,
  onRegenerate,
  isLoading,
  activeTopic,
  onSelectTopic,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [useThinking, setUseThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'teori' | 'praktikum' | 'soal'>('teori');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const gradeTopics = CURRICULUM_DATA.filter((t) => t.grade === student.grade);
  const currentTopicData = CURRICULUM_DATA.find((t) => t.title === activeTopic) || gradeTopics[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const textToSend = inputText;
    const imageToSend = selectedImage || undefined;

    setInputText('');
    setSelectedImage(null);
    await onSendMessage(textToSend, imageToSend, useThinking);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking && speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Perintah kode.')
      .replace(/[*#_`]/g, '')
      .slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-3 sm:px-6 py-3">
      {/* Top Banner with Robot Mascot */}
      <div className="mb-4">
        <RobotMascot
          status={isLoading ? 'thinking' : speakingId ? 'speaking' : 'standby'}
          studentName={student.name}
        />
      </div>

      {/* Curriculum & Mode Filter Strip */}
      <div className="mb-3 space-y-2">
        {/* Mode Selector and Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setChatMode('teori')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                chatMode === 'teori'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mode Teori
            </button>
            <button
              onClick={() => setChatMode('praktikum')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                chatMode === 'praktikum'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mode Praktikum
            </button>
            <button
              onClick={() => setChatMode('soal')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                chatMode === 'soal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mode Latihan Soal
            </button>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseThinking(!useThinking)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                useThinking
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Aktifkan penalaran mendalam AI (High Thinking Mode)"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Thinking {useThinking ? 'ON' : 'OFF'}</span>
            </button>

            {showConfirmClear ? (
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950/60 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-in fade-in duration-150">
                <span className="text-[11px] text-rose-300 font-semibold px-1 whitespace-nowrap">
                  Hapus {messages.length} chat?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
                  title="Konfirmasi hapus seluruh riwayat chat"
                >
                  Ya, Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all whitespace-nowrap shrink-0"
                  title="Batal hapus"
                >
                  Batal
                </button>
              </div>
            ) : (
              messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-colors whitespace-nowrap shrink-0"
                  title="Hapus riwayat percakapan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hapus Chat</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Subject Chips based on student grade */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Kelas {student.grade}:
          </span>
          {gradeTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.title)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 border ${
                activeTopic === topic.title
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto rounded-2xl bg-[#0b101c] border border-slate-800/80 p-3 sm:p-4 space-y-4 shadow-inner">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h3 className="font-display font-bold text-white text-lg sm:text-xl">
                Halo, {student.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Saya RA'BUNG-Pintar, asisten belajar TJKT kelas {student.grade} SMKN 3 Tana Toraja.
                Silakan tanyakan materi teori, instruksi praktikum server, atau uji konfigurasi jaringan!
              </p>
            </div>

            {/* Quick Prompt Suggestions */}
            {currentTopicData && currentTopicData.presetPrompts.length > 0 && (
              <div className="w-full max-w-lg mt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Pertanyaan Populer untuk "{currentTopicData.title}":
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {currentTopicData.presetPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(prompt, undefined, useThinking)}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-left text-xs text-slate-300 hover:text-emerald-300 transition-all shadow-sm flex items-start gap-2"
                    >
                      <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 space-y-2 border shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 border-emerald-500/30 text-white rounded-br-xs'
                    : 'bg-[#0f172a] border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                {/* User/Model Header */}
                <div className="flex items-center justify-between gap-4 text-[11px] pb-1 border-b border-slate-800/60">
                  <span className="font-semibold font-mono flex items-center gap-1.5">
                    {msg.role === 'user' ? (
                      <span className="text-emerald-400">{student.name} (Siswa)</span>
                    ) : (
                      <>
                        <span className="text-emerald-400 font-bold">RA'BUNG-Pintar</span>
                        <span className="text-slate-400 font-normal">· AI Mentor</span>
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
                    {onDeleteMessage && (
                      <button
                        type="button"
                        onClick={() => onDeleteMessage(msg.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                        title="Hapus pesan ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Attached image if any */}
                {msg.imagePreview && (
                  <div className="mt-2 mb-2 rounded-lg overflow-hidden border border-slate-700 max-w-sm">
                    <img
                      src={msg.imagePreview}
                      alt="Pratinjau Gambar Siswa"
                      className="w-full h-auto object-contain max-h-60 bg-black/40"
                    />
                  </div>
                )}

                {/* Content formatted with code blocks & structure highlight */}
                <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Assistant Action Buttons */}
                {msg.role === 'assistant' && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
                        title="Salin jawaban lengkap"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
                        title="Dengarkan pembacaan jawaban"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-400">Hentikan</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Suara</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={onRegenerate}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
                      title="Buat ulang respon ini"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Regenerasi</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#0f172a] border border-slate-800 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-slate-400 ml-1">RA'BUNG-Pintar sedang merumuskan jawaban...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image preview thumbnail before send */}
      {selectedImage && (
        <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-emerald-500/40 w-fit">
          <img src={selectedImage} alt="Lampiran" className="w-12 h-12 object-cover rounded-lg" />
          <div className="text-xs">
            <span className="font-semibold text-emerald-400 block">Screenshot Terlampir</span>
            <span className="text-slate-400">Siap dianalisis oleh AI</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 text-slate-400 hover:text-rose-400 ml-2"
            title="Hapus gambar"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
          title="Unggah screenshot terminal / topologi lab"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Tanyakan materi TJKT (${student.grade}), konfigurasi Linux/Mikrotik, atau troubleshooting...`}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !selectedImage)}
          className="inline-flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0"
        >
          <Send className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </form>
    </div>
  );
};
