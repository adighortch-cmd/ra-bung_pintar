/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatbotView, ChatMessage } from './components/ChatbotView';
import { LabSimulatorView } from './components/LabSimulatorView';
import { TroubleshooterAIView } from './components/TroubleshooterAIView';
import { WelcomeModal } from './components/WelcomeModal';
import { Footer } from './components/Footer';
import { StudentProfile } from './utils/rules';
import { CURRICULUM_DATA } from './data/curriculum';
import { generateRPMFallback, ChatMode } from './utils/curriculumEngine';

const STORAGE_KEY_PROFILE = 'rpm_student_profile';
const STORAGE_KEY_CHAT = 'rpm_chat_history';

function getDefaultTopicForGrade(grade?: 'X' | 'XI' | 'XII'): string {
  const g = grade || 'XI';
  const match = CURRICULUM_DATA.find((t) => t.grade === g);
  return match ? match.title : CURRICULUM_DATA[0].title;
}

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
  const [currentView, setCurrentView] = useState<'chat' | 'lab' | 'troubleshoot'>('chat');
  const [activeTopic, setActiveTopic] = useState<string>(() =>
    getDefaultTopicForGrade(student?.grade)
  );
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAT);
      if (!saved) return [];
      const parsed: ChatMessage[] = JSON.parse(saved);
      // Do not replay typing animation for previously persisted history
      return parsed.map((m) => ({ ...m, isNew: false }));
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

  // Keep activeTopic synced with student grade curriculum
  useEffect(() => {
    const grade = student?.grade || 'XI';
    const validForGrade = CURRICULUM_DATA.some(
      (t) => t.grade === grade && t.title === activeTopic
    );
    if (!validForGrade) {
      setActiveTopic(getDefaultTopicForGrade(grade));
    }
  }, [student?.grade, activeTopic]);

  // Save chat history to localStorage (strip transient isNew flag)
  useEffect(() => {
    try {
      const toPersist = messages.map(({ isNew: _isNew, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(toPersist));
    } catch (e) {
      console.warn('Could not save chat history to localStorage:', e);
    }
  }, [messages]);

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    setActiveTopic(getDefaultTopicForGrade(newProfile.grade));
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Could not save profile:', e);
    }
  };

  const handleChangeGrade = (newGrade: 'X' | 'XI' | 'XII') => {
    const updated: StudentProfile = {
      name: student?.name || 'Siswa',
      department: student?.department || 'TJKT',
      grade: newGrade,
    };
    handleSaveProfile(updated);
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
    useThinking?: boolean,
    chatMode: ChatMode = 'teori'
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
      let botReply = '';
      let botModelUsed = "RA'BUNG Curriculum Engine";

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            imageBase64,
            useThinking,
            chatMode,
            studentName,
            grade,
            topic: activeTopic,
            history: messages.slice(-6),
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.reply) {
            botReply = data.reply;
            botModelUsed = data.modelUsed || 'gemini-3.1-flash-lite';
          }
        }
      } catch (networkErr) {
        console.warn('Network API request failed, utilizing client curriculum engine:', networkErr);
      }

      if (!botReply) {
        botReply = generateRPMFallback(studentName, grade, activeTopic, text, chatMode);
      }

      const botMsg: ChatMessage = {
        id: `rpm-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: botModelUsed,
        isNew: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackReply = generateRPMFallback(studentName, grade, activeTopic, text, chatMode);
      const botMsg: ChatMessage = {
        id: `rpm-safe-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: "RA'BUNG Curriculum Engine",
        isNew: true,
      };
      setMessages((prev) => [...prev, botMsg]);
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

    setMessages((prev) => {
      const copy = [...prev];
      if (copy[copy.length - 1].role === 'assistant') {
        copy.pop();
      }
      return copy;
    });

    await handleSendMessage(lastUserMsg.content, lastUserMsg.imagePreview, false, 'teori');
  };

  const handleAskAboutLab = (labTitle: string, question: string) => {
    setActiveTopic(labTitle);
    setCurrentView('chat');
    handleSendMessage(question, undefined, false, 'praktikum');
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
            onChangeGrade={handleChangeGrade}
          />
        )}

        {currentView === 'lab' && (
          <LabSimulatorView onAskRPMAboutLab={handleAskAboutLab} />
        )}

        {currentView === 'troubleshoot' && student && (
          <TroubleshooterAIView student={student} />
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
