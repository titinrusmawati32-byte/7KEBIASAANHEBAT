import React, { useState } from 'react';
import { User } from '../types';
import { X, Gift, Sparkles, Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChestRewardModalProps {
  user: User;
  completedCount: number;
  onClose: () => void;
}

export const ChestRewardModal: React.FC<ChestRewardModalProps> = ({
  user,
  completedCount,
  onClose,
}) => {
  const [opened, setOpened] = useState(false);

  const isEligible = completedCount >= 7;

  const handleOpenChest = () => {
    setOpened(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl w-full max-w-md p-6 text-center relative overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-3xl mb-3 shadow-sm">
          🎁
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Peti Apresiasi Pembiasaan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Penghargaan khusus untuk siswa yang menyelesaikan 7 kebiasaan hari ini.
        </p>

        {!opened ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="text-5xl my-2">📦</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isEligible
                ? 'Selamat! Kamu telah menuntaskan seluruh 7 kebiasaan hari ini!'
                : `Kamu telah menyelesaikan ${completedCount} dari 7 kebiasaan.`}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEligible
                ? 'Buka peti sekarang untuk mengambil bonus poin dan apresiasi karaktermu!'
                : `Selesaikan ${7 - completedCount} kebiasaan lagi untuk membuka peti apresiasi ini.`}
            </p>

            {isEligible ? (
              <button
                onClick={handleOpenChest}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors mt-2"
              >
                🎉 Buka Peti Apresiasi
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-semibold text-xs rounded-xl cursor-not-allowed mt-2"
              >
                Peti Masih Terkunci
              </button>
            )}
          </div>
        ) : (
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-5 rounded-xl border border-amber-200/80 dark:border-amber-900 space-y-3 animate-scaleUp">
            <div className="text-5xl">🏆✨</div>
            <div className="p-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>+30 Poin Karakter Tambahan Diperoleh!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Luar biasa, {user.name}! Pertahankan kedisiplinan dan semangat 7 kebiasaan hebatmu setiap hari.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors mt-2"
            >
              Simpan & Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
