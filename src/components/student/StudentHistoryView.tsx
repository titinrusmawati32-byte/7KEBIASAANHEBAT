import React from 'react';
import { Submission, User } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  Star
} from 'lucide-react';

interface StudentHistoryViewProps {
  user: User;
  submissions: Submission[];
}

export const StudentHistoryView: React.FC<StudentHistoryViewProps> = ({
  user,
  submissions,
}) => {
  const userSubs = submissions.filter((s) => s.studentId === user.id);

  // Group submissions by date
  const dateMap: { [date: string]: Submission[] } = {};
  userSubs.forEach((sub) => {
    if (!dateMap[sub.date]) dateMap[sub.date] = [];
    dateMap[sub.date].push(sub);
  });

  // Sort dates descending
  const sortedDates = Object.keys(dateMap).sort().reverse();

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Riwayat Pembiasaan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Catatan perkembangan kedisiplinan 7 kebiasaan yang telah kamu laporkan.
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Belum ada riwayat pembiasaan
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Mulailah dengan mengisi laporan kebiasaan pertamamu di halaman Dashboard hari ini.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop & Tablet Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Kebiasaan Selesai</th>
                  <th className="py-3 px-4">Persentase</th>
                  <th className="py-3 px-4">Status Capaian</th>
                  <th className="py-3 px-4">Poin Diperoleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedDates.map((dateStr) => {
                  const daySubs = dateMap[dateStr];
                  const completed = daySubs.length;
                  const percentage = Math.min(100, Math.round((completed / 7) * 100));
                  const pointsSum = daySubs.reduce((acc, s) => acc + (s.pointsEarned || 0), 0);

                  let statusBadge = {
                    label: 'Sangat Baik',
                    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
                  };
                  if (completed < 4) {
                    statusBadge = {
                      label: 'Perlu Ditingkatkan',
                      className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
                    };
                  } else if (completed < 7) {
                    statusBadge = {
                      label: 'Baik',
                      className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
                    };
                  }

                  // Format readable date in Indonesian
                  const dateObj = new Date(dateStr);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : dateStr;

                  return (
                    <tr
                      key={dateStr}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {completed} dari 7 kebiasaan
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                completed === 7 ? 'bg-emerald-500' : completed >= 4 ? 'bg-sky-600' : 'bg-rose-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{percentage}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          +{pointsSum} Pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {sortedDates.map((dateStr) => {
              const daySubs = dateMap[dateStr];
              const completed = daySubs.length;
              const percentage = Math.min(100, Math.round((completed / 7) * 100));
              const pointsSum = daySubs.reduce((acc, s) => acc + (s.pointsEarned || 0), 0);

              let statusBadge = {
                label: 'Sangat Baik',
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
              };
              if (completed < 4) {
                statusBadge = {
                  label: 'Perlu Ditingkatkan',
                  className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
                };
              } else if (completed < 7) {
                statusBadge = {
                  label: 'Baik',
                  className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
                };
              }

              const dateObj = new Date(dateStr);
              const formattedDate = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('id-ID', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : dateStr;

              return (
                <div key={dateStr} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {formattedDate}
                      </span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="space-y-1 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Capaian:</span>
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {completed}/7 Kebiasaan ({percentage}%)
                      </strong>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          completed === 7 ? 'bg-emerald-500' : completed >= 4 ? 'bg-sky-600' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <span className="text-slate-400 text-[11px]">{daySubs.length} aktivitas dicatat</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      +{pointsSum} Pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
