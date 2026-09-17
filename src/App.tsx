/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppPage } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Floating3DBackground } from './components/Floating3DBackground';

// Views
import { HomeView } from './views/HomeView';
import { AssistantView } from './views/AssistantView';
import { TranslationView } from './views/TranslationView';
import { RewriteView } from './views/RewriteView';
import { GrammarView } from './views/GrammarView';
import { VocabularyView } from './views/VocabularyView';
import { ReadingView } from './views/ReadingView';
import { WritingView } from './views/WritingView';
import { DashboardView } from './views/DashboardView';
import { ProgressView } from './views/ProgressView';
import { ExamSimulatorView } from './views/ExamSimulatorView';
import { ProfileSettingsView } from './views/ProfileSettingsView';

// Firebase Services
import {
  auth,
  googleProvider,
  getOrCreateStudentProfile,
  testConnection,
  StudentProfile,
  SavedItem,
  db,
  handleFirestoreError,
  OperationType,
} from './services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: 'item-1',
      userId: 'default',
      title: 'قاعدة While والماضي المستمر',
      category: 'rule',
      content: 'While + Past Continuous (was/were + v-ing), Past Simple (went out). حدث طويل قطعه حدث قصير.',
      createdAt: 'اليوم',
    },
    {
      id: 'item-2',
      userId: 'default',
      title: 'متلازمات كلمة Pioneer',
      category: 'vocab',
      content: 'Dr. Magdi Yacoub is a pioneer in heart surgery. تعني رائد أو يبتكر طريقاً.',
      createdAt: 'أمس',
    }
  ]);
  const [solvedCount, setSolvedCount] = useState(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and check connection
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const studentProf = await getOrCreateStudentProfile(user);
          setProfile(studentProf);
          loadSavedNotebook(user.uid);
        } catch (err) {
          console.error('Error fetching student profile:', err);
        }
      } else {
        // Fallback default student profile for instant seamless experience
        setProfile({
          uid: 'guest-student',
          email: 'student@thanaweya.edu',
          displayName: 'طالب الثانوية المتفوق',
          studySection: 'علمي علوم',
          targetCollege: 'كلية الطب البشري',
          targetEnglishScore: 50,
          joinedAt: new Date().toLocaleDateString('ar-EG'),
          totalQuestionsSolved: 14,
          streakDays: 3,
          accuracyRate: 94,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const loadSavedNotebook = async (userId: string) => {
    try {
      const q = query(collection(db, `users/${userId}/saved`), orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SavedItem));
        setSavedItems(items);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `users/${userId}/saved`);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('تم تسجيل الدخول بنجاح! مرحباً بك.');
    } catch (err: any) {
      console.warn('Popup sign in note:', err);
      showToast('يمكنك استخدام المنصة مباشرة كطالب ضيف أو المحاولة مجدداً.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      showToast('تم تسجيل الخروج بنجاح.');
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveBookmark = async (title: string, content: string) => {
    const newItem: SavedItem = {
      id: 'save-' + Date.now(),
      userId: profile?.uid || 'guest',
      title,
      category: 'exam_tip',
      content: content.slice(0, 300) + '...',
      createdAt: new Date().toLocaleDateString('ar-EG'),
    };
    setSavedItems((prev) => [newItem, ...prev]);
    showToast('تم حفظ السؤال والملاحظة في كشكولك بنجاح! 📑');

    if (auth.currentUser) {
      try {
        await addDoc(collection(db, `users/${auth.currentUser.uid}/saved`), {
          ...newItem,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/saved`);
      }
    }
  };

  const handleQuestionSolved = () => {
    setSolvedCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden" dir="rtl">
      {/* 3D Visual Floating Ambient Mesh */}
      <Floating3DBackground />

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        profile={profile}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        solvedCount={solvedCount}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Collapsible Luxury Sidebar with 12 Sections */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:mr-72 min-w-0">
          {currentPage === 'home' && (
            <HomeView
              onNavigate={(page) => setCurrentPage(page)}
              profile={profile}
              onOpenQuickQuestion={(category) => setCurrentPage(category)}
            />
          )}

          {currentPage === 'assistant' && (
            <AssistantView
              userId={profile?.uid}
              onQuestionSolved={handleQuestionSolved}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'translation' && (
            <TranslationView
              userId={profile?.uid}
              onQuestionSolved={handleQuestionSolved}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'rewrite' && (
            <RewriteView
              userId={profile?.uid}
              onQuestionSolved={handleQuestionSolved}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'grammar' && (
            <GrammarView
              userId={profile?.uid}
              onQuestionSolved={handleQuestionSolved}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'vocabulary' && (
            <VocabularyView
              userId={profile?.uid}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'reading' && (
            <ReadingView
              userId={profile?.uid}
              onQuestionSolved={handleQuestionSolved}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'writing' && (
            <WritingView
              userId={profile?.uid}
              onQuestionSolved={handleQuestionSolved}
              onSaveBookmark={handleSaveBookmark}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardView
              onNavigate={(page) => setCurrentPage(page)}
              profile={profile}
              savedItems={savedItems}
            />
          )}

          {currentPage === 'progress' && (
            <ProgressView profile={profile} />
          )}

          {currentPage === 'exam' && (
            <ExamSimulatorView
              userId={profile?.uid}
              onExamFinished={handleQuestionSolved}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileSettingsView
              profile={profile}
              onProfileUpdated={(updated) => setProfile(updated)}
              onSignOut={handleSignOut}
            />
          )}
        </main>
      </div>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
