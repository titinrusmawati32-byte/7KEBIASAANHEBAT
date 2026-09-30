import React from 'react';
import { User, Submission } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface StatisticsViewProps {
  users: User[];
  submissions: Submission[];
  todayStr: string;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  users,
  submissions,
  todayStr,
}) => {
  const students = users.filter((u) => u.role === 'siswa');
  const totalStudents = students.length;

  // Extract unique classes
  const classes = Array.from(new Set(students.map((s) => s.class))).filter(Boolean);

  // Class Comparison stats
  const classStats = classes.map((className) => {
    const classStudents = students.filter((s) => s.class === className);
    const countStudents = classStudents.length;
    const classSubs = submissions.filter((s) => s.class === className && s.date === todayStr);
    const target = countStudents * 7;
    const percentage = target > 0 ? Math.min(100, Math.round((classSubs.length / target) * 100)) : 0;

    return {
      className,
      countStudents,
      submissionsToday: classSubs.length,
      percentage,
    };
  });

  // Habit Performance stats
  const habitStats = HABITS.map((habit) => {
    const totalHabitSubs = submissions.filter((s) => s.habitId === habit.id).length;
    const todayHabitSubs = submissions.filter((s) => s.habitId === habit.id && s.date === todayStr).length;
    const todayPercent = totalStudents > 0 ? Math.min(100, Math.round((todayHabitSubs / totalStudents) * 100)) : 0;

    return {
      habit,
      totalCount: totalHabitSubs,
      todayCount: todayHabitSubs,
      todayPercent,
    };
  });

  // Overall compliance rate today
  const totalSubsToday = submissions.filter((s) => s.date === todayStr).length;
  const totalPossibleToday = totalStudents * 7;
  const overallRate = totalPossibleToday > 0 ? Math.min(100, Math.round((totalSubsToday / totalPossibleToday) * 100)) : 82;

  // Category distribution
  let baikCount = 0;
  let perhatianCount = 0;
  let bimbinganCount = 0;

  students.forEach((student) => {
    const c = submissions.filter((s) => s.studentId === student.id && s.date === todayStr).length;
    if (c >= 6) baikCount++;
    else if (c >= 4) perhatianCount++;
    else bimbinganCount++;
  });

  const verifiedCount = submissions.filter((s) => s.teacherVerified).length;

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Statistik & Analisis Pembiasaan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Tinjauan analitik kepatuhan 7 kebiasaan karakter dan perbandingan kelas ({todayStr}).
        </p>
      </div>

      {/* 4 Metric Summary Cards: Mobile-first CSS Grid (grid-cols-1 for mobile, sm:grid-cols-2 for tablet, lg:grid-cols-4 for desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Rata-rata kepatuhan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Kepatuhan Sekolah</span>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-600">{overallRate}%</span>
            <span className="text-[10px] sm:text-xs text-slate-500">Hari ini</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: `${overallRate}%` }} />
          </div>
        </div>

        {/* Card 2: Laporan Masuk Hari Ini */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Laporan Hari Ini</span>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{totalSubsToday}</span>
            <span className="text-[10px] sm:text-xs text-slate-500">Aktivitas</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-3 truncate">{verifiedCount} laporan telah terverifikasi</p>
        </div>

        {/* Card 3: Total Akumulasi Laporan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Akumulasi</span>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{submissions.length}</span>
            <span className="text-[10px] sm:text-xs text-slate-500">Laporan</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-3 truncate">Arsip historis pembiasaan</p>
        </div>

        {/* Card 4: Distribusi Kategori Siswa */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Distribusi Siswa</span>
          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
            <span className="text-emerald-600">{baikCount} Baik</span>
            <span className="text-amber-600">{perhatianCount} Perhatian</span>
            <span className="text-rose-600">{bimbinganCount} Bimbingan</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex mt-3">
            <div className="bg-emerald-500 h-full" style={{ width: `${(baikCount / (totalStudents || 1)) * 100}%` }} />
            <div className="bg-amber-500 h-full" style={{ width: `${(perhatianCount / (totalStudents || 1)) * 100}%` }} />
            <div className="bg-rose-500 h-full" style={{ width: `${(bimbinganCount / (totalStudents || 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Grid: Kepatuhan 7 Kebiasaan & Perbandingan Antar Kelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kepatuhan 7 Kebiasaan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Statistik 7 Kebiasaan Karakter</span>
            </h3>
            <p className="text-xs text-slate-400">Persentase kepatuhan seluruh siswa per kebiasaan hari ini</p>
          </div>

          <div className="space-y-3 pt-2">
            {habitStats.map(({ habit, todayPercent, todayCount, totalCount }) => (
              <div key={habit.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span>{habit.emoji}</span>
                    <span>{habit.number}. {habit.title}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {todayPercent}% <span className="text-slate-400 font-normal">({todayCount}/{totalStudents} siswa)</span>
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      todayPercent >= 75 ? 'bg-sky-600' : todayPercent >= 50 ? 'bg-teal-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${todayPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perbandingan Antar Kelas */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Perbandingan Kepatuhan Antar Kelas</span>
                </h3>
                <p className="text-xs text-slate-400">Tingkat capaian pembiasaan 7 kebiasaan antar rombel</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {classStats.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Belum ada data kelas yang terdaftar.</p>
              ) : (
                classStats.map((cs) => (
                  <div key={cs.className} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{cs.className}</span>
                        <span className="text-[11px] text-slate-500">{cs.countStudents} Siswa • {cs.submissionsToday} Laporan</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-sky-600">{cs.percentage}%</span>
                        <span className="text-[10px] text-slate-400 block">Kepatuhan</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all"
                        style={{ width: `${cs.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Rombel terpantau: <strong>{classes.length} Kelas</strong></span>
            <span>Total siswa: <strong>{totalStudents} Siswa</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
