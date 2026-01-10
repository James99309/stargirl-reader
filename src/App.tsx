import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { BottomNav } from './components/Layout/BottomNav';
import { ChapterList } from './components/Home/ChapterList';
import { ReadingView } from './components/Reading/ReadingView';
import { ChapterComplete } from './components/Gamification/ChapterComplete';
import { ReviewSession } from './components/Review/ReviewSession';
import { WordBank } from './components/Words/WordBank';
import { ProfileView } from './components/Profile/ProfileView';
import { LeaderboardView } from './components/Leaderboard/LeaderboardView';
import { LoginScreen } from './components/Auth/LoginScreen';
import { useProgressStore } from './stores/progressStore';
import { recordProgress } from './services/sheetApi';
import bookData from './data/stargirl.json';
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

type Tab = 'read' | 'review' | 'words' | 'leaderboard' | 'profile';
type View = 'home' | 'reading' | 'complete';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('read');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionWords, setSessionWords] = useState(0);
  const [, setLastQuizScore] = useState<string>('');

  const { username, setUsername, checkAndRestoreHearts, darkMode } = useProgressStore();
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

  const handleLogin = (name: string) => {
    setUsername(name);
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
    </div>
  );
}

export default App;
