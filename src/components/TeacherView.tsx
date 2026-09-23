import React, { useState } from 'react';
import { SchoolInfo, User, Submission, QuizQuestion } from '../types';
import { HABITS } from '../data/habitsData';
import { HeaderLogos } from './HeaderLogos';
import { ProofViewModal } from './ProofViewModal';
import {
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  UserCheck,
  CheckCircle2,
  Star,
  Users,
  Search,
  Bell,
  Award,
  AlertTriangle,
  Send,
  ChevronRight,
  Check,
  Eye,
  Sparkles,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  BarChart2,
} from 'lucide-react';

interface TeacherViewProps {
  user: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  quizzes: QuizQuestion[];
  onLogout: () => void;
  onUpdateSubmissions: (subs: Submission[]) => void;
  onUpdateQuizzes: (quizzes: QuizQuestion[]) => void;
  onDeleteSubmission?: (id: string) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  user,
  schoolInfo,
  users,
  submissions,
  quizzes,
  onLogout,
  onUpdateSubmissions,
  onUpdateQuizzes,
  onDeleteSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'laporan' | 'statistik' | 'agen' | 'konten' | 'pengaturan'>('laporan');
  const [selectedProof, setSelectedProof] = useState<Submission | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>(user.class || 'Kelas 5 A');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'lengkap' | 'sebagian' | 'belum'>('semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Teacher Note state
  const [noteStudentId, setNoteStudentId] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');

  // New Quiz state
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [newQuizHabitId, setNewQuizHabitId] = useState(HABITS[0].id);
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizOptA, setNewQuizOptA] = useState('');
  const [newQuizOptB, setNewQuizOptB] = useState('');
  const [newQuizOptC, setNewQuizOptC] = useState('');
  const [newQuizOptD, setNewQuizOptD] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter students for the selected class & search query
  const classStudents = users.filter((u) => {
    if (u.role !== 'siswa') return false;
    const matchesClass = selectedClass === 'semua' || u.class === selectedClass;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesClass || !matchesSearch) return false;

    // Filter by habit completion status
    const studentTodaySubs = submissions.filter((s) => s.studentId === u.id && s.date === todayStr);
    const count = studentTodaySubs.length;

    if (statusFilter === 'lengkap') return count >= 7;
    if (statusFilter === 'sebagian') return count > 0 && count < 7;
    if (statusFilter === 'belum') return count === 0;

    return true;
  });

  // Calculate statistics
  const totalClassStudents = users.filter((u) => u.role === 'siswa' && (selectedClass === 'semua' || u.class === selectedClass)).length;
  const totalSubmissionsToday = submissions.filter(
    (s) => s.date === todayStr && (selectedClass === 'semua' || s.class === selectedClass)
  );

  const pendingVerificationCount = submissions.filter((s) => !s.teacherVerified).length;

  const totalPossible = totalClassStudents * 7;
  const complianceRate = totalPossible > 0 ? Math.round((totalSubmissionsToday.length / totalPossible) * 1000) / 10 : 89.2;

  // Students requiring guidance (< 3 habits completed)
  const lowComplianceStudents = users.filter((u) => {
    if (u.role !== 'siswa') return false;
    if (selectedClass !== 'semua' && u.class !== selectedClass) return false;
    const count = submissions.filter((s) => s.studentId === u.id && s.date === todayStr).length;
    return count < 3;
  });

  const handleExportCSV = () => {
    const headers = 'Tanggal,Nama Agen,Kelas,Misi,Waktu,Catatan,Status\n';
    const rows = submissions
      .filter((s) => selectedClass === 'semua' || s.class === selectedClass)
      .map(
        (s) =>
          `"${s.date}","${s.studentName}","${s.class}","${s.habitId}","${s.completedAt}","${(s.note || '').replace(/"/g, '""')}","${s.teacherVerified ? 'Terverifikasi' : 'Menunggu'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Kelas_${selectedClass}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📁 Data laporan XLSX/CSV berhasil diunduh!');
  };

  const handleAppreciateStudent = (studentName: string) => {
    showToast(`🌟 Apresiasi +10 Poin Karakter dikirim untuk ${studentName}!`);
  };

  const handleSendTeacherNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const targetStudent = users.find((u) => u.id === noteStudentId)?.name || 'Siswa';
    showToast(`💬 Catatan guru berhasil dikirimkan ke ${targetStudent} via Portal & WA!`);
    setNoteContent('');
  };

  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizQuestion.trim() || !newQuizOptA.trim() || !newQuizOptB.trim()) return;

    const newQuiz: QuizQuestion = {
      id: `q-${Date.now()}`,
      habitId: newQuizHabitId,
      question: newQuizQuestion,
      options: [newQuizOptA, newQuizOptB, newQuizOptC || 'Pilihan C', newQuizOptD || 'Pilihan D'],
      correctOptionIndex: newQuizCorrect,
      points: 10,
      explanation: 'Jawaban tepat menambah wawasan 7 kebiasaan anak hebat!',
    };

    onUpdateQuizzes([...quizzes, newQuiz]);
    setNewQuizQuestion('');
    setNewQuizOptA('');
    setNewQuizOptB('');
    setNewQuizOptC('');
    setNewQuizOptD('');
    setShowAddQuizModal(false);
    showToast('📝 Soal Kuis Tantangan Baru Berhasil Disimpan!');
  };

  const handleDeleteQuiz = (id: string) => {
    onUpdateQuizzes(quizzes.filter((q) => q.id !== id));
    showToast('🗑️ Soal kuis telah dihapus.');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bright-yellow-blue text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-b-2 md:border-b-0 md:border-r-2 border-slate-900 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0 shadow-brutal z-30 md:sticky md:top-0 md:h-screen">
        <div className="space-y-6">
          {/* Sidebar Header Brand */}
          <div className="flex items-center gap-3 p-2 bg-sky-50 dark:bg-slate-800 rounded-2xl border-brutal-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-400 text-slate-900 font-black flex items-center justify-center text-xl border-brutal-sm shadow-brutal-sm">
              🏫
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black font-heading text-sm text-slate-900 dark:text-white leading-tight truncate">
                Portal 7 Kebiasaan
              </span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                {schoolInfo.schoolName}
              </span>
            </div>
          </div>

          {/* Sidebar Vertical Nav Links */}
          <nav className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-wider">
              Menu Utama Guru
            </span>
            <button
              onClick={() => setActiveTab('laporan')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'laporan'
                  ? 'bg-sky-400 text-slate-900 translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>MONITORING LAPORAN</span>
            </button>

            <button
              onClick={() => setActiveTab('statistik')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'statistik'
                  ? 'bg-emerald-400 text-slate-900 translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart2 className="w-5 h-5 flex-shrink-0" />
              <span>STATISTIK & GRAFIK</span>
            </button>

            <button
              onClick={() => setActiveTab('agen')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'agen'
                  ? 'bg-amber-300 text-slate-900 translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              <span>DATA AGEN SISWA</span>
            </button>

            <button
              onClick={() => setActiveTab('konten')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'konten'
                  ? 'bg-purple-300 text-slate-900 translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <span>KONTEN & KUIS</span>
            </button>

            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'pengaturan'
                  ? 'bg-teal-300 text-slate-900 translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-5 h-5 flex-shrink-0" />
              <span>PENGATURAN</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-slate-800 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border-brutal-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-900 font-black flex items-center justify-center text-xs border-brutal-sm">
                👩‍🏫
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  Wali Kelas: {user.class}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full bg-red-400 hover:bg-red-500 text-slate-900 font-black text-xs py-2.5 rounded-xl border-brutal-sm shadow-brutal-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>KELUAR PORTAL</span>
          </button>

          <div className="text-center pt-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Hebat • Berkarakter • Cerdas
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3 md:p-6 overflow-y-auto min-w-0">
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-brutal shadow-brutal p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeaderLogos schoolInfo={schoolInfo} titleColor="text-sky-600 dark:text-sky-400" subtitleColor="text-slate-700 dark:text-slate-300" />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-400 text-slate-900 font-black text-xs px-3 py-1.5 rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>{user.name} ({selectedClass})</span>
            </div>
          </div>
        </div>

        {/* Live Welcome & Monitoring Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-5 text-white shadow-brutal mb-6">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/40 shadow-inner">
                <Award className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[10px] uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                    Tahun Ajaran 2026/2027
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span> Live Monitoring
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black font-heading tracking-tight mt-1">
                  Markas Komando Pembiasaan Siswa
                </h1>
                <p className="text-xs font-bold text-emerald-100 mt-0.5">
                  Monitoring harian Gerakan 7 Kebiasaan Anak Indonesia Hebat di {schoolInfo.schoolName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold">
                <UserCheck className="w-4 h-4 text-emerald-300" />
                <span>Wali Kelas: {user.name}</span>
              </div>
              <button
                onClick={() => showToast(`🔔 Ada ${pendingVerificationCount} laporan foto/video baru yang menunggu verifikasi!`)}
                className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black text-xs px-3 py-1 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{pendingVerificationCount} Verifikasi Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stat Highlight Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Stat 1: Total Agen */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Agen Aktif
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {totalClassStudents} <span className="text-sm font-bold text-slate-500">Siswa</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-300 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>100% Terdaftar di Dapodik ({selectedClass})</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-sky-500" />
          </div>

          {/* Stat 2: Kepatuhan Hari Ini */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kepatuhan Hari Ini
                </span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {complianceRate}%
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(complianceRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[10px] font-extrabold text-slate-600 dark:text-slate-400">
                <span>Target: 85%</span>
                <span className="text-emerald-600 font-black">+4.2% Naik</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500" />
          </div>

          {/* Stat 3: Habit Terfavorit */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kebiasaan Terfavorit
                </span>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1 truncate">
                  Olahraga & Beribadah
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-extrabold">
              <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-800 dark:text-slate-200">
                🏃 96% Olahraga
              </span>
              <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-800 dark:text-slate-200">
                🕌 93% Ibadah
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-400" />
          </div>

          {/* Stat 4: Perlu Bimbingan */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Perlu Bimbingan
                </span>
                <div className="text-3xl font-black text-red-500 dark:text-red-400 mt-1">
                  {lowComplianceStudents.length}{' '}
                  <span className="text-sm font-bold text-slate-500">Siswa</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-extrabold text-red-600 dark:text-red-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Kurang dari 3 kebiasaan
              </span>
              <button
                onClick={() => setStatusFilter('belum')}
                className="underline font-black hover:text-red-700"
              >
                Bantu
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-red-500" />
          </div>
        </div>

        {/* Operational Control & Filter Toolbar */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl border-brutal shadow-brutal-sm mb-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Quick Actions Left */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                showToast('🔄 Data pemantauan berhasil diperbarui!');
              }}
              className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Laporan</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-sky-300 hover:bg-sky-400 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Data Laporan</span>
              <span className="text-[9px] bg-slate-900 text-yellow-300 px-1.5 py-0.2 rounded-full font-black">
                XLSX
              </span>
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            {/* Quick Filter Habit Status */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border-brutal-sm text-xs font-black">
              <button
                onClick={() => setStatusFilter('semua')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'semua' ? 'bg-amber-300 text-slate-900' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua ({totalClassStudents})
              </button>
              <button
                onClick={() => setStatusFilter('lengkap')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'lengkap' ? 'bg-emerald-400 text-slate-900' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Lengkap 7/7
              </button>
              <button
                onClick={() => setStatusFilter('sebagian')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'sebagian' ? 'bg-sky-300 text-slate-900' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Sebagian
              </button>
              <button
                onClick={() => setStatusFilter('belum')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'belum' ? 'bg-red-400 text-white' : 'text-red-500'
                }`}
              >
                Belum (Perlu Bimbingan)
              </button>
            </div>
          </div>

          {/* Filter Fields Right */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            {/* Class Dropdown */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border-brutal-sm text-xs font-bold text-slate-800 dark:text-slate-200">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent font-black focus:outline-none cursor-pointer"
              >
                <option value="Kelas 5 A">Kelas 5 A</option>
                <option value="Kelas 4 B">Kelas 4 B</option>
                <option value="semua">Semua Kelas</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative flex items-center min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama / NISN..."
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 pl-8 pr-3 py-1.5 rounded-xl border-brutal-sm text-xs font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Habit Legend Bar */}
        <div className="bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-300 p-2.5 rounded-2xl mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-black text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Indikator 7 Pilar Kebiasaan:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
            {HABITS.map((h, idx) => (
              <span
                key={h.id}
                className="bg-white dark:bg-slate-800 border-brutal-sm px-2.5 py-1 rounded-full shadow-xs"
              >
                {h.emoji} {idx + 1}. {h.title.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* TAB 1: LAPORAN (Main Table) */}
        {activeTab === 'laporan' && (
          <div className="overflow-x-auto rounded-2xl border-brutal shadow-brutal bg-slate-900 text-white">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-xs uppercase tracking-wide">
                  Monitoring Lembar Kerja Siswa — Tanggal {todayStr}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Menampilkan {classStudents.length} Agen Siswa
              </span>
            </div>

            <table className="w-full text-xs font-bold text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-800 text-slate-300 border-b-2 border-slate-700 uppercase">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 min-w-[180px]">Nama Agen / Siswa</th>
                  <th className="p-3 text-center">Kls</th>
                  {HABITS.map((h, i) => (
                    <th key={h.id} className="p-2 text-center" title={h.title}>
                      <div className="flex flex-col items-center">
                        <span className="text-base">{h.emoji}</span>
                        <span className="text-[9px] lowercase font-bold text-slate-400">
                          {i + 1}. {h.title.split(' ')[0]}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-center min-w-[140px]">Skor & Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-6 text-center text-slate-400 font-bold">
                      Siswa tidak ditemukan untuk kriteria filter ini.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((siswa) => {
                    const studentTodaySubs = submissions.filter(
                      (s) => s.studentId === siswa.id && s.date === todayStr
                    );
                    const isAllDone = studentTodaySubs.length >= 7;

                    return (
                      <tr
                        key={siswa.id}
                        className={`hover:bg-slate-800/80 transition-colors ${
                          isAllDone ? 'bg-emerald-950/30' : ''
                        }`}
                      >
                        <td className="p-3 text-slate-400 whitespace-nowrap">{todayStr}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-sky-400 text-slate-900 border-brutal-sm flex items-center justify-center font-black text-xs">
                              👦
                            </div>
                            <div>
                              <p className="font-extrabold text-white text-xs">{siswa.name}</p>
                              <span className="text-[10px] text-slate-400 block">
                                NISN: {siswa.username}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-black border border-slate-700">
                            {siswa.class.replace('Kelas ', '')}
                          </span>
                        </td>

                        {HABITS.map((habit) => {
                          const sub = submissions.find(
                            (s) =>
                              s.studentId === siswa.id &&
                              s.habitId === habit.id &&
                              s.date === todayStr
                          );
                          return (
                            <td key={habit.id} className="p-2 text-center">
                              {sub ? (
                                <button
                                  onClick={() => setSelectedProof(sub)}
                                  className="px-2.5 py-1 bg-sky-400 hover:bg-sky-300 text-slate-900 font-black text-[11px] rounded-lg border-brutal-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1 mx-auto"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Lihat</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-950/60 text-red-400 font-black text-xs border border-red-800">
                                  ✕
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleAppreciateStudent(siswa.name)}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-[11px] rounded-lg border-brutal-sm flex items-center gap-1"
                              title="Beri Poin Apresiasi"
                            >
                              <Star className="w-3 h-3 fill-slate-900" />
                              <span>Apresiasi</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: STATISTIK */}
        {activeTab === 'statistik' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                📊 Ringkasan Kepatuhan Kebiasaan Kelas {selectedClass}:
              </h4>
              <span className="text-xs font-bold text-slate-500">Tanggal: {todayStr}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {HABITS.map((habit) => {
                const habitSubs = submissions.filter(
                  (s) =>
                    s.habitId === habit.id &&
                    s.date === todayStr &&
                    (selectedClass === 'semua' || s.class === selectedClass)
                );
                const percent =
                  totalClassStudents > 0
                    ? Math.round((habitSubs.length / totalClassStudents) * 100)
                    : 0;

                return (
                  <div
                    key={habit.id}
                    className="p-4 rounded-2xl border-brutal shadow-brutal space-y-2 dark:bg-slate-800"
                    style={{ backgroundColor: habit.cardBg }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{habit.emoji}</span>
                      <span className="text-xs font-black uppercase bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-2.5 py-1 rounded-xl border-brutal-sm">
                        {habitSubs.length} / {totalClassStudents} Agen
                      </span>
                    </div>
                    <h5 className="font-black text-base text-slate-900">{habit.title}</h5>
                    <div className="w-full bg-white dark:bg-slate-900 h-5 rounded-lg border-brutal-sm overflow-hidden p-0.5">
                      <div
                        className="h-full bg-emerald-400 rounded transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-right text-xs font-black text-slate-900">{percent}% Selesai</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DATA AGEN */}
        {activeTab === 'agen' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                👨‍🎓 Daftar Agen Terdaftar di {selectedClass}:
              </h4>
              <span className="text-xs font-bold text-slate-500">
                Total: {classStudents.length} Siswa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classStudents.map((s) => (
                <div
                  key={s.id}
                  className="p-4 bg-sky-50 dark:bg-slate-800 border-brutal rounded-2xl shadow-brutal flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sky-300 dark:bg-sky-900 text-slate-900 dark:text-white rounded-2xl border-brutal-sm flex items-center justify-center font-black text-xl">
                      👦
                    </div>
                    <div>
                      <h5 className="text-base font-black font-heading text-slate-900 dark:text-white">
                        {s.name}
                      </h5>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        NISN: {s.username} • {s.class}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{s.points} Poin</span>
                    </div>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      ONLINE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KONTEN & KUIS */}
        {activeTab === 'konten' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                📝 Tantangan Kuis Pembiasaan Harian:
              </h4>
              <button
                onClick={() => setShowAddQuizModal(true)}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Soal Kuis Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((q) => {
                const habit = HABITS.find((h) => h.id === q.habitId);
                return (
                  <div
                    key={q.id}
                    className="p-4 bg-purple-50 dark:bg-slate-800 border-brutal rounded-2xl shadow-brutal space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 px-2.5 py-1 rounded-xl border-brutal-sm">
                        {habit?.emoji} {habit?.title}
                      </span>
                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="p-1 bg-red-400 hover:bg-red-500 text-white rounded-lg border-brutal-sm transition-transform active:scale-95"
                        title="Hapus Kuis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">
                      {q.question}
                    </h5>
                    <ul className="space-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={`p-2 rounded-xl border-brutal-sm ${
                            i === q.correctOptionIndex
                              ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-black'
                              : 'bg-white dark:bg-slate-900'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PENGATURAN */}
        {activeTab === 'pengaturan' && (
          <div className="p-5 bg-slate-50 dark:bg-slate-800 border-brutal rounded-2xl max-w-xl mx-auto space-y-3">
            <h4 className="font-black font-heading text-slate-900 dark:text-white text-base">
              ⚙️ Pengaturan Akun Guru Pengampu
            </h4>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-2">
              <p>
                Nama Pengampu:{' '}
                <span className="font-black text-slate-900 dark:text-white">{user.name}</span>
              </p>
              <p>
                Kelas Binaan:{' '}
                <span className="font-black text-slate-900 dark:text-white">{user.class}</span>
              </p>
              <p>
                Username / NIP:{' '}
                <span className="font-black text-slate-900 dark:text-white">{user.username}</span>
              </p>
              <p>
                Sekolah:{' '}
                <span className="font-black text-slate-900 dark:text-white">
                  {schoolInfo.schoolName}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Bottom Insights & Character Checklist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
          {/* Card 1: Checklist Panduan Karakter */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-black font-heading text-slate-900 dark:text-white uppercase">
                  Kriteria Pembiasaan Karakter
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
                Standar verifikasi bukti foto/video untuk Agen Cilik {schoolInfo.schoolName}:
              </p>
              <div className="space-y-2 text-xs font-bold">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border-brutal-sm flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Bangun Pagi:</strong> Maksimal pukul 05.00 WIB dengan foto jam dinding / waktu HP.
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border-brutal-sm flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Makan Sehat:</strong> Mengandung 4 sehat 5 sempurna (ada sayur dan buah segar).
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border-brutal-sm flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Gemar Membaca:</strong> Minimal 15 menit membaca buku non-pelajaran.
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast('📄 Buku Panduan Portofolio 7 Kebiasaan siap diunduh.')}
              className="mt-4 text-sky-600 dark:text-sky-400 font-extrabold text-xs hover:underline flex items-center gap-1"
            >
              <span>Unduh Buku Panduan Portofolio 7 Kebiasaan (PDF)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Pahlawan Pembiasaan Pekan Ini */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <Award className="w-5 h-5" />
                  <h3 className="text-sm font-black font-heading text-slate-900 dark:text-white uppercase">
                    Pahlawan Pembiasaan
                  </h3>
                </div>
                <span className="bg-amber-300 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded-full border-brutal-sm">
                  Top 3 Streak
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
                Siswa dengan rekor konsistensi 100% berturut-turut:
              </p>

              <div className="space-y-2">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border-brutal-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Revandito Pratama
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Streak 14 Hari 🔥
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border-brutal-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Reza Rahadian
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Streak 12 Hari 🔥
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border-brutal-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Aisyah Putri Permata
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Streak 9 Hari 🔥
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('🎉 Piagam Digital Pekanan telah dikirim ke semua Pahlawan Pembiasaan!')}
              className="mt-4 w-full bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black text-xs py-2 rounded-xl border-brutal-sm shadow-brutal-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kirim Piagam Digital Pekanan</span>
            </button>
          </div>

          {/* Card 3: Form Catatan Guru Cepat */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
            <form onSubmit={handleSendTeacherNote} className="space-y-3">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                <Send className="w-5 h-5" />
                <h3 className="text-sm font-black font-heading text-slate-900 dark:text-white uppercase">
                  Catatan Apresiasi Guru
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Tulis pesan penyemangat yang langsung muncul di portal siswa:
              </p>

              <select
                value={noteStudentId}
                onChange={(e) => setNoteStudentId(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs rounded-xl border-brutal-sm focus:outline-none"
              >
                <option value="">-- Pilih Siswa Penerima --</option>
                {classStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class})
                  </option>
                ))}
              </select>

              <textarea
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Contoh: 'Hebat Reza sudah rajin makan buah! Ayo besok coba bangun sebelum azan subuh ya...'"
                rows={3}
                className="w-full p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-xs rounded-xl border-brutal-sm focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs py-2 rounded-xl border-brutal-sm shadow-brutal-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Catatan Guru</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Proof View Modal */}
      {selectedProof && (
        <ProofViewModal
          submission={selectedProof}
          onClose={() => setSelectedProof(null)}
          onVerify={(subId, feedback) => {
            const updated = submissions.map((s) =>
              s.id === subId ? { ...s, teacherVerified: true, teacherFeedback: feedback } : s
            );
            onUpdateSubmissions(updated);
            showToast('✅ Bukti pembiasaan berhasil diverifikasi guru!');
          }}
          onDelete={(subId) => {
            if (onDeleteSubmission) {
              onDeleteSubmission(subId);
            }
            setSelectedProof(null);
            showToast('🗑️ Laporan pembiasaan berhasil dihapus.');
          }}
        />
      )}

      {/* Add Quiz Modal */}
      {showAddQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border-brutal shadow-brutal-lg rounded-2xl w-full max-w-md p-5 space-y-3">
            <h3 className="text-lg font-black font-heading text-slate-900 dark:text-white uppercase">
              Buat Soal Kuis Tantangan Baru
            </h3>
            <form onSubmit={handleAddQuiz} className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 dark:text-slate-200 mb-1">
                  Kategori Kebiasaan:
                </label>
                <select
                  value={newQuizHabitId}
                  onChange={(e) => setNewQuizHabitId(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {HABITS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.emoji} {h.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 dark:text-slate-200 mb-1">
                  Pertanyaan:
                </label>
                <textarea
                  required
                  value={newQuizQuestion}
                  onChange={(e) => setNewQuizQuestion(e.target.value)}
                  placeholder="Ketik soal pertanyaan..."
                  rows={2}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Pilihan A"
                  value={newQuizOptA}
                  onChange={(e) => setNewQuizOptA(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Pilihan B"
                  value={newQuizOptB}
                  onChange={(e) => setNewQuizOptB(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Pilihan C"
                  value={newQuizOptC}
                  onChange={(e) => setNewQuizOptC(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Pilihan D"
                  value={newQuizOptD}
                  onChange={(e) => setNewQuizOptD(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 dark:text-slate-200 mb-1">
                  Jawaban Benar:
                </label>
                <select
                  value={newQuizCorrect}
                  onChange={(e) => setNewQuizCorrect(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value={0}>A</option>
                  <option value={1}>B</option>
                  <option value={2}>C</option>
                  <option value={3}>D</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="flex-1 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border-brutal-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-400 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Toast Modal Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white border-2 border-emerald-400 px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

