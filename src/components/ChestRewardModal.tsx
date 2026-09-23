import React, { useState } from 'react';
import { User } from '../types';
import { X, Gift, Sparkles, Trophy, Award, Star } from 'lucide-react';
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
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-yellow-300 border-brutal shadow-brutal-lg rounded-3xl w-full max-w-md p-6 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-400 hover:bg-red-500 text-white font-black p-2 rounded-xl border-brutal-sm shadow-brutal-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-block p-3 bg-white border-brutal rounded-2xl shadow-brutal-sm mb-3">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        <h2 className="text-2xl font-black font-heading text-slate-900 mb-1">
          Peti Hadiah Mingguan 🎁
        </h2>
        <p className="text-xs font-bold text-slate-800 mb-4">
          Apresiasi Kebiasaan Anak Indonesia Hebat
        </p>

        {!opened ? (
          <div className="bg-white p-5 rounded-2xl border-brutal shadow-brutal mb-4 space-y-3">
            <div className="text-6xl animate-bounce my-2">📦</div>
            <div className="text-sm font-extrabold text-slate-900">
              {isEligible
                ? 'Selamat! Kamu telah menyelesaikan 7 Misi Kebiasaan Hebat Hari Ini!'
                : `Kamu telah menyelesaikan ${completedCount}/7 Misi.`}
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {isEligible
                ? 'Ketuk tombol di bawah untuk membuka peti dan mengambil Bintang Emas + Gelar Pahlawan!'
                : `Selesaikan ${7 - completedCount} misi lagi untuk membuka Peti Misteri ini!`}
            </p>

            {isEligible ? (
              <button
                onClick={handleOpenChest}
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-lg rounded-xl border-brutal shadow-brutal hover:scale-105 transition-transform animate-pulse"
              >
                🎉 BUKA PETI SEKARANG!
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 bg-slate-200 text-slate-500 font-bold text-sm rounded-xl border-2 border-slate-400 cursor-not-allowed"
              >
                Peti Masih Terkunci 🔒
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border-brutal shadow-brutal mb-4 space-y-3 animate-scaleUp">
            <div className="text-6xl animate-pulse">🏆✨</div>
            <div className="bg-amber-100 border-2 border-amber-400 p-3 rounded-xl text-amber-900 font-extrabold text-sm flex items-center justify-center gap-2">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>+50 BINTANG BONUS & GELAR "AGEN HEBAT UNGGUL"!</span>
            </div>
            <p className="text-xs font-bold text-slate-700">
              Hebat sekali, {user.name}! Bapak & Ibu Guru sangat bangga dengan kedisiplinan dan semangat muliamu!
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-sky-400 hover:bg-sky-500 text-slate-900 font-black text-sm rounded-xl border-brutal shadow-brutal-sm"
            >
              Simpan Ke Koleksi Poin 🌟
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
