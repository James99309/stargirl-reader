import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, ReadingSession } from '../types';

interface ProgressState extends UserProgress {
  session: ReadingSession | null;
  username: string | null;
  lastHeartLoss: number | null; // timestamp when hearts were last lost

  // Actions
  startSession: (chapterId: number, sectionId: number) => void;
  endSession: () => void;
  addXP: (amount: number) => void;
  loseHeart: () => void;
  restoreHeart: () => void;
  checkAndRestoreHearts: () => void; // Check time-based restoration
  exchangeXPForHeart: () => boolean; // Exchange 100 XP for 1 heart
  completeChapter: (chapterId: number) => void;
  setCurrentPosition: (chapterId: number, sectionId: number) => void;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  setDailyGoal: (minutes: number) => void;
  completeOnboarding: () => void;
  addLearnedWord: (word: string) => void;
  resetProgress: () => void;
  setUsername: (name: string) => void;
  logout: () => void;
}

const initialState: UserProgress = {
  streak: 0,
  lastReadDate: null,
  totalXP: 0,
  hearts: 5,
  maxHearts: 5,
  dailyGoalMinutes: 10,
  currentChapter: 1,
  currentSection: 0,
  chaptersCompleted: [],
  achievements: [],
  wordsLearned: [],
  onboardingCompleted: false,
};

// Heart regeneration: 30 minutes per heart
const HEART_REGEN_INTERVAL = 30 * 60 * 1000; // 30 minutes in ms
const XP_PER_HEART = 100;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,
      session: null,
      username: null,
      lastHeartLoss: null,

      startSession: (chapterId, sectionId) => {
        set({
          session: {
            startTime: Date.now(),
            currentChapter: chapterId,
            currentSection: sectionId,
            xpEarned: 0,
            wordsViewed: [],
          },
        });
      },

      endSession: () => {
        const { session } = get();
        if (session) {
          set({ session: null });
        }
      },

      addXP: (amount) => {
        set((state) => ({
          totalXP: state.totalXP + amount,
          session: state.session
            ? { ...state.session, xpEarned: state.session.xpEarned + amount }
            : null,
        }));
      },

      loseHeart: () => {
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
          lastHeartLoss: state.hearts > 0 ? Date.now() : state.lastHeartLoss,
        }));
      },

      restoreHeart: () => {
        set((state) => ({
          hearts: Math.min(state.maxHearts, state.hearts + 1),
        }));
      },

      checkAndRestoreHearts: () => {
        const { hearts, maxHearts, lastHeartLoss } = get();
        if (hearts >= maxHearts || !lastHeartLoss) return;

        const now = Date.now();
        const elapsed = now - lastHeartLoss;
        const heartsToRestore = Math.floor(elapsed / HEART_REGEN_INTERVAL);

        if (heartsToRestore > 0) {
          const newHearts = Math.min(maxHearts, hearts + heartsToRestore);
          set({
            hearts: newHearts,
            lastHeartLoss: newHearts >= maxHearts ? null : now,
          });
        }
      },

      exchangeXPForHeart: () => {
        const { totalXP, hearts, maxHearts } = get();
        if (totalXP < XP_PER_HEART || hearts >= maxHearts) {
          return false;
        }
        set({
          totalXP: totalXP - XP_PER_HEART,
          hearts: hearts + 1,
        });
        return true;
      },

      completeChapter: (chapterId) => {
        const { chaptersCompleted, unlockAchievement } = get();
        const isNewChapter = !chaptersCompleted.includes(chapterId);

        set((state) => ({
          chaptersCompleted: isNewChapter
            ? [...state.chaptersCompleted, chapterId]
            : state.chaptersCompleted,
          // Restore 1 heart when completing a chapter
          hearts: Math.min(state.maxHearts, state.hearts + 1),
        }));

        // Achievement: Complete Chapter 1
        if (isNewChapter && chapterId === 1) {
          unlockAchievement('first_chapter');
        }
      },

      setCurrentPosition: (chapterId, sectionId) => {
        set({
          currentChapter: chapterId,
          currentSection: sectionId,
        });
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastReadDate, streak, unlockAchievement } = get();

        if (lastReadDate === today) {
          return; // Already updated today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak: number;
        if (lastReadDate === yesterdayStr) {
          // Consecutive day
          newStreak = streak + 1;
        } else {
          // Streak broken or first day
          newStreak = 1;
        }

        set({ streak: newStreak, lastReadDate: today });

        // Achievements: Streak milestones
        if (newStreak >= 7) {
          unlockAchievement('streak_7');
          unlockAchievement('bookworm');
        }
        if (newStreak >= 30) {
          unlockAchievement('streak_30');
        }
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.includes(achievementId)
            ? state.achievements
            : [...state.achievements, achievementId],
        }));
      },

      setDailyGoal: (minutes) => {
        set({ dailyGoalMinutes: minutes });
      },

      completeOnboarding: () => {
        set({ onboardingCompleted: true });
      },

      addLearnedWord: (word) => {
        const { wordsLearned, unlockAchievement } = get();
        if (wordsLearned.includes(word)) return;

        const newCount = wordsLearned.length + 1;
        set((state) => ({
          wordsLearned: [...state.wordsLearned, word],
        }));

        // Achievements: Word milestones
        if (newCount >= 10) {
          unlockAchievement('word_master_10');
        }
        if (newCount >= 50) {
          unlockAchievement('word_master_50');
        }
      },

      resetProgress: () => {
        set({ ...initialState, session: null, username: null, lastHeartLoss: null });
      },

      setUsername: (name) => {
        set({ username: name });
      },

      logout: () => {
        set({ ...initialState, session: null, username: null, lastHeartLoss: null });
      },
    }),
    {
      name: 'stargirl-progress',
    }
  )
);
