import { motion } from 'framer-motion';
import { useProgressStore } from '../../stores/progressStore';
import { useVocabularyStore } from '../../stores/vocabularyStore';

const ACHIEVEMENTS = [
  { id: 'first_chapter', title: 'First Chapter', description: 'Complete Chapter 1', icon: '📖' },
  { id: 'bookworm', title: 'Bookworm', description: 'Read for 7 consecutive days', icon: '🐛' },
  { id: 'word_master_10', title: 'Word Collector', description: 'Learn 10 new words', icon: '📝' },
  { id: 'word_master_50', title: 'Word Master', description: 'Learn 50 new words', icon: '🧠' },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Complete a chapter with no mistakes', icon: '⭐' },
  { id: 'streak_7', title: 'On Fire', description: '7-day reading streak', icon: '🔥' },
  { id: 'streak_30', title: 'Unstoppable', description: '30-day reading streak', icon: '💪' },
];

export function ProfileView() {
  const {
    streak,
    totalXP,
    hearts,
    maxHearts,
    chaptersCompleted,
    achievements,
    wordsLearned,
    dailyGoalMinutes,
    totalReadingTime,
    setDailyGoal,
    resetProgress,
    exchangeXPForHeart,
  } = useProgressStore();

  const canExchangeHeart = totalXP >= 100 && hearts < maxHearts;

  const handleExchangeHeart = () => {
    if (exchangeXPForHeart()) {
      // Success - heart restored
    }
  };

  const { getMasteredWords } = useVocabularyStore();
  const masteredWords = getMasteredWords();

  const formatReadingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="pt-20 pb-24 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Profile header */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-[#58CC02] rounded-full flex items-center justify-center text-4xl">
              📚
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reader</h1>
              <p className="text-gray-500 dark:text-gray-400">Level {Math.floor(totalXP / 100) + 1}</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <p className="text-2xl font-bold text-orange-500">🔥 {streak}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Day Streak</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <p className="text-2xl font-bold text-blue-500">💎 {totalXP}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total XP</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <p className="text-2xl font-bold text-green-500">{chaptersCompleted.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chapters</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <p className="text-2xl font-bold text-purple-500">📖 {formatReadingTime(totalReadingTime)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reading Time</p>
            </div>
          </div>
        </motion.div>

        {/* Progress stats */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Progress</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Words Learned</span>
                <span className="font-medium">{wordsLearned.length}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#58CC02]"
                  style={{ width: `${Math.min(100, (wordsLearned.length / 100) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Words Mastered</span>
                <span className="font-medium">{masteredWords.length}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1CB0F6]"
                  style={{ width: `${Math.min(100, (masteredWords.length / 50) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Hearts</span>
                <span className="font-medium">{hearts} / {maxHearts}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: maxHearts }).map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < hearts ? '❤️' : '🤍'}
                    </span>
                  ))}
                </div>
                {hearts < maxHearts && (
                  <motion.button
                    onClick={handleExchangeHeart}
                    disabled={!canExchangeHeart}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      canExchangeHeart
                        ? 'bg-[#1CB0F6] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    whileHover={canExchangeHeart ? { scale: 1.05 } : {}}
                    whileTap={canExchangeHeart ? { scale: 0.95 } : {}}
                  >
                    💎100 → ❤️
                  </motion.button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ❤️ 每30分钟恢复1颗 · 完成章节+1颗
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daily goal */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎯 Daily Goal</h2>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setDailyGoal(minutes)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  dailyGoalMinutes === minutes
                    ? 'bg-[#58CC02] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏆 Achievements</h2>
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = achievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center ${
                    isUnlocked ? 'bg-yellow-50' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  title={`${achievement.title}: ${achievement.description}`}
                >
                  <span className={`text-2xl ${!isUnlocked && 'grayscale opacity-30'}`}>
                    {achievement.icon}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Reset button */}
        <motion.button
          onClick={handleResetProgress}
          className="w-full py-3 text-red-500 font-medium"
          whileTap={{ scale: 0.98 }}
        >
          Reset Progress
        </motion.button>
      </div>
    </div>
  );
}
