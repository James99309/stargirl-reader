import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../stores/progressStore';
import { updateMemberStatus } from '../../services/sheetApi';

export function ShopView() {
  const { totalXP, isSuperMember, superMemberExpiry, purchaseSuperMember, username, addXP } = useProgressStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMessage, setRedeemMessage] = useState('');
  const [usedCodes, setUsedCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('usedCodes');
    return saved ? JSON.parse(saved) : [];
  });

  // Redeem codes - add more here
  const CODES: Record<string, number> = {
    'JING6': 10000,
    // 'CODE2': 500,
  };
  
  const SUPER_MEMBER_COST = 6499;
  const canAfford = totalXP >= SUPER_MEMBER_COST;

  const getRemainingDays = () => {
    if (!superMemberExpiry) return 0;
    const remaining = superMemberExpiry - Date.now();
    return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
  };

  const handlePurchase = () => {
    if (!canAfford) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    setShowConfirm(true);
  };

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    if (!code) return;

    if (usedCodes.includes(code)) {
      setRedeemMessage('You already used this code');
      setTimeout(() => setRedeemMessage(''), 2000);
      return;
    }

    const xp = CODES[code];
    if (xp) {
      addXP(xp);
      const newUsedCodes = [...usedCodes, code];
      setUsedCodes(newUsedCodes);
      localStorage.setItem('usedCodes', JSON.stringify(newUsedCodes));
      setRedeemMessage(`Success! +${xp} XP`);
      setRedeemCode('');
      setTimeout(() => setRedeemMessage(''), 3000);
    } else {
      setRedeemMessage('Invalid code');
      setTimeout(() => setRedeemMessage(''), 2000);
    }
  };

  const confirmPurchase = () => {
    const success = purchaseSuperMember();
    setShowConfirm(false);
    if (success) {
      // Sync member status to server
      if (username) {
        updateMemberStatus(username, true);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="pt-20 pb-24 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <span className="text-3xl">🛒</span> Shop
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Your XP: <span className="font-bold text-blue-500">{totalXP}</span> 💎
          </p>
        </motion.div>

        {/* Current membership status */}
        {isSuperMember && (
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-5 shadow-lg mb-6 text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">👑</span>
              <div>
                <p className="font-bold text-lg">SUPER Member Active!</p>
                <p className="text-white/90">Remaining: {getRemainingDays()} days</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Super Member Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 p-6 text-center">
            <span className="text-5xl">👑</span>
            <h2 className="text-2xl font-bold text-white mt-2 drop-shadow-md">
              SUPER Member
            </h2>
            <p className="text-white/90 text-sm mt-1">30 Days Membership</p>
          </div>

          {/* Benefits */}
          <div className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Member Benefits:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <span className="text-gray-700 dark:text-gray-300">Unlimited Hearts (No heart loss!)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-bold">Gold Username</span> everywhere
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-bold">SUPER Badge</span> on Leaderboard
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <span className="text-gray-700 dark:text-gray-300">Exclusive Member Status</span>
              </li>
            </ul>

            {/* Price */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <span className="text-xl">💎</span>
                <span className="text-2xl font-bold text-blue-500">{SUPER_MEMBER_COST.toLocaleString()}</span>
                <span className="text-gray-500 dark:text-gray-400">XP</span>
              </div>
            </div>

            {/* Purchase Button */}
            <motion.button
              onClick={handlePurchase}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                canAfford
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={canAfford ? { scale: 1.02 } : {}}
              whileTap={canAfford ? { scale: 0.98 } : {}}
            >
              {isSuperMember ? '续费 +30 天' : '购买 SUPER 会员'}
            </motion.button>

            {!canAfford && (
              <p className="text-center text-red-500 text-sm mt-3">
                XP not enough! Need {(SUPER_MEMBER_COST - totalXP).toLocaleString()} more XP
              </p>
            )}
          </div>
        </motion.div>

        {/* Redeem Code Section */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">🎁 Redeem Code</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#58CC02] focus:outline-none"
            />
            <motion.button
              onClick={handleRedeem}
              className="px-6 py-3 bg-[#58CC02] text-white font-bold rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Redeem
            </motion.button>
          </div>
          {redeemMessage && (
            <p className={`mt-2 text-sm font-medium ${redeemMessage.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
              {redeemMessage}
            </p>
          )}
        </motion.div>

        {/* Confirm Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="text-center">
                  <span className="text-5xl">👑</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    Confirm Purchase
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Spend <span className="font-bold text-blue-500">{SUPER_MEMBER_COST.toLocaleString()} XP</span> to become a SUPER Member?
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmPurchase}
                    className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirm
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <span>🎉</span>
                <span className="font-medium">Welcome to SUPER Member!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Toast */}
        <AnimatePresence>
          {showError && (
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span className="font-medium">XP not enough!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
