import React, { useState } from 'react';
import { Habit, User, Submission, QuizQuestion } from '../../types';
import {
  X,
  CheckCircle2,
  Clock,
  Camera,
  Upload,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Trash2,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentHabitModalProps {
  habit: Habit;
  user: User;
  submission?: Submission;
  quizzes: QuizQuestion[];
  onClose: () => void;
  onSubmit: (habitId: Habit['id'], note: string, photoUrl: string, quizAnsweredCorrectly: boolean) => void;
  onDelete?: (submissionId: string) => void;
}

export const StudentHabitModal: React.FC<StudentHabitModalProps> = ({
  habit,
  user,
  submission,
  quizzes,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const isAlreadyDone = !!submission;

  const [hasDone, setHasDone] = useState<boolean>(true);
  const [note, setNote] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);

  // Find quiz related to this habit
  const habitQuiz = quizzes.find((q) => q.habitId === habit.id);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasDone) {
      onClose();
      return;
    }

    const isQuizCorrect = habitQuiz && selectedQuizOpt === habitQuiz.correctOptionIndex;

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.warn(err);
    }

    const defaultNote = `Saya sudah menyelesaikan kebiasaan ${habit.title} hari ini.`;
    const defaultPhoto = habit.photoRequired
      ? samplePhotos[habit.number % samplePhotos.length]
      : '';

    onSubmit(
      habit.id,
      note.trim() || defaultNote,
      photoUrl || defaultPhoto,
      !!isQuizCorrect
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
              {habit.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 rounded-md border border-sky-200 dark:border-sky-800">
                  Kebiasaan #{habit.number}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {habit.timeRange}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {habit.title}
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
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Description */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {habit.description}
            </p>
          </div>

          {/* VIEW MODE: If already completed today */}
          {isAlreadyDone ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kebiasaan ini sudah kamu laporkan hari ini!</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                  {submission.completedAt}
                </span>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Catatan Laporanmu:
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic">
                  "{submission.note || 'Tidak ada catatan.'}"
                </div>
              </div>

              {/* Photo Proof */}
              {submission.photoUrl && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Dokumentasi Foto:
                  </label>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 max-h-56 flex items-center justify-center">
                    <img
                      src={submission.photoUrl}
                      alt={habit.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Teacher Feedback if any */}
              {submission.teacherFeedback && (
                <div className="p-3.5 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Pesan Apresiasi Guru:
                  </span>
                  <p className="text-xs text-sky-800 dark:text-sky-200 italic">
                    "{submission.teacherFeedback}"
                  </p>
                </div>
              )}

              {/* Points badge */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>+{submission.pointsEarned || 15} Poin Diperoleh</span>
                </span>

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Ingin menghapus laporan kebiasaan ini?')) {
                        onDelete(submission.id);
                        onClose();
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Laporan</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* SUBMISSION FORM: If not completed yet */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Question 1: Did you do it? */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                  Apakah kamu sudah melakukan kebiasaan ini hari ini?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasDone(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      hasDone
                        ? 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Ya, sudah dilakukan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasDone(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      !hasDone
                        ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span>Belum sekarang</span>
                  </button>
                </div>
              </div>

              {hasDone && (
                <>
                  {/* Question 2: Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Catatan Singkat (Opsional)
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Contoh: Bangun jam 05.00 dan langsung beresin tempat tidur..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  {/* Question 3: Photo (optional/required) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Foto Dokumentasi {habit.photoRequired ? '(Direkomendasikan)' : '(Opsional)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-400 rounded-xl cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
                        <Camera className="w-4 h-4 text-sky-600" />
                        <span>{photoUrl ? 'Ganti Foto' : 'Ambil Foto / Unggah'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {photoUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bonus Quiz Challenge (if available) */}
                  {habitQuiz && (
                    <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900 rounded-xl space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Kuis Singkat (+10 Poin Bonus)</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {habitQuiz.question}
                      </p>
                      <div className="space-y-1.5">
                        {habitQuiz.options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedQuizOpt(idx)}
                            className={`w-full text-left p-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                              selectedQuizOpt === idx
                                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                            {selectedQuizOpt === idx && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {hasDone ? 'Simpan Laporan' : 'Tutup'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
