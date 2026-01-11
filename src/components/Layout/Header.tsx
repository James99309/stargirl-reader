import { motion } from 'framer-motion';
import { useProgressStore } from '../../stores/progressStore';

export function Header() {
  const { streak, totalXP, hearts, maxHearts, darkMode, toggleDarkMode, username, isSuperMember } = useProgressStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 transition-colors">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Username with Super Badge */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          {isSuperMember && <span className="text-sm">👑</span>}
          <span className={`font-bold text-sm truncate max-w-[100px] ${
            isSuperMember
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {username}
          </span>
          {isSuperMember && (
            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-bold ml-0.5">
              (Super VIP)
            </span>
          )}
        </motion.div>

        {/* Streak */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-lg">🔥</span>
          <span className="font-bold text-orange-500 text-sm">{streak}</span>
        </motion.div>

        {/* XP */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-lg">💎</span>
          <span className="font-bold text-blue-500 text-sm">{totalXP}</span>
        </motion.div>

        {/* Hearts */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          {isSuperMember ? (
            <div className="flex items-center">
              <span className="text-lg">❤️</span>
              <span className="text-xs font-bold text-red-500">∞</span>
            </div>
          ) : (
            <div className="flex">
              {Array.from({ length: maxHearts }).map((_, i) => (
                <span key={i} className="text-sm">
                  {i < hearts ? '❤️' : '🤍'}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="text-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </div>
    </header>
  );
}
