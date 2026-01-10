import { motion } from 'framer-motion';
import { useProgressStore } from '../../stores/progressStore';

export function Header() {
  const { streak, totalXP, hearts, maxHearts } = useProgressStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Streak */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xl">🔥</span>
          <span className="font-bold text-orange-500">{streak}</span>
        </motion.div>

        {/* XP */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xl">💎</span>
          <span className="font-bold text-blue-500">{totalXP}</span>
        </motion.div>

        {/* Hearts */}
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <span key={i} className="text-lg">
                {i < hearts ? '❤️' : '🤍'}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
