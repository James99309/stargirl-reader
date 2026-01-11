import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { BottomNav } from './components/Layout/BottomNav';
import { ChapterList } from './components/Home/ChapterList';
import { ReadingView } from './components/Reading/ReadingView';
import { ChapterComplete } from './components/Gamification/ChapterComplete';
import { ReviewSession } from './components/Review/ReviewSession';
import { ReviewQuizView } from './components/Review/ReviewQuizView';
import { WordBank } from './components/Words/WordBank';
import { ProfileView } from './components/Profile/ProfileView';
import { LeaderboardView } from './components/Leaderboard/LeaderboardView';
import { LoginScreen } from './components/Auth/LoginScreen';
import { ShopView } from './components/Shop/ShopView';
import { useProgressStore } from './stores/progressStore';
import { recordProgress } from './services/sheetApi';
import type { LeaderboardEntry } from './types';
import bookData from './data/stargirl.json';
import reviewQuizzesData from './data/reviewQuizzes.json';
import type { ReviewQuiz } from './types';
import './index.css';

interface Chapter {
  id: number;
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

type Tab = 'read' | 'review' | 'words' | 'shop' | 'leaderboard' | 'profile';
type View = 'home' | 'reading' | 'complete';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('read');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionWords, setSessionWords] = useState(0);
  const [, setLastQuizScore] = useState<string>('');
  const [selectedReviewQuiz, setSelectedReviewQuiz] = useState<ReviewQuiz | null>(null);
  const [showReviewQuiz, setShowReviewQuiz] = useState(false);

  const { username, setUsername, checkAndRestoreHearts, darkMode, claimLoginBonus, checkSuperMemberStatus, restoreFromServer } = useProgressStore();
  const [showLoginBonus, setShowLoginBonus] = useState(false);
  const [loginBonusXP, setLoginBonusXP] = useState(0);
  const chapters = bookData.chapters as Chapter[];

  // Apply dark mode to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check and restore hearts on app load and every minute
  useEffect(() => {
    checkAndRestoreHearts();
    const interval = setInterval(checkAndRestoreHearts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkAndRestoreHearts]);

  // Check super member status and claim daily login bonus
  useEffect(() => {
    if (username) {
      checkSuperMemberStatus();
      const bonus = claimLoginBonus();
      if (bonus > 0) {
        setLoginBonusXP(bonus);
        setShowLoginBonus(true);
        setTimeout(() => setShowLoginBonus(false), 3000);
      }
    }
  }, [username, checkSuperMemberStatus, claimLoginBonus]);

  const handleLogin = (name: string, existingUser?: LeaderboardEntry) => {
    setUsername(name);
    // Restore data if user exists
    if (existingUser) {
      restoreFromServer({
        totalXP: existingUser.totalXP,
        level: existingUser.level,
        isSuperMember: existingUser.isSuperMember,
      });
    }
    // Record login
    recordProgress({
      username: name,
      chapter: 'Login',
      score: '-',
      xp: 0,
    });
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('reading');
    setSessionXP(0);
    setSessionWords(0);
    setLastQuizScore('');
  };

  const handleChapterComplete = (quizScore?: string) => {
    if (quizScore) {
      setLastQuizScore(quizScore);
    }
    setCurrentView('complete');

    // Record to Google Sheets
    if (username && selectedChapter) {
      recordProgress({
        username,
        chapter: selectedChapter.title,
        score: quizScore || 'No quiz',
        xp: 50 + (quizScore ? 30 : 0),
      });
    }
  };

  const handleContinueAfterComplete = () => {
    setCurrentView('home');
    setSelectedChapter(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedChapter(null);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'read') {
      setCurrentView('home');
      setSelectedChapter(null);
    }
  };

  const handleSelectReviewQuiz = (quizId: string) => {
    const quiz = reviewQuizzesData.reviewQuizzes.find(q => q.id === quizId);
    if (quiz) {
      setSelectedReviewQuiz(quiz as ReviewQuiz);
      setShowReviewQuiz(true);
    }
  };

  const handleReviewQuizComplete = () => {
    setShowReviewQuiz(false);
    setSelectedReviewQuiz(null);
  };

  // Show login screen if not logged in
  if (!username) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'review') {
      return <ReviewSession onDone={() => setActiveTab('words')} />;
    }

    if (activeTab === 'words') {
      return <WordBank />;
    }

    if (activeTab === 'leaderboard') {
      return <LeaderboardView />;
    }

    if (activeTab === 'shop') {
      return <ShopView />;
    }

    if (activeTab === 'profile') {
      return <ProfileView />;
    }

    // Read tab
    switch (currentView) {
      case 'reading':
        return selectedChapter ? (
          <ReadingView
            chapter={selectedChapter}
            onComplete={() => handleChapterComplete()}
            onQuizComplete={(score) => handleChapterComplete(score)}
            onBack={handleBackToHome}
          />
        ) : null;

      case 'complete':
        return selectedChapter ? (
          <ChapterComplete
            chapterId={selectedChapter.id}
            xpEarned={sessionXP}
            wordsLearned={sessionWords}
            onContinue={handleContinueAfterComplete}
          />
        ) : null;

      default:
        return (
          <div className="pt-14 pb-20 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
            <ChapterList
              chapters={chapters}
              onSelectChapter={handleSelectChapter}
              onSelectReviewQuiz={handleSelectReviewQuiz}
            />
          </div>
        );
    }
  };

  const showNavigation = currentView !== 'complete' && currentView !== 'reading';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {showNavigation && <Header />}

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {showNavigation && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Review Quiz Modal */}
      <AnimatePresence>
        {showReviewQuiz && selectedReviewQuiz && (
          <ReviewQuizView
            quizId={selectedReviewQuiz.id}
            title={selectedReviewQuiz.title}
            subtitle={selectedReviewQuiz.subtitle}
            questions={selectedReviewQuiz.questions}
            onComplete={handleReviewQuizComplete}
            onClose={() => setShowReviewQuiz(false)}
          />
        )}
      </AnimatePresence>

      {/* Super VIP Daily Login Bonus Toast */}
      <AnimatePresence>
        {showLoginBonus && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
            <div className="flex items-center gap-2">
              <span>👑</span>
              <span className="font-bold">Super VIP Daily Bonus: +{loginBonusXP} XP!</span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
