import React, { useState } from 'react';
import { User, Submission, Habit, QuizQuestion } from '../types';
import { HABITS } from '../data/habitsData';
import { HabitSubmissionModal } from './HabitSubmissionModal';
import { ChestRewardModal } from './ChestRewardModal';
import {
  LogOut,
  Star,
  Trophy,
  CheckCircle2,
  Sparkles,
  Gift,
  Lock,
  UserCheck,
  BarChart2,
  Flame,
  Award,
  Clock,
  Eye,
  Check,
  X,
  Target,
  Sparkle,
  Trash2
} from 'lucide-react';

interface StudentViewProps {
  user: User;
  submissions: Submission[];
  quizzes: QuizQuestion[];
  onLogout: () => void;
  onSubmitHabit: (
    habitId: Habit['id'],
    note: string,
    photoUrl: string,
    quizAnsweredCorrectly: boolean
  ) => void;
  onDeleteSubmission?: (id: string) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  user,
  submissions,
  quizzes,
  onLogout,
  onSubmitHabit,
  onDeleteSubmission,
}) => {
  const [activeHabitModal, setActiveHabitModal] = useState<Habit | null>(null);
  const [showChestModal, setShowChestModal] = useState(false);
  const [pillarFilter, setPillarFilter] = useState<'all' | 'done' | 'pending'>('all');
  const [selectedProof, setSelectedProof] = useState<{
    habit: Habit;
    sub?: Submission;
  } | null>(null);

  const [activeInfoBox, setActiveInfoBox] = useState<{
    title: string;
    desc: string;
  }>({
    title: 'Sentuh pilar grafik untuk detail cepat!',
    desc: 'Selesaikan 7 pilar kebiasaan hari ini untuk mengumpulkan bintang dan membuka Peti Hadiah!',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Get user's today submissions
  const userTodaySubmissions = submissions.filter(
    (s) => s.studentId === user.id && s.date === todayStr
  );

  const completedCount = userTodaySubmissions.length;
  const completionPercentage = Math.round((completedCount / 7) * 100);

  // Check if a specific habit is completed
  const isHabitCompleted = (habitId: Habit['id']) => {
    return userTodaySubmissions.some((s) => s.habitId === habitId);
  };

  // Get submission for habit
  const getSubmissionForHabit = (habitId: Habit['id']) => {
    return userTodaySubmissions.find((s) => s.habitId === habitId);
  };

  // Handle pillar click
  const handlePillarClick = (habit: Habit) => {
    const sub = getSubmissionForHabit(habit.id);
    if (sub) {
      setActiveInfoBox({
        title: `✨ Pilar M${habit.number}: ${habit.title} (100%)`,
        desc: `Luar biasa! Misi diselesaikan pukul ${sub.completedAt || '06:30 WIB'}. Bonus +${sub.pointsEarned || 15} Poin Bintang telah didapatkan!`,
      });
      setSelectedProof({ habit, sub });
    } else {
      setActiveInfoBox({
        title: `📌 Pilar M${habit.number}: ${habit.title} (0%)`,
        desc: `Misi ini belum dikerjakan hari ini. Ketuk untuk segera mengisi laporan!`,
      });
      setActiveHabitModal(habit);
    }
  };

  return (
    <div className="min-h-screen bg-bright-yellow-blue text-slate-900 dark:text-slate-100 font-sans p-3 sm:p-5 lg:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ================= MAIN HEADER BANNER ================= */}
        <header className="space-y-3">
          {/* Primary Banner Header */}
          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 dark:from-amber-500 dark:to-yellow-500 rounded-3xl p-4 sm:p-5 border-brutal shadow-brutal flex flex-wrap items-center justify-between gap-4 text-slate-950">
            {/* Title and School Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border-brutal shadow-brutal-sm flex items-center justify-center text-2xl font-black shrink-0">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                    UPTD SATDIK SDN SUMBEREJO 04
                  </span>
                  <span className="hidden sm:inline-block text-slate-950 font-black text-xs">
                    • 7 Pilar Kebiasaan Hebat
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-950 tracking-tight mt-0.5">
                  Papan Misi Harian Sahabat Hebat
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Kumpulkan bintang kebaikan dan selesaikan tantangan karakter hari ini! ✨
                </p>
              </div>
            </div>

            {/* Top Right Action Badges: Points, Streak & Logout */}
            <div className="flex items-center gap-2.5 ml-auto">
              {/* Live Points Counter */}
              <div className="flex items-center gap-2 bg-slate-950 text-amber-300 px-3.5 py-2 rounded-2xl border-brutal-sm shadow-brutal-sm">
                <Star className="w-5 h-5 text-amber-400 fill-amber-300 animate-pulse" />
                <div className="leading-none">
                  <span className="text-[9px] uppercase font-black text-slate-400 block">
                    TOTAL POIN
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-wide text-amber-300">
                    {user.points} Poin
                  </span>
                </div>
              </div>

              {/* Daily Streak */}
              <div className="hidden md:flex items-center gap-1.5 bg-amber-950/20 text-slate-950 px-3 py-2 rounded-2xl border-brutal-sm font-black text-xs">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-bounce" />
                <span>7 Hari Beruntun!</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs border-brutal-sm shadow-brutal-sm active:scale-95 transition-transform"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Secondary Info Strip: Agent Status & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Agent Identity Card */}
            <div className="bg-white dark:bg-slate-900 border-brutal shadow-brutal rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-300 dark:bg-sky-800 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center text-xl font-black shrink-0">
                🧑‍🎓
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block">
                  NAMA AGEN CILIK
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase truncate">
                    {user.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

            {/* Grade & Classroom Info */}
            <div className="bg-white dark:bg-slate-900 border-brutal shadow-brutal rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-300 dark:bg-amber-800 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center text-xl font-black shrink-0">
                🏫
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block">
                  TINGKAT & ROMBEL
                </span>
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {user.class} (Unggulan)
                </span>
              </div>
            </div>

            {/* Today's Target Status Badge */}
            <div className="hidden lg:flex bg-white dark:bg-slate-900 border-brutal shadow-brutal rounded-2xl p-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-300 dark:bg-emerald-800 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center text-xl font-black shrink-0">
                  🎯
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block">
                    TARGET HARIAN
                  </span>
                  <span className="font-black text-sm text-emerald-700 dark:text-emerald-400">
                    Selesaikan 7/7 Pilar
                  </span>
                </div>
              </div>
              <span className="text-xs bg-slate-900 text-amber-300 px-2.5 py-1 rounded-xl font-black border-brutal-sm">
                Hari Ini
              </span>
            </div>
          </div>
        </header>

        {/* ================= INTERACTIVE PROGRESS SECTION ================= */}
        <section className="bg-white dark:bg-slate-900 border-brutal shadow-brutal-lg rounded-3xl p-4 sm:p-6 space-y-4 relative overflow-hidden">
          {/* Section Header with Filters & Overall Meter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-300 dark:bg-sky-900 border-brutal-sm rounded-xl text-slate-900 dark:text-white">
                  <BarChart2 className="w-5 h-5" />
                </span>
                <h2 className="text-base sm:text-lg font-black font-heading text-slate-900 dark:text-white tracking-tight">
                  Statistik Kemajuan: Grafik Pencapaian 7 Pilar Harian
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                Ketuk atau arahkan kursor ke tiap pilar untuk melihat detail prestasi!
              </p>
            </div>

            {/* Interactive Filter Tabs & Overall Progress Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border-brutal-sm text-xs gap-1">
                <button
                  onClick={() => setPillarFilter('all')}
                  className={`px-3 py-1 rounded-xl font-black transition-all ${
                    pillarFilter === 'all'
                      ? 'bg-emerald-400 text-slate-900 border-brutal-sm shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setPillarFilter('done')}
                  className={`px-3 py-1 rounded-xl font-black transition-all ${
                    pillarFilter === 'done'
                      ? 'bg-emerald-400 text-slate-900 border-brutal-sm shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Selesai ({completedCount})
                </button>
                <button
                  onClick={() => setPillarFilter('pending')}
                  className={`px-3 py-1 rounded-xl font-black transition-all ${
                    pillarFilter === 'pending'
                      ? 'bg-amber-300 text-slate-900 border-brutal-sm shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Belum ({7 - completedCount})
                </button>
              </div>

              {/* Main Overall Completion Badge */}
              <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-2xl border-brutal-sm shadow-brutal-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-black text-amber-300">
                  {completedCount} / 7 Misi Selesai
                </span>
                <span className="text-xs font-black bg-emerald-400 text-slate-900 px-1.5 py-0.5 rounded-lg">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Master Horizontal Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
              <span>Rangkuman Target Hari Ini</span>
              <span className="text-emerald-600 dark:text-emerald-400">{completionPercentage}% Tercapai</span>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-950 rounded-full border-brutal overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* 7 Pillars SVG Ring Column Charts */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 md:gap-6 pt-2 pb-1">
            {HABITS.map((habit) => {
              const done = isHabitCompleted(habit.id);
              const sub = getSubmissionForHabit(habit.id);

              // Filter match condition
              const isMatchFilter =
                pillarFilter === 'all' ||
                (pillarFilter === 'done' && done) ||
                (pillarFilter === 'pending' && !done);

              return (
                <div
                  key={habit.id}
                  onClick={() => handlePillarClick(habit)}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-300 ${
                    isMatchFilter ? 'opacity-100' : 'opacity-25'
                  }`}
                >
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {/* SVG Circular Ring */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-slate-200 dark:text-slate-800"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="28"
                        fill="none"
                        stroke={done ? '#38bdf8' : '#e2e8f0'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="175.9"
                        strokeDashoffset={done ? 0 : 175.9}
                        className="transition-all duration-700"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                      <span
                        className={`text-xs sm:text-sm font-black ${
                          done ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'
                        }`}
                      >
                        {done ? '100%' : '0%'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col items-center">
                    <span
                      className={`w-6 h-6 rounded-full border-brutal-sm flex items-center justify-center text-[10px] font-black transition-all ${
                        done
                          ? 'bg-sky-400 text-slate-900 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      M{habit.number}
                    </span>
                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 mt-1 text-center hidden sm:block truncate max-w-[70px]">
                      {habit.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Notification Bubble */}
          <div className="bg-slate-900 text-white border-brutal rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-brutal-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">💡</span>
              <div>
                <span className="text-xs font-black text-amber-300 block">
                  {activeInfoBox.title}
                </span>
                <span className="text-[11px] font-medium text-slate-300">
                  {activeInfoBox.desc}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  `⭐ Rekap Sementara: ${user.name} telah mengumpulkan ${user.points} Bintang hari ini!\nTarget berikutnya: Selesaikan sisa pilar harian.`
                )
              }
              className="text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded-xl border-brutal-sm shadow-sm transition-transform active:scale-95 ml-auto"
            >
              Lihat Rekap ⭐
            </button>
          </div>
        </section>

        {/* ================= DAILY MISSIONS GRID ================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h2 className="text-base sm:text-lg font-black font-heading text-slate-900 dark:text-white">
                Tantangan Hari Ini (7 Pilar)
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Klik tombol misi untuk mengisi laporan harian
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HABITS.map((habit) => {
              const done = isHabitCompleted(habit.id);
              const sub = getSubmissionForHabit(habit.id);

              return (
                <div
                  key={habit.id}
                  className={`rounded-3xl border-brutal shadow-brutal p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                    done
                      ? 'bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950/80 dark:to-teal-950/80 border-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-900 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Top Card Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-brutal-sm font-black text-[11px]">
                        MISI #{habit.number}
                      </span>
                      {done ? (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-900 font-black text-[11px] flex items-center gap-1 border-brutal-sm shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          SELESAI
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 dark:bg-amber-900 text-slate-900 dark:text-amber-200 font-extrabold text-[10px] border-brutal-sm">
                          Menunggu
                        </span>
                      )}
                    </div>

                    {/* Big Emoji Container */}
                    <div className="flex flex-col items-center py-2 text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl border-brutal flex items-center justify-center text-3xl shadow-brutal-sm mb-2 transition-transform hover:scale-105 ${
                          done ? 'animate-bounce' : ''
                        }`}
                        style={{ backgroundColor: habit.bgColor }}
                      >
                        {habit.emoji}
                      </div>
                      <h3 className="font-black font-heading text-base text-slate-900 dark:text-white">
                        {habit.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                        {done
                          ? `+${sub?.pointsEarned || 15} Poin Bintang Didapat`
                          : habit.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Button */}
                  {done ? (
                    <button
                      onClick={() => setSelectedProof({ habit, sub })}
                      className="w-full mt-3 py-2.5 px-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs border-brutal shadow-brutal-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span>👉 SELESAI (Lihat Bukti)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveHabitModal(habit)}
                      className="w-full mt-3 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 font-black text-xs border-brutal-sm shadow-brutal-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span>✍️ KETUK DISINI</span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* Bonus Card: Achievement Showcase */}
            <div className="bg-gradient-to-tr from-amber-400/20 via-slate-900 to-slate-950 border-brutal shadow-brutal rounded-3xl p-4 text-white flex flex-col justify-between items-center text-center">
              <div className="w-full flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded-lg border-brutal-sm">
                  Lencana Aktif
                </span>
                <span className="text-amber-300 font-black text-xs">⭐ Lv. 3</span>
              </div>

              <div className="py-2">
                <div className="text-4xl animate-bounce">🏅</div>
                <h4 className="font-black font-heading text-sm text-amber-300 mt-1">
                  Pejuang Fajar
                </h4>
                <p className="text-[11px] font-bold text-slate-300">
                  Konsisten bangun pagi 7 hari
                </p>
              </div>

              <button
                onClick={() =>
                  alert('🏅 Lencana ini aktif! Pertahankan rekor disiplin harianmu!')
                }
                className="text-[11px] font-black bg-amber-300 hover:bg-amber-400 text-slate-900 border-brutal-sm w-full py-1.5 rounded-xl transition-transform active:scale-95 shadow-sm"
              >
                Lihat Prestasi
              </button>
            </div>
          </div>
        </section>

        {/* ================= WEEKLY REWARD CHEST BANNER ================= */}
        <footer className="pt-2">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-brutal shadow-brutal-lg rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-950">
            {/* Left: Chest Icon and Message */}
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white border-brutal shadow-brutal-sm flex items-center justify-center text-2xl shrink-0 animate-bounce">
                🎁
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <span className="font-black text-sm sm:text-base">
                    Hebat {user.name}! 🦁
                  </span>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300/40">
                    Progress: {completedCount}/7
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-950">
                  {7 - completedCount > 0
                    ? `Selesaikan ${7 - completedCount} misi lagi hari ini untuk membuka Peti Hadiah Mingguan!`
                    : 'Semua 7 Misi Selesai Hari Ini! Peti Hadiah Siap Dibuka! 🎉'}
                </p>
              </div>
            </div>

            {/* Right: Progress Mini Bar & Lock Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <div className="hidden sm:block w-36 bg-slate-950/20 h-3 rounded-full overflow-hidden p-0.5 border border-slate-950">
                <div
                  className="bg-slate-950 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              <button
                onClick={() => setShowChestModal(true)}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs border-brutal shadow-brutal flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 ${
                  completedCount >= 7
                    ? 'bg-emerald-400 text-slate-900 animate-pulse'
                    : 'bg-slate-950 text-amber-300'
                }`}
              >
                {completedCount >= 7 ? (
                  <>
                    <Gift className="w-4 h-4 text-slate-900" />
                    <span>🎁 Buka Peti Hadiah!</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Peti Terkunci ({completedCount}/7)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ================= MODALS ================= */}

      {/* Habit Submission Modal */}
      {activeHabitModal && (
        <HabitSubmissionModal
          habit={activeHabitModal}
          user={user}
          quizzes={quizzes}
          onClose={() => setActiveHabitModal(null)}
          onSubmit={(habitId, note, photoUrl, quizCorrect) => {
            onSubmitHabit(habitId, note, photoUrl, quizCorrect);
            setActiveHabitModal(null);
          }}
        />
      )}

      {/* Chest Reward Modal */}
      {showChestModal && (
        <ChestRewardModal
          user={user}
          completedCount={completedCount}
          onClose={() => setShowChestModal(false)}
        />
      )}

      {/* Proof / Detail Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-brutal shadow-brutal-lg rounded-3xl p-6 max-w-sm w-full text-center relative animate-fadeIn">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-1.5 rounded-xl border-brutal-sm hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 border-brutal-sm rounded-2xl mx-auto flex items-center justify-center text-3xl mb-3 shadow-sm">
              ✅
            </div>

            <h3 className="text-base font-black font-heading text-slate-900 dark:text-white">
              {selectedProof.habit.title} Selesai {selectedProof.habit.emoji}
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold mt-1">
              Terverifikasi Mandiri / Wali Kelas
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border-brutal-sm mt-4 text-xs text-slate-800 dark:text-slate-200 text-left space-y-1.5 font-bold">
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Lapor:</span>
                <strong className="text-slate-900 dark:text-white">
                  {selectedProof.sub?.completedAt || '06:30 WIB'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poin Diterima:</span>
                <strong className="text-amber-600 dark:text-amber-400">
                  +{selectedProof.sub?.pointsEarned || 15} Bintang
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Catatan:</span>
                <span className="text-slate-700 dark:text-slate-300 italic truncate max-w-[160px]">
                  {selectedProof.sub?.note || 'Misi dilaksanakan dengan semangat!'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              {selectedProof.sub && onDeleteSubmission && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Apakah Anda ingin menghapus laporan "${selectedProof.habit.title}" ini?`
                      )
                    ) {
                      onDeleteSubmission(selectedProof.sub!.id);
                      setSelectedProof(null);
                    }
                  }}
                  className="px-3 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs border-brutal-sm shadow-brutal-sm active:scale-95 transition-transform flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
              <button
                onClick={() => setSelectedProof(null)}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs border-brutal-sm shadow-brutal-sm active:scale-95 transition-transform"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
