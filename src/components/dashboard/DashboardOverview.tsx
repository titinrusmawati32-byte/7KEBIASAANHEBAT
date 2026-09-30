import React from 'react';
import { User, Submission, SchoolInfo } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Sparkles,
  Clock,
  Eye,
  Star,
  ChevronRight
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  todayStr: string;
  onNavigateTab: (tab: 'dashboard' | 'siswa' | 'pembiasaan' | 'laporan' | 'statistik' | 'pengaturan') => void;
  onSelectStudent: (student: User) => void;
  onViewProof?: (sub: Submission) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  users,
  submissions,
  todayStr,
  onNavigateTab,
  onSelectStudent,
  onViewProof,
}) => {
  // Students
  const students = users.filter((u) => u.role === 'siswa');
  const totalStudents = students.length;

  // Submissions today
  const todaySubs = submissions.filter((s) => s.date === todayStr);
  const totalReportsToday = todaySubs.length;

  // Calculate compliance per student today
  const studentCompliance = students.map((st) => {
    const studentSubsToday = todaySubs.filter((s) => s.studentId === st.id);
    const count = studentSubsToday.length;
    let status: 'baik' | 'perhatian' | 'bimbingan' = 'baik';
    if (count < 4) {
      status = 'bimbingan';
    } else if (count < 6) {
      status = 'perhatian';
    }
    return {
      student: st,
      count,
      status,
    };
  });

  // KPI Calculations
  const needsAttentionList = studentCompliance.filter((sc) => sc.status !== 'baik');
  const needsAttentionCount = needsAttentionList.length;

  const totalPossibleHabits = totalStudents * 7;
  const overallComplianceRate = totalPossibleHabits > 0
    ? Math.min(100, Math.round((totalReportsToday / totalPossibleHabits) * 100))
    : 85;

  // 7 Habits Progress Calculation
  const habitsProgress = HABITS.map((habit) => {
    const count = todaySubs.filter((s) => s.habitId === habit.id).length;
    const percentage = totalStudents > 0 ? Math.min(100, Math.round((count / totalStudents) * 100)) : 0;
    return {
      habit,
      count,
      percentage,
    };
  });

  // Recent Submissions (Latest 5 today or recent)
  const recentSubmissions = [...submissions]
    .sort((a, b) => (b.date + b.completedAt).localeCompare(a.date + a.completedAt))
    .slice(0, 5);

  // Top Consistent Students (Apresiasi / Pahlawan)
  const topStudents = [...students]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3);

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Selamat datang, {currentUser.name} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau perkembangan pembiasaan siswa hari ini ({todayStr}).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('laporan')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Lihat Laporan</span>
          </button>
          <button
            onClick={() => onNavigateTab('siswa')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Kelola Siswa</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards: Mobile-first CSS Grid (Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Siswa */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Siswa</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 border border-sky-100 dark:border-sky-900 shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalStudents}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500">Siswa</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Terpantau aktif</p>
        </div>

        {/* KPI 2: Kepatuhan Hari Ini */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Kepatuhan</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {overallComplianceRate}%
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-emerald-600">Hari ini</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Target 7 kebiasaan</p>
        </div>

        {/* KPI 3: Perlu Perhatian */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Perlu Perhatian</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-900 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {needsAttentionCount}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-amber-600">Siswa</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Capaian &lt; 4 misi</p>
        </div>

        {/* KPI 4: Laporan Hari Ini */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Laporan</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalReportsToday}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500">Terkirim</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Laporan masuk hari ini</p>
        </div>
      </div>

      {/* Grid: Progres 7 Kebiasaan & Siswa yang Perlu Perhatian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progres 7 Kebiasaan (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Progres 7 Kebiasaan
                </h3>
                <p className="text-xs text-slate-400">Persentase kepatuhan siswa hari ini</p>
              </div>
              <button
                onClick={() => onNavigateTab('pembiasaan')}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <span>Panduan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {habitsProgress.map(({ habit, percentage, count }) => (
                <div key={habit.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span>{habit.emoji}</span>
                      <span>{habit.number}. {habit.title}</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {percentage}% <span className="text-[11px] text-slate-400 font-normal">({count}/{totalStudents})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 80 ? 'bg-sky-600' : percentage >= 50 ? 'bg-teal-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Rata-rata kepatuhan sekolah:</span>
            <strong className="text-sky-600 font-bold">{overallComplianceRate}% Tercapai</strong>
          </div>
        </div>

        {/* Siswa yang Perlu Perhatian (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Siswa yang Perlu Perhatian
                </h3>
                <p className="text-xs text-slate-400">Pantau siswa dengan progres harian rendah</p>
              </div>
              <button
                onClick={() => onNavigateTab('siswa')}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <span>Lihat Semua Siswa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop & Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Nama Siswa</th>
                    <th className="pb-2.5">Kelas</th>
                    <th className="pb-2.5">Progres</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studentCompliance.slice(0, 5).map(({ student, count, status }) => {
                    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
                    let badgeLabel = 'Baik';

                    if (status === 'perhatian') {
                      badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
                      badgeLabel = 'Perlu Perhatian';
                    } else if (status === 'bimbingan') {
                      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
                      badgeLabel = 'Perlu Bimbingan';
                    }

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <span className="truncate max-w-[140px]">{student.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">
                          {student.class}
                        </td>
                        <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {count}/7 kebiasaan
                        </td>
                        <td className="py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeClass}`}>
                            {badgeLabel}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-lg transition-colors"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (No horizontal scrolling!) */}
            <div className="sm:hidden space-y-2.5">
              {studentCompliance.slice(0, 5).map(({ student, count, status }) => {
                let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
                let badgeLabel = 'Baik';

                if (status === 'perhatian') {
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
                  badgeLabel = 'Perlu Perhatian';
                } else if (status === 'bimbingan') {
                  badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
                  badgeLabel = 'Perlu Bimbingan';
                }

                return (
                  <div
                    key={student.id}
                    className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[150px]">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{student.class}</span>
                        </div>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500 font-medium">Progres: <strong className="text-slate-800 dark:text-slate-200">{count}/7 selesai</strong></span>
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="px-3 py-1.5 min-h-[36px] bg-white dark:bg-slate-800 text-sky-600 font-semibold text-xs rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
                      >
                        Lihat Detail →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => onNavigateTab('siswa')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
            >
              <span>Lihat Semua Siswa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row: Ringkasan Apresiasi & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ringkasan Apresiasi (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Apresiasi Siswa</span>
              </h3>
              <p className="text-xs text-slate-400">Siswa dengan konsistensi terbaik</p>
            </div>
            <button
              onClick={() => onNavigateTab('pembiasaan')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              Semua
            </button>
          </div>

          <div className="space-y-3">
            {topStudents.map((st, idx) => (
              <div
                key={st.id}
                onClick={() => onSelectStudent(st)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {st.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">{st.class}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{st.points || 0} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terbaru (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Aktivitas Terbaru</span>
              </h3>
              <p className="text-xs text-slate-400">Laporan pembiasaan yang baru masuk</p>
            </div>
            <button
              onClick={() => onNavigateTab('laporan')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              Lihat Laporan Lengkap
            </button>
          </div>

          <div className="space-y-2.5">
            {recentSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada aktivitas pembiasaan yang tercatat.</p>
            ) : (
              recentSubmissions.map((sub) => {
                const habit = HABITS.find((h) => h.id === sub.habitId);
                return (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{habit?.emoji || '⭐'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {sub.studentName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">
                            {sub.class}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Menyelesaikan <strong className="text-slate-700 dark:text-slate-300">{habit?.title}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {sub.completedAt || sub.date}
                      </span>
                      {sub.photoUrl && onViewProof && (
                        <button
                          onClick={() => onViewProof(sub)}
                          className="p-1 text-slate-400 hover:text-sky-600 rounded transition-colors"
                          title="Lihat Foto Bukti"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          sub.teacherVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {sub.teacherVerified ? 'Terverifikasi' : 'Menunggu'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
