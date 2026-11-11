/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatbotView, ChatMessage } from './components/ChatbotView';
import { LabSimulatorView } from './components/LabSimulatorView';
import { TroubleshooterAIView } from './components/TroubleshooterAIView';
import { QuizArenaView } from './components/QuizArenaView';
import { WelcomeModal } from './components/WelcomeModal';
import { Footer } from './components/Footer';
import { StudentProfile } from './utils/rules';

const STORAGE_KEY_PROFILE = 'rpm_student_profile';
const STORAGE_KEY_CHAT = 'rpm_chat_history';

export default function App() {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'lab' | 'troubleshoot' | 'quiz'>('chat');
  const [activeTopic, setActiveTopic] = useState('Dasar-Dasar TJKT & Proses Bisnis');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Open welcome modal on first visit if no student profile
  useEffect(() => {
    if (!student) {
      setIsProfileModalOpen(true);
    }
  }, [student]);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history to localStorage:', e);
    }
  }, [messages]);

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Could not save profile:', e);
    }
  };

  const handleResetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_CHAT);
    setStudent(null);
    setMessages([]);
    setIsProfileModalOpen(true);
  };

  const handleSendMessage = async (
    text: string,
    imageBase64?: string,
    useThinking?: boolean
  ) => {
    const studentName = student?.name || 'Siswa';
    const grade = student?.grade || 'XI';

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      imagePreview: imageBase64,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          imageBase64,
          useThinking,
          studentName,
          grade,
          topic: activeTopic,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pesan AI.');
      }

      const botMsg: ChatMessage = {
        id: `rpm-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `rpm-err-${Date.now()}`,
        role: 'assistant',
        content: `Halo ${studentName}! Maaf terjadi kendala teknis saat menghubungi AI: ${err?.message || 'Koneksi terganggu'}. Silakan coba kirim ulang pertanyaanmu.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY_CHAT);
    } catch (e) {
      console.warn('Could not clear chat storage:', e);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRegenerate = async () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Remove last assistant message
    setMessages((prev) => {
      const copy = [...prev];
      if (copy[copy.length - 1].role === 'assistant') {
        copy.pop();
      }
      return copy;
    });

    await handleSendMessage(lastUserMsg.content, lastUserMsg.imagePreview, false);
  };

  const handleAskAboutLab = (labTitle: string, question: string) => {
    setActiveTopic(labTitle);
    setCurrentView('chat');
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 3-Zone Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        student={student}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'chat' && student && (
          <ChatbotView
            student={student}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            onDeleteMessage={handleDeleteMessage}
            onRegenerate={handleRegenerate}
            isLoading={isLoadingChat}
            activeTopic={activeTopic}
            onSelectTopic={setActiveTopic}
          />
        )}

        {currentView === 'lab' && (
          <LabSimulatorView onAskRPMAboutLab={handleAskAboutLab} />
        )}

        {currentView === 'troubleshoot' && student && (
          <TroubleshooterAIView student={student} />
        )}

        {currentView === 'quiz' && student && (
          <QuizArenaView student={student} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Welcome / Profile Modal */}
      <WelcomeModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        initialProfile={student}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}
