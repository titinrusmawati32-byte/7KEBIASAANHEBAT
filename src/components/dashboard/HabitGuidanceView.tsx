import React, { useState } from 'react';
import { User, SchoolInfo } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  Award,
  BookOpen,
  Send,
  Star,
  Sparkles,
  Play,
  CheckCircle,
  HelpCircle,
  Clock,
  Heart
} from 'lucide-react';

interface HabitGuidanceViewProps {
  currentUser: User;
  users: User[];
  schoolInfo: SchoolInfo;
  onSendAppreciation: (studentId: string, studentName: string, note?: string) => void;
}

export const HabitGuidanceView: React.FC<HabitGuidanceViewProps> = ({
  currentUser,
  users,
  schoolInfo,
  onSendAppreciation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'panduan' | 'apresiasi' | 'catatan' | 'video'>('panduan');

  // Form apresiasi
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [appreciationNote, setAppreciationNote] = useState<string>('');
  const [isSent, setIsSent] = useState(false);

  const students = users.filter((u) => u.role === 'siswa');
  const sortedStudents = [...students].sort((a, b) => (b.points || 0) - (a.points || 0));

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    onSendAppreciation(student.id, student.name, appreciationNote);
    setIsSent(true);
    setAppreciationNote('');
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Header and Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Program Pembiasaan Karakter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Panduan kriteria 7 kebiasaan anak hebat, apresiasi konsistensi siswa, dan catatan guru.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('panduan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'panduan'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Panduan & Kriteria
          </button>
          <button
            onClick={() => setActiveSubTab('apresiasi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'apresiasi'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Apresiasi Siswa
          </button>
          <button
            onClick={() => setActiveSubTab('catatan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'catatan'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Beri Apresiasi
          </button>
          <button
            onClick={() => setActiveSubTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'video'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Senam Hebat
          </button>
        </div>
      </div>

      {/* 1. Panduan & Kriteria 7 Kebiasaan */}
      {activeSubTab === 'panduan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HABITS.map((habit) => (
            <div
              key={habit.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">{habit.emoji}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 rounded-lg border border-sky-100 dark:border-sky-900">
                    Kebiasaan #{habit.number}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {habit.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Target Waktu: {habit.timeRange}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {habit.description}
                </p>

                {/* Guidance checklist */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kriteria Pembiasaan:
                  </span>
                  {habit.guidance.map((g, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/50">
                💡 Tips: {habit.tips}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Apresiasi Siswa (Pahlawan Pembiasaan Konsisten) */}
      {activeSubTab === 'apresiasi' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Pahlawan Pembiasaan (Konsistensi Terbaik)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Apresiasi untuk siswa yang paling konsisten menjalankan 7 kebiasaan anak hebat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sortedStudents.slice(0, 3).map((st, idx) => (
                <div
                  key={st.id}
                  className={`rounded-2xl p-5 border text-center space-y-3 relative overflow-hidden ${
                    idx === 0
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      : idx === 1
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-slate-800 border-2 border-amber-400 flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-sm text-base">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {st.name}
                    </h4>
                    <p className="text-xs text-slate-500">{st.class}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{st.points || 0} Poin Karakter</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Ranking List */}
            <div className="mt-8 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Daftar Peringkat Konsistensi Lengkap
              </h4>
              {sortedStudents.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-xs text-slate-400">
                      #{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {st.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{st.class}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {st.points || 0} Poin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Form Berikan Apresiasi Guru */}
      {activeSubTab === 'catatan' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Berikan Apresiasi Guru</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kirimkan pujian dan motivasi langsung kepada siswa atas kedisiplinan pembiasaannya.
            </p>
          </div>

          {isSent && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Apresiasi berhasil dikirim! Siswa mendapatkan +10 Poin Karakter tambahan.</span>
            </div>
          )}

          <form onSubmit={handleSendNote} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Siswa
              </label>
              <select
                required
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="">-- Pilih Siswa Penerima --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.class})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pesan Apresiasi / Motivasi Guru
              </label>
              <textarea
                required
                rows={3}
                value={appreciationNote}
                onChange={(e) => setAppreciationNote(e.target.value)}
                placeholder="Contoh: Hebat! Kamu sudah konsisten bangun pagi dan sarapan sehat selama 7 hari berturut-turut. Pertahankan ya!"
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                Otomatis memberikan +10 Poin Karakter
              </span>

              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Apresiasi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Video Senam Hebat */}
      {activeSubTab === 'video' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-sky-600" />
              <span>{schoolInfo.videoTitle || 'Senam Anak Indonesia Hebat'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kanal: {schoolInfo.videoChannel || 'KEMDIKDASMEN RI'} • Digunakan sebagai panduan pembiasaan berolahraga pagi bersama di sekolah.
            </p>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
            <iframe
              src={schoolInfo.youtubeEmbedUrl || 'https://www.youtube.com/embed/8o_dJ85Gz3E'}
              title="Senam Anak Indonesia Hebat"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
