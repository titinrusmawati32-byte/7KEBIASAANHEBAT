import React from 'react';
import { User, Submission } from '../../types';
import {
  Trophy,
  Star,
  Flame,
  Award,
  Gift,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Target
} from 'lucide-react';

interface StudentAchievementsViewProps {
  user: User;
  submissions: Submission[];
  todayStr: string;
  onOpenChest: () => void;
}

export const StudentAchievementsView: React.FC<StudentAchievementsViewProps> = ({
  user,
  submissions,
  todayStr,
  onOpenChest,
}) => {
  const points = user.points || 0;

  // Streak calculation
  const uniqueDates = Array.from(
    new Set(submissions.filter((s) => s.studentId === user.id).map((s) => s.date))
  ).sort().reverse();
  const streakDays = uniqueDates.length > 0 ? Math.min(uniqueDates.length, 7) : 1;

  // Completed today count
  const todaySubs = submissions.filter(
    (s) => s.studentId === user.id && s.date === todayStr
  );
  const completedToday = todaySubs.length;

  // Level calculation
  let currentLevel = 'Bintang Pratama';
  let nextLevel = 'Bintang Madya';
  let nextLevelPoints = 100;
  let levelProgress = Math.min(100, Math.round((points / 100) * 100));

  if (points >= 150) {
    currentLevel = 'Ksatria Karakter Utama';
    nextLevel = 'Teladan Nusantara';
    nextLevelPoints = 300;
    levelProgress = Math.min(100, Math.round(((points - 150) / 150) * 100));
  } else if (points >= 80) {
    currentLevel = 'Bintang Madya';
    nextLevel = 'Ksatria Karakter Utama';
    nextLevelPoints = 150;
    levelProgress = Math.min(100, Math.round(((points - 80) / 70) * 100));
  }

  // Educational badges
  const badges = [
    {
      id: 'b1',
      title: 'Bangun Pagi Konsisten',
      description: 'Disiplin bangun pagi sebelum pukul 06.00',
      icon: '🌅',
      unlocked: points >= 20,
    },
    {
      id: 'b2',
      title: 'Pejuang Olahraga',
      description: 'Menjaga kebugaran dengan olahraga dan senam',
      icon: '🏃',
      unlocked: points >= 50,
    },
    {
      id: 'b3',
      title: 'Sahabat Belajar',
      description: 'Rajin membaca buku dan gemar belajar mandiri',
      icon: '📖',
      unlocked: points >= 80,
    },
    {
      id: 'b4',
      title: 'Karakter Hebat',
      description: 'Konsisten menyelesaikan 7 kebiasaan selama 7 hari',
      icon: '🏅',
      unlocked: points >= 120,
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Prestasi & Apresiasi
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Penghargaan atas komitmen dan konsistensi pembiasaan karakter baikmu.
        </p>
      </div>

      {/* 4 Metric Cards: Mobile-first CSS Grid (grid-cols-1 for mobile, sm:grid-cols-2 for tablet, lg:grid-cols-4 for desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Poin */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Poin</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900 shrink-0">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{points}</span>
            <span className="text-[10px] sm:text-xs font-medium text-amber-600">Poin Karakter</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Dari pembiasaan & kuis bonus</p>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Konsistensi</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-900 shrink-0">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{streakDays}</span>
            <span className="text-[10px] sm:text-xs font-medium text-orange-600">Hari Berturut</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Keaktifan pelaporan harian</p>
        </div>

        {/* Level */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Tingkat Karakter</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 border border-sky-100 dark:border-sky-900 shrink-0">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white block truncate">
              {currentLevel}
            </span>
            <span className="text-[10px] sm:text-xs text-sky-600 font-medium truncate block">Menuju: {nextLevel}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        {/* Badges Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Lencana Terbuka</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 border border-purple-100 dark:border-purple-900 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {badges.filter((b) => b.unlocked).length}/{badges.length}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-purple-600">Lencana</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Lencana karakter aktif</p>
        </div>
      </div>

      {/* Peti Hadiah Banner (Educational Reward) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-2xl border border-amber-200 dark:border-amber-900 shrink-0">
            🎁
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Peti Apresiasi Harian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {completedToday >= 7
                ? 'Luar biasa! Kamu telah menuntaskan 7 kebiasaan hari ini dan dapat membuka peti apresiasi.'
                : `Selesaikan seluruh 7 kebiasaan hari ini (${completedToday}/7 selesai) untuk membuka peti apresiasi.`}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChest}
          disabled={completedToday < 7}
          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto ${
            completedToday >= 7
              ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Buka Peti Apresiasi</span>
        </button>
      </div>

      {/* Lencana Penghargaan Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Lencana Penghargaan Pembiasaan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dapatkan lencana karakter dengan konsisten menjalankan kebiasaan setiap hari.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                b.unlocked
                  ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-50/40 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                {b.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {b.title}
                  </h4>
                  {b.unlocked ? (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Tercapai ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      Terkunci
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
