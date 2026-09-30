import React from 'react';
import { User, Submission } from '../types';
import { HABITS } from '../data/habitsData';
import { X, CheckCircle2, AlertCircle, Clock, Award, Star, MessageSquare } from 'lucide-react';

interface StudentDetailModalProps {
  student: User;
  submissions: Submission[];
  todayStr: string;
  onClose: () => void;
  onViewProof?: (sub: Submission) => void;
  onSendAppreciation?: (studentId: string, studentName: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  submissions,
  todayStr,
  onClose,
  onViewProof,
  onSendAppreciation,
}) => {
  // Today's submissions for this student
  const todaySubs = submissions.filter(
    (s) => s.studentId === student.id && s.date === todayStr
  );
  const completedCount = todaySubs.length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  // Status indicator
  let statusBadge = {
    label: 'Baik',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  };
  if (completedCount < 4) {
    statusBadge = {
      label: 'Perlu Bimbingan',
      className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    };
  } else if (completedCount < 6) {
    statusBadge = {
      label: 'Perlu Perhatian',
      className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-xl text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {student.name}
                </h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {student.class} • NISN/ID: {student.username} • {student.points || 0} Poin Karakter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Progres Pembiasaan Hari Ini
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {completedCount} dari 7 Kebiasaan ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completedCount >= 6 ? 'bg-emerald-500' : completedCount >= 4 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 7 Habits Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Status 7 Kebiasaan ({todayStr})
            </h4>
            <div className="space-y-2">
              {HABITS.map((habit) => {
                const sub = todaySubs.find((s) => s.habitId === habit.id);
                const isCompleted = !!sub;

                return (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                        : 'bg-slate-50/60 dark:bg-slate-800/30 border-dashed border-slate-200 dark:border-slate-700 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{habit.emoji}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {habit.number}. {habit.title}
                          </span>
                          <span className="text-[10px] text-slate-400">({habit.timeRange})</span>
                        </div>
                        {sub?.note && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                            "{sub.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            {sub.completedAt}
                          </span>
                          {sub.photoUrl && onViewProof && (
                            <button
                              onClick={() => onViewProof(sub)}
                              className="text-[11px] font-medium text-sky-600 hover:text-sky-700 hover:underline px-2 py-0.5"
                            >
                              Lihat Foto
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                          Belum selesai
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Total Poin: <strong className="text-slate-900 dark:text-white">{student.points || 0} Pts</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {onSendAppreciation && (
              <button
                type="button"
                onClick={() => onSendAppreciation(student.id, student.name)}
                className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Beri Apresiasi (+10)
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
