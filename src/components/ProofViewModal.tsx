import React, { useState } from 'react';
import { Submission, Habit } from '../types';
import { HABITS } from '../data/habitsData';
import { X, CheckCircle, MessageSquare, Star, User, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-brutal shadow-brutal-lg rounded-2xl w-full max-w-lg overflow-hidden relative text-slate-900 dark:text-slate-100">
        {/* Modal Top Header */}
        <div
          className="p-4 border-b-2 border-slate-900 flex items-center justify-between"
          style={{ backgroundColor: habit.bgColor }}
        >
          <div className="flex items-center gap-2">
            <span className="text-3xl">{habit.emoji}</span>
            <div>
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-white text-slate-900 border-brutal-sm rounded-md">
                {submission.class}
              </span>
              <h3 className="text-xl font-black font-heading text-slate-900">
                {habit.title} - {submission.studentName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-400 hover:bg-red-500 text-white font-black p-1.5 rounded-xl border-brutal-sm shadow-brutal-sm active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Submission Info Bar */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border-brutal-sm text-xs font-bold text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Agen: {submission.studentName}</span>
            </div>
            <div>
              🕒 {submission.completedAt} | 📅 {submission.date}
            </div>
          </div>

          {/* Photo Proof */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1">
              📷 Bukti Foto / Dokumentasi Misi:
            </label>
            {submission.photoUrl ? (
              <div className="rounded-xl border-brutal-sm overflow-hidden bg-slate-900">
                <img
                  src={submission.photoUrl}
                  alt={`Bukti ${habit.title}`}
                  className="w-full h-56 object-contain bg-black/40"
                />
              </div>
            ) : (
              <div className="p-6 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                Tidak ada foto diunggah (Misi dicatat tanpa foto)
              </div>
            )}
          </div>

          {/* Student Note */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1">
              📝 Catatan / Laporan Siswa:
            </label>
            <div className="p-3 bg-yellow-50 dark:bg-slate-800 border-brutal-sm rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 italic">
              "{submission.note || 'Siswa tidak menambahkan catatan.'}"
            </div>
          </div>

          {/* Teacher Feedback / Verification Form */}
          {onVerify && (
            <div className="bg-sky-50 dark:bg-slate-800 border-brutal-sm rounded-xl p-3 space-y-2">
              <label className="block text-xs font-black uppercase text-sky-900 dark:text-sky-300 flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                Apresiasi & Catatan Guru / Kepsek:
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Berikan pujian atau masukan untuk agen ini..."
                rows={2}
                className="w-full p-2 bg-white dark:bg-slate-900 border-brutal-sm rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-900 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>+{submission.pointsEarned} Poin</span>
            </div>

            {/* Delete Button */}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl border-brutal-sm shadow-sm flex items-center gap-1 transition-transform active:scale-95 ml-2"
                title="Hapus Laporan Ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Laporan</span>
              </button>
            )}
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-xl border-brutal-sm shadow-brutal-sm"
            >
              Tutup
            </button>
            {onVerify && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-extrabold text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1 active:scale-95 transition-transform"
              >
                <CheckCircle className="w-4 h-4" />
                Simpan & Verifikasi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
