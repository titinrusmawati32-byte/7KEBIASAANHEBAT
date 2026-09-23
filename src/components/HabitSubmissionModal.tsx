import React, { useState } from 'react';
import { Habit, User, QuizQuestion } from '../types';
import { X, Camera, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HabitSubmissionModalProps {
  habit: Habit;
  user: User;
  quizzes: QuizQuestion[];
  onClose: () => void;
  onSubmit: (habitId: Habit['id'], note: string, photoUrl: string, quizAnsweredCorrectly: boolean) => void;
}

export const HabitSubmissionModal: React.FC<HabitSubmissionModalProps> = ({
  habit,
  user,
  quizzes,
  onClose,
  onSubmit,
}) => {
  const [note, setNote] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Find quiz related to this habit
  const habitQuiz = quizzes.find((q) => q.habitId === habit.id);

  // Preset sample photos for easy selection / simulation if user doesn't upload
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = habitQuiz && selectedQuizIndex === habitQuiz.correctOptionIndex;
    
    // Trigger celebratory confetti safely
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }

    onSubmit(
      habit.id,
      note || `Misi ${habit.title} telah selesai dilaksanakan dengan baik oleh Agen ${user.name}!`,
      photoUrl || samplePhotos[Math.floor(Math.random() * samplePhotos.length)],
      !!isCorrect
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white border-brutal shadow-brutal-lg rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 md:p-6 relative"
        style={{ backgroundColor: habit.cardBg }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-400 hover:bg-red-500 text-white font-black p-2 rounded-xl border-brutal-sm shadow-brutal-sm transition-transform active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl p-3 bg-white border-brutal rounded-2xl shadow-brutal-sm">
            {habit.emoji}
          </div>
          <div>
            <span className="text-xs font-black uppercase px-3 py-1 bg-yellow-300 border-brutal-sm rounded-full tracking-wider">
              Misi #{habit.number}
            </span>
            <h2 className="text-2xl font-black font-heading text-slate-900 mt-1">
              {habit.title}
            </h2>
            <p className="text-xs font-bold text-slate-700">{habit.timeRange}</p>
          </div>
        </div>

        {/* Description & Tips */}
        <div className="bg-white/80 backdrop-blur border-brutal-sm rounded-xl p-3 mb-4 text-xs md:text-sm font-semibold text-slate-800">
          <p className="mb-2">{habit.description}</p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 rounded text-xs font-bold text-yellow-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <span>{habit.tips}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guidance Check List */}
          <div className="bg-white p-3 rounded-xl border-brutal-sm">
            <h4 className="text-xs font-extrabold uppercase text-slate-700 mb-2">
              Panduan Pelaksanaan:
            </h4>
            <ul className="space-y-1.5">
              {habit.guidance.map((item, idx) => (
                <li key={idx} className="text-xs font-bold flex items-start gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo Upload / Proof */}
          <div className="bg-white p-3 rounded-xl border-brutal-sm">
            <label className="block text-xs font-extrabold uppercase text-slate-800 mb-2">
              📸 Bukti Foto / Dokumentasi Misi {habit.photoRequired ? '(Wajib)' : '(Opsional)'}:
            </label>

            {photoUrl ? (
              <div className="relative rounded-xl border-brutal-sm overflow-hidden mb-2 group">
                <img src={photoUrl} alt="Bukti Misi" className="w-full h-44 object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white font-bold text-xs px-2 py-1 rounded-lg border-brutal-sm shadow-sm"
                >
                  Ganti Foto
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-extrabold text-xs py-2.5 px-3 rounded-xl border-brutal-sm shadow-brutal-sm cursor-pointer transition-transform active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Unggah Foto dari HP/Galeri</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      // Set sample image
                      setPhotoUrl(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
                    }}
                    className="flex items-center gap-1.5 bg-sky-300 hover:bg-sky-400 text-slate-900 font-extrabold text-xs py-2.5 px-3 rounded-xl border-brutal-sm shadow-brutal-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Foto Contoh</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
              📝 Catatan / Cerita Misi Hari Ini:
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Ceritakan pengalamanmu saat ${habit.title.toLowerCase()} hari ini...`}
              rows={2}
              className="w-full p-2.5 bg-white border-brutal-sm rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Habit Quiz Challenge if available */}
          {habitQuiz && (
            <div className="bg-purple-100 border-brutal-sm rounded-xl p-3">
              <h4 className="text-xs font-black uppercase text-purple-900 mb-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Tantangan Kuis Bonus (+10 Poin)
              </h4>
              <p className="text-xs font-bold text-slate-800 mb-2">
                {habitQuiz.question}
              </p>
              <div className="space-y-1.5">
                {habitQuiz.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => setSelectedQuizIndex(oIdx)}
                    className={`w-full text-left p-2 rounded-lg border-2 text-xs font-bold transition-colors ${
                      selectedQuizIndex === oIdx
                        ? 'bg-purple-600 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black font-heading text-lg rounded-xl border-brutal shadow-brutal hover:shadow-brutal-lg transition-transform active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            <span>🚀 LAPORKAN & SELESAIKAN MISI!</span>
          </button>
        </form>
      </div>
    </div>
  );
};
