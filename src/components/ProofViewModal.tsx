import React, { useState } from 'react';
import { Submission } from '../types';
import { HABITS } from '../data/habitsData';
import { X, CheckCircle, MessageSquare, Star, User, Trash2, Calendar, Clock } from 'lucide-react';

interface ProofViewModalProps {
  submission: Submission;
  onClose: () => void;
  onVerify?: (submissionId: string, feedback: string) => void;
  onDelete?: (submissionId: string) => void;
}

export const ProofViewModal: React.FC<ProofViewModalProps> = ({
  submission,
  onClose,
  onVerify,
  onDelete,
}) => {
  const [feedback, setFeedback] = useState(submission.teacherFeedback || '');

  const habit = HABITS.find((h) => h.id === submission.habitId) || HABITS[0];

  const handleSave = () => {
    if (onVerify) {
      onVerify(submission.id, feedback);
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus laporan "${habit.title}" milik ${submission.studentName}?`)) {
      if (onDelete) {
        onDelete(submission.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg overflow-hidden relative text-slate-900 dark:text-slate-100 transition-all">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">{habit.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 rounded-md border border-sky-200 dark:border-sky-800">
                  {submission.class}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Pembiasaan #{habit.number}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {habit.title} • {submission.studentName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Submission Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 font-medium">
              <User className="w-4 h-4 text-sky-600" />
              <span>Siswa: <strong className="text-slate-900 dark:text-white">{submission.studentName}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {submission.completedAt}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {submission.date}
              </span>
            </div>
          </div>

          {/* Photo Proof */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Dokumentasi Foto:
            </label>
            {submission.photoUrl ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={submission.photoUrl}
                  alt={`Bukti ${habit.title}`}
                  className="w-full max-h-72 object-contain"
                />
              </div>
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
                Tidak ada lampiran foto (Aktivitas dicatat secara mandiri)
              </div>
            )}
          </div>

          {/* Student Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Catatan Siswa:
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{submission.note || 'Siswa tidak mencantumkan catatan tambahan.'}"
            </div>
          </div>

          {/* Teacher Feedback / Verification Form */}
          {onVerify && (
            <div className="bg-sky-50/60 dark:bg-slate-800/70 border border-sky-100 dark:border-slate-700 rounded-xl p-3.5 space-y-2">
              <label className="text-xs font-semibold text-sky-950 dark:text-sky-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                Catatan Apresiasi / Bimbingan Guru:
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tuliskan pujian positif atau saran bimbingan bagi siswa ini..."
                rows={2}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              +{submission.pointsEarned} Poin
            </span>

            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                title="Hapus Laporan Ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Tutup
            </button>
            {onVerify && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verifikasi Laporan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

