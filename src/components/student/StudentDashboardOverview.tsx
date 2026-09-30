import React from 'react';
import { User, Submission, Habit } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Star,
  Flame,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface StudentDashboardOverviewProps {
  user: User;
  submissions: Submission[];
  todayStr: string;
  onOpenHabitModal: (habit: Habit, submission?: Submission) => void;
  onNavigateTab: (tab: 'dashboard' | 'kebiasaan' | 'riwayat' | 'prestasi' | 'profil') => void;
}

export const StudentDashboardOverview: React.FC<StudentDashboardOverviewProps> = ({
  user,
  submissions,
  todayStr,
  onOpenHabitModal,
  onNavigateTab,
}) => {
  // Today's submissions
  const todaySubs = submissions.filter(
    (s) => s.studentId === user.id && s.date === todayStr
  );
  const completedCount = todaySubs.length;
  const progressPercent = Math.round((completedCount / 7) * 100);
  const remainingCount = 7 - completedCount;

  // Streak estimation (consecutive days with submissions)
  const uniqueDates = Array.from(
    new Set(submissions.filter((s) => s.studentId === user.id).map((s) => s.date))
  ).sort().reverse();
  const streakDays = uniqueDates.length > 0 ? Math.min(uniqueDates.length, 7) : 1;

  // Badges count (derived from points or completions)
  const earnedBadgesCount = (user.points || 0) >= 100 ? 3 : (user.points || 0) >= 40 ? 2 : 1;

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* 1. Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Selamat pagi, {user.name} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Yuk selesaikan 7 kebiasaan hari ini.
        </p>
      </div>

      {/* 2. 4 Stat/KPI Cards: Mobile-first CSS Grid (grid-cols-1 for mobile, sm:grid-cols-2 for tablet, lg:grid-cols-4 for desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Progres Hari Ini */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Progres Hari Ini</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedCount}/7
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-emerald-600">Selesai</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
            {remainingCount === 0 ? 'Semua kebiasaan tuntas 🎉' : `Tinggal ${remainingCount} kebiasaan lagi`}
          </p>
        </div>

        {/* KPI 2: Total Poin */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Poin</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900 shrink-0">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {user.points || 0}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-amber-600">Poin</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
            Poin karakter terkumpul
          </p>
        </div>

        {/* KPI 3: Konsistensi Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Konsistensi</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-900 shrink-0">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {streakDays}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-orange-600">Hari Berturut</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
            Disiplin pelaporan harian
          </p>
        </div>

        {/* KPI 4: Lencana Karakter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Lencana</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 border border-sky-100 dark:border-sky-900 shrink-0">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {earnedBadgesCount}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-sky-600">Lencana</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
            Penghargaan sikap terpuji
          </p>
        </div>
      </div>

      {/* 3. PROGRES HARI INI (Progress Bar) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Progres Hari Ini
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {completedCount} dari 7 kebiasaan selesai
          </span>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completedCount === 7
                ? 'bg-emerald-500'
                : completedCount >= 4
                ? 'bg-sky-600'
                : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Motivational Text */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {completedCount === 7 ? (
              <strong className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Luar biasa! Semua 7 kebiasaan hari ini sudah tuntas 🎉
              </strong>
            ) : remainingCount === 1 ? (
              <strong className="text-sky-600 dark:text-sky-400 font-semibold">
                Hebat! Tinggal 1 kebiasaan lagi untuk tuntas.
              </strong>
            ) : (
              <span>
                Semangat! Masih ada <strong>{remainingCount} kebiasaan</strong> yang perlu kamu lakukan.
              </span>
            )}
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* 3. 7 KEBIASAAN HARI INI (Clean List) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              7 Kebiasaan Hari Ini
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ketuk untuk melihat detail atau mencatat laporan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('kebiasaan')}
            className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
          >
            <span>Panduan Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of 7 Habits */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {HABITS.map((habit) => {
            const sub = todaySubs.find((s) => s.habitId === habit.id);
            const isDone = !!sub;

            return (
              <div
                key={habit.id}
                onClick={() => onOpenHabitModal(habit, sub)}
                className="py-3.5 flex items-center justify-between gap-3 cursor-pointer group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                {/* Left: Icon, Number, Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <span className="text-xl shrink-0">{habit.emoji}</span>

                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block group-hover:text-sky-600 transition-colors truncate">
                      {habit.number}. {habit.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {habit.timeRange}
                    </span>
                  </div>
                </div>

                {/* Right: Status or Action Button */}
                <div className="shrink-0">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      Selesai
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenHabitModal(habit);
                      }}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
                    >
                      Isi Laporan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRESTASI (Ringkasan Kecil) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Prestasi Pembiasaan
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{user.points || 0} Poin</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
              <span>{streakDays} Hari Berturut-turut</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-sky-600" />
              <span>{earnedBadgesCount} Lencana</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('prestasi')}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Lihat Prestasi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
