import { motion } from 'framer-motion';
import { useProgressStore } from '../../stores/progressStore';

interface ReviewQuizButtonProps {
  quizId: string;
  subtitle: string;
  unlockCondition: number;
  position: 'left' | 'right';
  onClick: () => void;
}

export function ReviewQuizButton({
  quizId,
  subtitle,
  unlockCondition,
  position,
  onClick,
}: ReviewQuizButtonProps) {
  const { chaptersCompleted, reviewQuizzesCompleted } = useProgressStore();

  const isUnlocked = chaptersCompleted.includes(unlockCondition);
  const isCompleted = reviewQuizzesCompleted.includes(quizId);

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 flex items-center ${
        position === 'left' ? 'right-full mr-2' : 'left-full ml-2'
      }`}
    >
      {/* Dashed connector line */}
      <div
        className={`w-4 border-t-2 border-dashed ${
          isCompleted
            ? 'border-[#58CC02]'
            : isUnlocked
            ? 'border-[#FF9500]'
            : 'border-gray-300 dark:border-gray-600'
        } ${position === 'left' ? 'order-2' : 'order-1'}`}
      />

      {/* Quiz button */}
      <motion.button
        onClick={() => isUnlocked && onClick()}
        disabled={!isUnlocked}
        title={subtitle}
        className={`
          ${position === 'left' ? 'order-1' : 'order-2'}
          w-12 h-12 rounded-xl flex flex-col items-center justify-center
          font-bold text-xs shadow-md transition-all
          ${
            isCompleted
              ? 'bg-[#58CC02] text-white'
              : isUnlocked
              ? 'bg-[#FF9500] text-white ring-2 ring-orange-200'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }
        `}
        whileHover={isUnlocked ? { scale: 1.1 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {!isUnlocked ? (
          <span className="text-base">🔒</span>
        ) : isCompleted ? (
          <>
            <span className="text-base">✓</span>
          </>
        ) : (
          <>
            <span className="text-base">📝</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
