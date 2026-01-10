import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: 'read' | 'review' | 'words' | 'leaderboard' | 'profile';
  onTabChange: (tab: 'read' | 'review' | 'words' | 'leaderboard' | 'profile') => void;
}

const tabs = [
  { id: 'read' as const, icon: '📖', label: 'Read' },
  { id: 'review' as const, icon: '🔄', label: 'Review' },
  { id: 'words' as const, icon: '📚', label: 'Words' },
  { id: 'leaderboard' as const, icon: '🏆', label: 'Rank' },
  { id: 'profile' as const, icon: '👤', label: 'Profile' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
<<<<<<< HEAD
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors">
=======
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
>>>>>>> 671403471b74c37393795356639ca6ae108de0e1
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'text-[#58CC02]'
<<<<<<< HEAD
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
=======
                : 'text-gray-400 hover:text-gray-600'
>>>>>>> 671403471b74c37393795356639ca6ae108de0e1
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
}
