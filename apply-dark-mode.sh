#!/bin/bash

# Add dark mode fields to types/index.ts
sed -i '/onboardingCompleted: boolean;/a\  totalReadingTime: number; // Total reading time in seconds' src/types/index.ts

# Add dark mode to progressStore.ts
sed -i '/lastHeartLoss: number | null;/a\  darkMode: boolean;' src/stores/progressStore.ts
sed -i '/logout: () => void;/a\  toggleDarkMode: () => void;' src/stores/progressStore.ts
sed -i '/onboardingCompleted: false,/a\  totalReadingTime: 0,' src/stores/progressStore.ts
sed -i '/lastHeartLoss: null,/a\      darkMode: false,' src/stores/progressStore.ts
sed -i '/set({ ...initialState, session: null, username: null, lastHeartLoss: null });$/s/);$/, darkMode: false });/' src/stores/progressStore.ts
sed -i '/endSession: () => {/,/},/c\      endSession: () => {\n        const { session } = get();\n        if (session) {\n          const readingTimeSeconds = Math.floor((Date.now() - session.startTime) / 1000);\n          set((state) => ({\n            session: null,\n            totalReadingTime: state.totalReadingTime + readingTimeSeconds,\n          }));\n        }\n      },' src/stores/progressStore.ts
sed -i '/logout: () => {/a\      },\n\n      toggleDarkMode: () => {\n        set((state) => ({ darkMode: !state.darkMode }));\n' src/stores/progressStore.ts

echo "Dark mode setup complete!"
