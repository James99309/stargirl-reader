import { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchUserByUsername } from '../../services/sheetApi';
import type { LeaderboardEntry } from '../../types';

interface LoginScreenProps {
  onLogin: (username: string, existingUser?: LeaderboardEntry) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const existingUser = await fetchUserByUsername(name.trim());
      onLogin(name.trim(), existingUser || undefined);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#58CC02] to-[#46a302] flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">📖</h1>
          <h2 className="text-2xl font-bold text-gray-900">Stargirl Reader</h2>
          <p className="text-gray-500 mt-2">Enter your name to start reading</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#58CC02] focus:outline-none text-lg mb-4"
            autoFocus
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <motion.button
            type="submit"
            disabled={!name.trim() || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
              name.trim() && !isLoading
                ? 'bg-[#58CC02] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={name.trim() && !isLoading ? { scale: 1.02 } : {}}
            whileTap={name.trim() && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? 'Loading...' : 'Start Reading'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
