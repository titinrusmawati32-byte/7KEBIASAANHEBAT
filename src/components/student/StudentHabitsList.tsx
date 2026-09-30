import React from 'react';
import { Habit, Submission, User } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  CheckCircle2,
  Clock,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StudentHabitsListProps {
  user: User;
  submissions: Submission[];
  todayStr: string;
  onOpenHabitModal: (habit: Habit, submission?: Submission) => void;
}

export const StudentHabitsList: React.FC<StudentHabitsListProps> = ({
  user,
  submissions,
  todayStr,
  onOpenHabitModal,
}) => {
  const todaySubs = submissions.filter(
    (s) => s.studentId === user.id && s.date === todayStr
  );

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          7 Kebiasaan Anak Indonesia Hebat
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pelajari panduan setiap kebiasaan dan laporkan pembiasaanmu setiap hari.
        </p>
      </div>

      <div className="space-y-3">
        {HABITS.map((habit) => {
          const sub = todaySubs.find((s) => s.habitId === habit.id);
          const isDone = !!sub;

          return (
            <div
              key={habit.id}
              onClick={() => onOpenHabitModal(habit, sub)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <span className="text-3xl p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shrink-0">
                  {habit.emoji}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kebiasaan #{habit.number}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-sky-600" />
                      {habit.timeRange}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                    {habit.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {habit.description}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-2">
                    {habit.guidance.map((g, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                      >
                        ✓ {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <div className="shrink-0 self-end sm:self-center">
                {isDone ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Sudah Selesai
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      Jam: {sub.completedAt}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHabitModal(habit);
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>Isi Laporan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
