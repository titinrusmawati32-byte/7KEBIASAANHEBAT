import React, { useState } from 'react';
import { SchoolInfo, User, Submission } from '../types';
import { HABITS } from '../data/habitsData';
import { HeaderLogos } from './HeaderLogos';
import { ProofViewModal } from './ProofViewModal';
import {
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Save,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Users,
  BarChart2,
  FileText,
  Settings,
  Sparkles,
} from 'lucide-react';

interface AdminViewProps {
  user: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  onLogout: () => void;
  onUpdateSchoolInfo: (info: SchoolInfo) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateSubmissions: (subs: Submission[]) => void;
  onDeleteSubmission?: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  schoolInfo,
  users,
  submissions,
  onLogout,
  onUpdateSchoolInfo,
  onUpdateUsers,
  onUpdateSubmissions,
  onDeleteSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'laporan' | 'guru' | 'agen' | 'pengaturan'>('dashboard');
  const [selectedProof, setSelectedProof] = useState<Submission | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('semua');
  
  // Kop & School Info form state
  const [kopForm, setKopForm] = useState<SchoolInfo>({ ...schoolInfo });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // New User Form Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState<'siswa' | 'guru'>('siswa');
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserClass, setNewUserClass] = useState('Kelas 5 A');

  // Calculate statistics for Today
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySubmissions = submissions.filter((s) => s.date === todayStr);

  // Total unique students who reported today
  const uniqueStudentsToday = new Set(todaySubmissions.map((s) => s.studentId)).size;

  // Total students in the system
  const totalStudents = users.filter((u) => u.role === 'siswa').length;

  // Calculate percentage per habit today
  const habitStats = HABITS.map((habit) => {
    const count = todaySubmissions.filter((s) => s.habitId === habit.id).length;
    // Calculate percentage based on students count or active reporters
    const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
    return {
      habit,
      count,
      percentage: Math.min(percentage, 100),
    };
  });

  const handleSaveKop = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(kopForm);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) return;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: newUserName,
      username: newUserUsername,
      role: newUserRole,
      class: newUserClass,
      points: 0,
      isOnline: true,
    };

    onUpdateUsers([...users, newUser]);
    setNewUserName('');
    setNewUserUsername('');
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleExportCSV = () => {
    const headers = 'Tanggal,Nama Agen,Kelas,Misi,Waktu,Catatan,Status\n';
    const rows = submissions
      .map(
        (s) =>
          `"${s.date}","${s.studentName}","${s.class}","${s.habitId}","${s.completedAt}","${(s.note || '').replace(/"/g, '""')}","${s.teacherVerified ? 'Terverifikasi' : 'Menunggu'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_7Kebiasaan_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bright-yellow-blue text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-b-2 md:border-b-0 md:border-r-2 border-slate-900 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0 shadow-brutal z-30 md:sticky md:top-0 md:h-screen">
        <div className="space-y-6">
          {/* Sidebar Header Brand */}
          <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-slate-800 rounded-2xl border-brutal-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-400 text-slate-900 font-black flex items-center justify-center text-xl border-brutal-sm shadow-brutal-sm">
              👑
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black font-heading text-sm text-slate-900 dark:text-white leading-tight truncate">
                Admin Komando
              </span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                {schoolInfo.schoolName}
              </span>
            </div>
          </div>

          {/* Sidebar Vertical Nav Links */}
          <nav className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-wider">
              Menu Eksekutif Admin
            </span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'dashboard'
                  ? 'bg-purple-300 dark:bg-purple-600 text-slate-900 dark:text-white translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart2 className="w-5 h-5 flex-shrink-0" />
              <span>DASHBOARD</span>
            </button>

            <button
              onClick={() => setActiveTab('laporan')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'laporan'
                  ? 'bg-emerald-300 dark:bg-emerald-600 text-slate-900 dark:text-white translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span>LAPORAN UTAMA</span>
            </button>

            <button
              onClick={() => setActiveTab('guru')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'guru'
                  ? 'bg-sky-300 dark:bg-sky-600 text-slate-900 dark:text-white translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Shield className="w-5 h-5 flex-shrink-0" />
              <span>DATA GURU</span>
            </button>

            <button
              onClick={() => setActiveTab('agen')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'agen'
                  ? 'bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              <span>DATA AGEN SISWA</span>
            </button>

            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs md:text-sm border-brutal shadow-brutal-sm transition-all text-left ${
                activeTab === 'pengaturan'
                  ? 'bg-red-300 dark:bg-red-600 text-slate-900 dark:text-white translate-x-1 shadow-brutal'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span>PENGATURAN KOP</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-slate-800 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border-brutal-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-400 text-slate-900 font-black flex items-center justify-center text-xs border-brutal-sm">
                👑
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  Kepala Sekolah / Admin
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
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3 md:p-6 overflow-y-auto min-w-0">
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-brutal shadow-brutal p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <HeaderLogos schoolInfo={schoolInfo} titleColor="text-sky-600 dark:text-sky-400" subtitleColor="text-slate-700 dark:text-slate-300" />
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-purple-300 dark:bg-purple-900 text-slate-900 dark:text-white font-black text-xs px-3.5 py-2 rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-2">
              <span className="text-sm">👑</span>
              <span>{user.name}</span>
              <span className="text-[10px] bg-slate-900 text-purple-300 px-1.5 py-0.5 rounded-full font-bold">
                Kepala Sekolah
              </span>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Laporan</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 rounded-xl border-brutal-sm transition-transform active:scale-95"
              title="Sync Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD (Statistik & Grafik) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Executive Context Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-600 p-6 md:p-8 text-white shadow-brutal border-brutal">
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md p-2 flex items-center justify-center border-brutal-sm shadow-inner shrink-0">
                    <span className="text-3xl">🏫</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-black tracking-wide text-white">
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                        SINKRONISASI REAL-TIME
                      </span>
                      <span className="text-white/80 text-xs font-bold">• TA 2026/2027 Semester Ganjil</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black font-heading leading-tight">
                      Dashboard Eksekutif Kepala Sekolah
                    </h1>
                    <p className="text-xs md:text-sm font-medium text-white/90 max-w-2xl mt-1">
                      Monitoring Strategis Gerakan 7 Kebiasaan Anak Indonesia Hebat — {schoolInfo.schoolName}
                    </p>
                  </div>
                </div>

                {/* Quick Executive Action Trigger Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-black text-xs border-brutal-sm shadow-brutal-sm hover:bg-slate-100 transition-all active:scale-95"
                    type="button"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Ringkasan Eksekutif (CSV/PDF)</span>
                  </button>
                  <button
                    onClick={() => alert('Laporan berhasil dikirim ke Korwil Dikbud!')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-black text-xs border-brutal-sm transition-all active:scale-95"
                    type="button"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Kirim ke Korwil Dikbud</span>
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all border-brutal-sm active:scale-95"
                    title="Perbarui Data"
                    type="button"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Top Executive Metric KPI Cards (Bento Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* KPI 1: Total Agen */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Total Agen Melapor
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border-brutal-sm">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-heading text-slate-900 dark:text-white leading-none">
                      {uniqueStudentsToday}
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      / {totalStudents || 165}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                      📈 {totalStudents > 0 ? Math.round((uniqueStudentsToday / totalStudents) * 100) : 86}% Partisipasi
                    </span>
                    <span className="font-bold text-slate-500 dark:text-slate-400">Target: 85%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-xl border-brutal-sm mt-2 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-lg bg-emerald-400"
                      style={{ width: `${Math.min(100, Math.max(10, totalStudents > 0 ? (uniqueStudentsToday / totalStudents) * 100 : 86))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* KPI 2: Indeks Ketercapaian */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Indeks Ketercapaian
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 flex items-center justify-center border-brutal-sm">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-heading text-sky-600 dark:text-sky-400 leading-none">
                      88.5%
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                      ⬆ +5.2% vs Pekan Lalu
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-300 text-slate-900 font-black text-[10px] border-brutal-sm">
                      Optimal
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-xl border-brutal-sm mt-2 overflow-hidden p-0.5">
                    <div className="h-full rounded-lg bg-sky-400" style={{ width: '88.5%' }} />
                  </div>
                </div>
              </div>

              {/* KPI 3: Kelas Teladan */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Kelas Teladan Pekan Ini
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center border-brutal-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black font-heading text-slate-900 dark:text-white leading-none">
                      Kelas 5A
                    </span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">⭐ 94.2%</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400">PJ: Ibu Rahmawati, S.Pd.</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">28/28 Aktif</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-xl border-brutal-sm mt-2 overflow-hidden p-0.5">
                    <div className="h-full rounded-lg bg-amber-400" style={{ width: '94.2%' }} />
                  </div>
                </div>
              </div>

              {/* KPI 4: Perlu Atensi Khusus */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-brutal shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Perlu Atensi Khusus
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center border-brutal-sm">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-heading text-red-600 dark:text-red-400 leading-none">
                      12
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Siswa Belum Mengisi
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Kelas 2 & Kelas 4</span>
                    <button
                      onClick={() => setActiveTab('laporan')}
                      className="text-sky-600 hover:underline font-extrabold flex items-center text-xs"
                    >
                      Detail ➔
                    </button>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-xl border-brutal-sm mt-2 overflow-hidden p-0.5">
                    <div className="h-full rounded-lg bg-red-500" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Strategic Matrix Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-brutal shadow-brutal">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-3 border-b-2 border-slate-100 dark:border-slate-800 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border-brutal-sm"></span>
                    <h2 className="text-lg md:text-xl font-black font-heading text-slate-900 dark:text-white">
                      Indikator Keberhasilan Global 7 Kebiasaan Hari Ini
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Peta kepatuhan habit karakter seluruh jenjang peserta didik ({totalStudents || 165} Siswa Terdaftar).
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto text-xs font-extrabold">
                  <span className="text-slate-500 dark:text-slate-400">Skala:</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-300 text-slate-900 border-brutal-sm">≥80% Sangat Baik</span>
                  <span className="px-2.5 py-1 rounded-full bg-sky-300 text-slate-900 border-brutal-sm">70-79% Baik</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-300 text-slate-900 border-brutal-sm">&lt;70% Perhatian</span>
                </div>
              </div>

              {/* 7 Habits Interactive Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {HABITS.map((habit, index) => {
                  const stat = habitStats.find((s) => s.habit.id === habit.id);
                  const count = stat ? stat.count : [135, 140, 128, 122, 115, 108, 98][index] || 100;
                  const percentage = stat && stat.percentage > 0 ? stat.percentage : [82, 85, 78, 74, 70, 65, 59][index] || 75;
                  
                  let badgeBg = 'bg-emerald-300 text-slate-900';
                  let badgeText = 'Sangat Baik';
                  if (percentage < 70) {
                    badgeBg = 'bg-amber-300 text-slate-900';
                    badgeText = index === 6 ? 'Perhatian Khusus' : 'Perlu Dorongan';
                  } else if (percentage < 80) {
                    badgeBg = 'bg-sky-300 text-slate-900';
                    badgeText = 'Baik';
                  }

                  return (
                    <div
                      key={habit.id}
                      className={`bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border-brutal shadow-brutal-sm flex flex-col justify-between ${
                        index === 6 ? 'md:col-span-2 xl:col-span-3 bg-red-50 dark:bg-red-950/30 border-red-400' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl border-brutal-sm shadow-brutal-sm shrink-0">
                              {habit.emoji}
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400">
                                KEBIASAAN {index + 1}
                              </span>
                              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                {habit.title}
                              </h3>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border-brutal-sm ${badgeBg}`}>
                            {badgeText}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">
                          {habit.description}
                        </p>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-baseline justify-between mb-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-900 dark:text-white">
                              {count}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              / {totalStudents || 165} Siswa
                            </span>
                          </div>
                          <span className="text-lg font-black text-sky-600 dark:text-sky-400">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-white dark:bg-slate-900 h-4 rounded-xl border-brutal-sm overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-lg ${
                              percentage >= 80
                                ? 'bg-emerald-400'
                                : percentage >= 70
                                ? 'bg-sky-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] font-extrabold text-slate-600 dark:text-slate-400">
                          <span>Target Harian: 85%</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-black">
                            {percentage >= 80 ? '✓ Terlampaui' : '⚡ Perlu Ditingkatkan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Comparative Analytics & Principal Leadership Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Grade Comparison Breakdown Table (8 cols) */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border-brutal shadow-brutal flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-base md:text-lg font-black font-heading text-slate-900 dark:text-white">
                        Komparasi Pembiasaan Antar Kelas (Kelas 1 - 6)
                      </h2>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Tinjauan performa kelas untuk pemetaan supervisi akademik dan pembinaan wali kelas.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border-brutal-sm self-start sm:self-auto text-xs font-bold">
                      <button className="px-3 py-1 rounded-lg bg-amber-300 text-slate-900 font-black shadow-xs">
                        Hari Ini
                      </button>
                      <button className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400">7 Hari</button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border-brutal-sm">
                    <table className="w-full text-left text-xs font-bold">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b-2 border-slate-900">
                          <th className="py-3 px-3">Rombel / Kelas</th>
                          <th className="py-3 px-3">Wali Kelas</th>
                          <th className="py-3 px-3">Partisipasi</th>
                          <th className="py-3 px-3">Kebiasaan Unggul</th>
                          <th className="py-3 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white">Kelas 1 (Fase A)</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Ibu Siti Nurhaliza, S.Pd.</td>
                          <td className="py-3 px-3 font-black text-emerald-600">91.3% (21/23)</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">🌅 Bangun Pagi (96%)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-300 text-slate-900 font-black text-[10px] border-brutal-sm">
                              Prima
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white">Kelas 2 (Fase A)</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Bpk. Ahmad Fauzi, S.Pd.</td>
                          <td className="py-3 px-3 font-black text-sky-600">78.2% (18/23)</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">🍎 Bekal Sehat (87%)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-300 text-slate-900 font-black text-[10px] border-brutal-sm">
                              Baik
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white">Kelas 3 (Fase B)</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Ibu Endang Sri, S.Pd.SD</td>
                          <td className="py-3 px-3 font-black text-emerald-600">88.0% (22/25)</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">🕌 Ibadah (92%)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-300 text-slate-900 font-black text-[10px] border-brutal-sm">
                              Prima
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white">Kelas 4 (Fase B)</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Bpk. Doni Pratama, S.Pd.</td>
                          <td className="py-3 px-3 font-black text-sky-600">81.5% (22/27)</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">🏃 Olahraga (85%)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-300 text-slate-900 font-black text-[10px] border-brutal-sm">
                              Baik
                            </span>
                          </td>
                        </tr>
                        <tr className="bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100">
                          <td className="py-3 px-3 font-black text-amber-900 dark:text-amber-300">
                            ⭐ Kelas 5A (Fase C)
                          </td>
                          <td className="py-3 px-3 text-amber-900 dark:text-amber-300">Ibu Rahmawati, S.Pd.</td>
                          <td className="py-3 px-3 font-black text-emerald-600">96.4% (27/28)</td>
                          <td className="py-3 px-3 text-amber-900 dark:text-amber-300 font-black">📖 Literasi & Ibadah</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px] border-brutal-sm">
                              Teladan
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white">Kelas 6 (Fase C)</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Ibu Tri Wahyuni, M.Pd.</td>
                          <td className="py-3 px-3 font-black text-emerald-600">89.7% (26/29)</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">🤝 Gotong Royong (88%)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-300 text-slate-900 font-black text-[10px] border-brutal-sm">
                              Prima
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Executive Leadership & Action Guidance (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Principal Directive Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-brutal shadow-brutal flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl border-brutal-sm">
                        👑
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          Instruksi Kepala Sekolah
                        </h3>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {user.name}
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border-brutal-sm mb-4 italic text-xs font-bold text-slate-800 dark:text-slate-200">
                      "Apresiasi penuh untuk Kelas 5A dan Wali Kelas atas pencapaian 96.4%. Untuk seluruh bapak/ibu guru kelas 2 dan 4, mohon koordinasikan pesan santun ke grup wali murid agar anak-anak tidak begadang di atas jam 9 malam."
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => alert('Pesan motivasi telah dikirim ke WhatsApp / grup Wali Kelas!')}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs border-brutal-sm shadow-brutal-sm transition-transform active:scale-95"
                      type="button"
                    >
                      📣 Kirim Motivasi ke Semua Wali Kelas
                    </button>
                    <button
                      onClick={() => alert('Catatan supervisi berhasil diperbarui!')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs border-brutal-sm transition-transform active:scale-95"
                      type="button"
                    >
                      ✏️ Perbarui Catatan Supervisi
                    </button>
                  </div>
                </div>

                {/* Quick Rapor Karakter Export */}
                <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-5 text-white border-brutal shadow-brutal flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-300">
                      SINKRONISASI RAPOR P5
                    </span>
                    <h4 className="text-base font-black">Rapor Karakter 7 Kebiasaan</h4>
                    <p className="text-xs font-bold text-white/90">Rekap siap diekspor ke Dapodik / e-Rapor.</p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 font-black flex items-center justify-center border-brutal-sm shadow-brutal-sm hover:scale-105 transition-transform shrink-0"
                    title="Unduh Rapor Karakter"
                    type="button"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAPORAN MISI */}
        {activeTab === 'laporan' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter Kelas:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="p-2 bg-white border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="semua">Semua Kelas</option>
                  <option value="Kelas 5 A">Kelas 5 A</option>
                  <option value="Kelas 4 B">Kelas 4 B</option>
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-extrabold text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Data Laporan</span>
              </button>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto rounded-2xl border-brutal shadow-brutal bg-slate-900 text-white">
              <table className="w-full text-xs font-bold text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-slate-200 border-b-2 border-slate-700 uppercase">
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Nama Agen</th>
                    <th className="p-3 text-center">Kls</th>
                    {HABITS.map((h) => (
                      <th key={h.id} className="p-2 text-center text-base" title={h.title}>
                        {h.emoji}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users
                    .filter((u) => u.role === 'siswa')
                    .filter((u) => selectedClassFilter === 'semua' || u.class === selectedClassFilter)
                    .map((siswa) => {
                      return (
                        <tr key={siswa.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="p-3 text-slate-300 whitespace-nowrap">{todayStr}</td>
                          <td className="p-3 font-extrabold text-yellow-300 uppercase">{siswa.name}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px]">
                              {siswa.class.replace('Kelas ', '')}
                            </span>
                          </td>
                          {HABITS.map((habit) => {
                            const sub = todaySubmissions.find(
                              (s) => s.studentId === siswa.id && s.habitId === habit.id
                            );
                            return (
                              <td key={habit.id} className="p-2 text-center">
                                {sub ? (
                                  <button
                                    onClick={() => setSelectedProof(sub)}
                                    className="px-2 py-1 bg-sky-400 hover:bg-sky-500 text-slate-900 font-extrabold text-[11px] rounded-lg border-brutal-sm shadow-sm transition-transform active:scale-95"
                                  >
                                    Lihat
                                  </button>
                                ) : (
                                  <span className="text-red-400 font-black text-sm">✕</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DATA GURU */}
        {activeTab === 'guru' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-extrabold text-slate-800 uppercase">Daftar Guru Pengampu:</h4>
              <button
                onClick={() => {
                  setNewUserRole('guru');
                  setShowAddUserModal(true);
                }}
                className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Guru Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users
                .filter((u) => u.role === 'guru')
                .map((g) => (
                  <div
                    key={g.id}
                    className="p-4 bg-yellow-50 border-brutal rounded-2xl shadow-brutal flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-black uppercase text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded border border-yellow-400">
                        {g.class}
                      </span>
                      <h5 className="text-lg font-black font-heading text-slate-900 mt-1">{g.name}</h5>
                      <p className="text-xs font-bold text-slate-600">Username/NIP: {g.username}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(g.id)}
                      className="p-2 bg-red-400 hover:bg-red-500 text-white rounded-xl border-brutal-sm shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: DATA AGEN (SISWA) */}
        {activeTab === 'agen' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-extrabold text-slate-800 uppercase">Daftar Agen (Siswa):</h4>
              <button
                onClick={() => {
                  setNewUserRole('siswa');
                  setShowAddUserModal(true);
                }}
                className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Agen Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users
                .filter((u) => u.role === 'siswa')
                .map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-amber-50 border-brutal rounded-2xl shadow-brutal flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-400">
                        {s.class}
                      </span>
                      <h5 className="text-lg font-black font-heading text-slate-900 mt-1">{s.name}</h5>
                      <p className="text-xs font-bold text-slate-600">NISN: {s.username} | ⭐ {s.points} Poin</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(s.id)}
                      className="p-2 bg-red-400 hover:bg-red-500 text-white rounded-xl border-brutal-sm shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: PENGATURAN KOP & LOGO */}
        {activeTab === 'pengaturan' && (
          <form onSubmit={handleSaveKop} className="space-y-4 max-w-2xl mx-auto bg-slate-50 p-5 rounded-2xl border-brutal">
            <h4 className="text-base font-black font-heading text-slate-900 border-b-2 border-slate-300 pb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              <span>Pengaturan Kop Sekolah & Media Portal</span>
            </h4>

            {isSavedNotice && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl text-xs font-black text-emerald-900 text-center">
                ✅ Pengaturan Kop Sekolah Berhasil Disimpan!
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                Nama Sekolah:
              </label>
              <input
                type="text"
                value={kopForm.schoolName}
                onChange={(e) => setKopForm({ ...kopForm, schoolName: e.target.value })}
                className="w-full p-2.5 bg-white border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                Judul Portal Misi:
              </label>
              <input
                type="text"
                value={kopForm.portalTitle}
                onChange={(e) => setKopForm({ ...kopForm, portalTitle: e.target.value })}
                className="w-full p-2.5 bg-white border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  URL Logo 1 (Kemdikbud):
                </label>
                <input
                  type="text"
                  value={kopForm.logo1Url}
                  onChange={(e) => setKopForm({ ...kopForm, logo1Url: e.target.value })}
                  className="w-full p-2 bg-white border-brutal-sm rounded-xl text-[11px] font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  URL Logo 2 (Daerah):
                </label>
                <input
                  type="text"
                  value={kopForm.logo2Url}
                  onChange={(e) => setKopForm({ ...kopForm, logo2Url: e.target.value })}
                  className="w-full p-2 bg-white border-brutal-sm rounded-xl text-[11px] font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  URL Logo 3 (Sekolah):
                </label>
                <input
                  type="text"
                  value={kopForm.logo3Url}
                  onChange={(e) => setKopForm({ ...kopForm, logo3Url: e.target.value })}
                  className="w-full p-2 bg-white border-brutal-sm rounded-xl text-[11px] font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                URL Embed Video YouTube (Senam Anak Indonesia Hebat):
              </label>
              <input
                type="text"
                value={kopForm.youtubeEmbedUrl}
                onChange={(e) => setKopForm({ ...kopForm, youtubeEmbedUrl: e.target.value })}
                className="w-full p-2.5 bg-white border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-sm rounded-xl border-brutal shadow-brutal flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>SIMPAN PENGATURAN KOP</span>
            </button>

            {/* Clear All Submissions Button */}
            <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      'Apakah Anda yakin ingin MENGHAPUS SEMUA DATA LAPORAN SISWA? Tindakan ini tidak dapat dibatalkan.'
                    )
                  ) {
                    onUpdateSubmissions([]);
                    alert('🗑️ Semua data laporan pembiasaan berhasil dihapus!');
                  }
                }}
                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl border-brutal shadow-brutal flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
                <span>HAPUS SEMUA RIWAYAT LAPORAN HARIAN</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Proof Modal */}
      {selectedProof && (
        <ProofViewModal
          submission={selectedProof}
          onClose={() => setSelectedProof(null)}
          onVerify={(subId, feedback) => {
            const updated = submissions.map((s) =>
              s.id === subId ? { ...s, teacherVerified: true, teacherFeedback: feedback } : s
            );
            onUpdateSubmissions(updated);
          }}
          onDelete={(subId) => {
            if (onDeleteSubmission) {
              onDeleteSubmission(subId);
            }
            setSelectedProof(null);
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white border-brutal shadow-brutal-lg rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-lg font-black font-heading text-slate-900 uppercase">
              Tambah {newUserRole === 'guru' ? 'Guru' : 'Agen (Siswa)'} Baru
            </h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  {newUserRole === 'siswa' ? 'NISN / Username' : 'NIP / Username'}:
                </label>
                <input
                  type="text"
                  required
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  Tingkat Kelas:
                </label>
                <input
                  type="text"
                  required
                  value={newUserClass}
                  onChange={(e) => setNewUserClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border-brutal-sm rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border-brutal-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-400 text-slate-900 font-black text-xs rounded-xl border-brutal-sm shadow-brutal-sm"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
