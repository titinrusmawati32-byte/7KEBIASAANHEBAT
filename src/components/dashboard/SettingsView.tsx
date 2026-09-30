import React, { useState } from 'react';
import { User, SchoolInfo, QuizQuestion } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  Settings,
  Building,
  Users,
  HelpCircle,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  Shield,
  UserCheck
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: User;
  schoolInfo: SchoolInfo;
  users: User[];
  quizzes: QuizQuestion[];
  onUpdateSchoolInfo: (info: SchoolInfo) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateQuizzes: (quizzes: QuizQuestion[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  schoolInfo,
  users,
  quizzes,
  onUpdateSchoolInfo,
  onUpdateUsers,
  onUpdateQuizzes,
}) => {
  const [activeTab, setActiveTab] = useState<'kop' | 'pengguna' | 'kuis'>('kop');

  // KOP Form state
  const [kopForm, setKopForm] = useState<SchoolInfo>({ ...schoolInfo });
  const [isSavedKop, setIsSavedKop] = useState(false);

  // New User Form state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<'siswa' | 'guru' | 'admin'>('guru');
  const [newUserClass, setNewUserClass] = useState('Kelas 5 A');

  // New Quiz state
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [newQuizHabitId, setNewQuizHabitId] = useState(HABITS[0].id);
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizOptA, setNewQuizOptA] = useState('');
  const [newQuizOptB, setNewQuizOptB] = useState('');
  const [newQuizOptC, setNewQuizOptC] = useState('');
  const [newQuizOptD, setNewQuizOptD] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState(0);

  const handleSaveKop = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(kopForm);
    setIsSavedKop(true);
    setTimeout(() => setIsSavedKop(false), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) return;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      username: newUserUsername.trim(),
      role: newUserRole,
      class: newUserRole === 'siswa' ? newUserClass : 'Dewan Guru',
      points: 0,
      isOnline: true,
    };

    onUpdateUsers([...users, newUser]);
    setNewUserName('');
    setNewUserUsername('');
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${name}"?`)) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizQuestion.trim() || !newQuizOptA.trim() || !newQuizOptB.trim()) return;

    const newQuiz: QuizQuestion = {
      id: `q-${Date.now()}`,
      habitId: newQuizHabitId,
      question: newQuizQuestion.trim(),
      options: [newQuizOptA.trim(), newQuizOptB.trim(), newQuizOptC.trim() || 'Pilihan C', newQuizOptD.trim() || 'Pilihan D'],
      correctOptionIndex: newQuizCorrect,
      points: 10,
      explanation: 'Jawaban yang tepat untuk memupuk karakter anak hebat.',
    };

    onUpdateQuizzes([...quizzes, newQuiz]);
    setNewQuizQuestion('');
    setNewQuizOptA('');
    setNewQuizOptB('');
    setNewQuizOptC('');
    setNewQuizOptD('');
    setShowAddQuizModal(false);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Hapus soal kuis ini?')) {
      onUpdateQuizzes(quizzes.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Header and Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pengaturan Sistem
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Konfigurasi identitas sekolah, manajemen pengguna (guru/operator), dan bank kuis.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('kop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'kop'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Profil & KOP Sekolah
          </button>
          <button
            onClick={() => setActiveTab('pengguna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pengguna'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Manajemen Pengguna
          </button>
          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'kuis'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Bank Soal Kuis
          </button>
        </div>
      </div>

      {/* 1. KOP Form */}
      {activeTab === 'kop' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-600" />
                <span>Identitas & KOP Resmi Sekolah</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Data ini akan tampil pada header portal, laporan cetak resmi, dan unduhan PDF.
              </p>
            </div>
          </div>

          {isSavedKop && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data profil dan KOP sekolah berhasil diperbarui!</span>
            </div>
          )}

          <form onSubmit={handleSaveKop} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Sekolah (KOP Resmi)
              </label>
              <input
                type="text"
                required
                value={kopForm.schoolName}
                onChange={(e) => setKopForm({ ...kopForm, schoolName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Portal Aplikasi
              </label>
              <input
                type="text"
                required
                value={kopForm.portalTitle}
                onChange={(e) => setKopForm({ ...kopForm, portalTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle / Slogan Portal
              </label>
              <input
                type="text"
                value={kopForm.subtitle}
                onChange={(e) => setKopForm({ ...kopForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logo 1 (Kemdikbud URL)
                </label>
                <input
                  type="text"
                  value={kopForm.logo1Url}
                  onChange={(e) => setKopForm({ ...kopForm, logo1Url: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logo 2 (Pemkab Daerah URL)
                </label>
                <input
                  type="text"
                  value={kopForm.logo2Url}
                  onChange={(e) => setKopForm({ ...kopForm, logo2Url: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logo 3 (Logo Sekolah URL)
                </label>
                <input
                  type="text"
                  value={kopForm.logo3Url}
                  onChange={(e) => setKopForm({ ...kopForm, logo3Url: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan KOP</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. User Management */}
      {activeTab === 'pengguna' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Seluruh Pengguna ({users.length} Akun)
            </h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengguna</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Username / NISN</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Kelas / Unit</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {u.username}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'guru'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {u.class}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-md p-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Tambah Akun Pengguna Baru
                </h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Contoh: Ibu Rina S.Pd"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username / NIP / NISN
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value)}
                      placeholder="Contoh: guru_rina"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role / Peran
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="guru">Guru Pengajar / Wali Kelas</option>
                      <option value="admin">Administrator / Kepala Sekolah</option>
                      <option value="siswa">Siswa</option>
                    </select>
                  </div>

                  {newUserRole === 'siswa' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Kelas
                      </label>
                      <select
                        value={newUserClass}
                        onChange={(e) => setNewUserClass(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="Kelas 5 A">Kelas 5 A</option>
                        <option value="Kelas 5 B">Kelas 5 B</option>
                        <option value="Kelas 6 A">Kelas 6 A</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                    >
                      Simpan Pengguna
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Bank Soal Kuis */}
      {activeTab === 'kuis' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Bank Soal Kuis Karakter ({quizzes.length} Pertanyaan)
            </h3>
            <button
              onClick={() => setShowAddQuizModal(true)}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Soal Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => {
              const habit = HABITS.find((h) => h.id === q.habitId);
              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-sky-50 text-sky-700 rounded border border-sky-100">
                      {habit?.emoji} {habit?.title || q.habitId}
                    </span>
                    <button
                      onClick={() => handleDeleteQuiz(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`text-xs p-2 rounded-lg border flex items-center justify-between ${
                          oIdx === q.correctOptionIndex
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-100'
                        }`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        {oIdx === q.correctOptionIndex && (
                          <span className="text-[10px] text-emerald-600 font-bold">Jawaban Benar</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Quiz Modal */}
          {showAddQuizModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Tambah Soal Kuis Tantangan
                </h3>
                <form onSubmit={handleAddQuiz} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kaitkan dengan Kebiasaan
                    </label>
                    <select
                      value={newQuizHabitId}
                      onChange={(e) => setNewQuizHabitId(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      {HABITS.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.number}. {h.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pertanyaan Kuis
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newQuizQuestion}
                      onChange={(e) => setNewQuizQuestion(e.target.value)}
                      placeholder="Tuliskan pertanyaan kuis pembiasaan..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilihan A</label>
                      <input
                        type="text"
                        required
                        value={newQuizOptA}
                        onChange={(e) => setNewQuizOptA(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilihan B</label>
                      <input
                        type="text"
                        required
                        value={newQuizOptB}
                        onChange={(e) => setNewQuizOptB(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilihan C</label>
                      <input
                        type="text"
                        value={newQuizOptC}
                        onChange={(e) => setNewQuizOptC(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilihan D</label>
                      <input
                        type="text"
                        value={newQuizOptD}
                        onChange={(e) => setNewQuizOptD(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kunci Jawaban Benar
                    </label>
                    <select
                      value={newQuizCorrect}
                      onChange={(e) => setNewQuizCorrect(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-emerald-700"
                    >
                      <option value={0}>Pilihan A (Benar)</option>
                      <option value={1}>Pilihan B (Benar)</option>
                      <option value={2}>Pilihan C (Benar)</option>
                      <option value={3}>Pilihan D (Benar)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddQuizModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                    >
                      Simpan Kuis
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
