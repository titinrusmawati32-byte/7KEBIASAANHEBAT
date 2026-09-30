import React, { useState } from 'react';
import { User, SchoolInfo, Submission, QuizQuestion } from '../types';
import { ProofViewModal } from './ProofViewModal';
import { StudentDetailModal } from './StudentDetailModal';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { StudentManagement } from './dashboard/StudentManagement';
import { HabitGuidanceView } from './dashboard/HabitGuidanceView';
import { ReportsView } from './dashboard/ReportsView';
import { StatisticsView } from './dashboard/StatisticsView';
import { SettingsView } from './dashboard/SettingsView';
import {
  LayoutDashboard,
  Users,
  Award,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface PortalDashboardProps {
  currentUser: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  quizzes: QuizQuestion[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onUpdateSchoolInfo: (info: SchoolInfo) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateSubmissions: (subs: Submission[]) => void;
  onUpdateQuizzes: (quizzes: QuizQuestion[]) => void;
  onDeleteSubmission?: (id: string) => void;
}

export type DashboardTab = 'dashboard' | 'siswa' | 'pembiasaan' | 'laporan' | 'statistik' | 'pengaturan';

export const PortalDashboard: React.FC<PortalDashboardProps> = ({
  currentUser,
  schoolInfo,
  users,
  submissions,
  quizzes,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  onUpdateSchoolInfo,
  onUpdateUsers,
  onUpdateSubmissions,
  onUpdateQuizzes,
  onDeleteSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Modal states
  const [selectedProof, setSelectedProof] = useState<Submission | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submissions today for notification
  const todaySubs = submissions.filter((s) => s.date === todayStr);
  const unverifiedCount = submissions.filter((s) => !s.teacherVerified).length;

  const handleSendAppreciation = (studentId: string, studentName: string, note?: string) => {
    // Add bonus 10 points to student
    const student = users.find((u) => u.id === studentId);
    if (student) {
      const updatedUser = {
        ...student,
        points: (student.points || 0) + 10,
      };
      const updatedList = users.map((u) => (u.id === studentId ? updatedUser : u));
      onUpdateUsers(updatedList);
      showToast(`🌟 Apresiasi (+10 Poin) berhasil dikirim untuk ${studentName}!`);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'siswa', label: 'Data Siswa', icon: Users },
    { id: 'pembiasaan', label: 'Pembiasaan', icon: Award },
    { id: 'laporan', label: 'Laporan', icon: FileText },
    { id: 'statistik', label: 'Statistik', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fadeIn border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shrink-0 z-30 justify-between">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sidebar Brand */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center border border-sky-100 dark:border-sky-900 overflow-hidden">
              <img
                src={schoolInfo.logo1Url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png'}
                alt="Logo Tut Wuri"
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                7 Kebiasaan Siswa
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                SDN SUMBEREJO 04
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              Menu Utama
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User profile & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize truncate">
                  {currentUser.role === 'admin' ? 'Kepala Sekolah / Admin' : 'Guru Kelas'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col justify-between p-4 sm:p-5 shadow-2xl z-10 animate-slideRight">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 flex items-center justify-center border border-sky-100 dark:border-sky-900 overflow-hidden">
                    <img
                      src={schoolInfo.logo1Url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png'}
                      alt="Logo"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">Portal 7 Kebiasaan</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">{schoolInfo.schoolName}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as DashboardTab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                <p className="font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser.role === 'admin' ? 'Kepala Sekolah' : 'Guru Kelas'}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full min-h-[44px] px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 z-20">
          {/* Header Left: Responsive Title & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 shrink-0">
                <img
                  src={schoolInfo.logo1Url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png'}
                  alt="Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
              </div>

              <div className="min-w-0">
                {/* Mobile: Short name */}
                <h2 className="sm:hidden text-xs font-bold text-slate-900 dark:text-white truncate">
                  7 Kebiasaan <span className="text-[10px] font-normal text-slate-400">• {activeTab.toUpperCase()}</span>
                </h2>
                {/* Tablet / Desktop: Full title */}
                <h2 className="hidden sm:block text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                  Portal 7 Kebiasaan Anak Indonesia Hebat
                </h2>
                <p className="hidden sm:block text-[10px] md:text-[11px] font-medium text-slate-400 truncate">
                  {schoolInfo.schoolName || 'UPTD SATDIK SDN SUMBEREJO 04'}
                </p>
              </div>
            </div>
          </div>

          {/* Header Right: Notifikasi, Theme toggle, Profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
              aria-label="Ganti Tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
                title="Pemberitahuan"
                aria-label="Lihat Pemberitahuan"
              >
                <Bell className="w-4 h-4" />
                {unverifiedCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-slate-900 dark:text-white">Pemberitahuan</span>
                    <span className="text-[10px] text-slate-400">{todaySubs.length} aktivitas hari ini</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {unverifiedCount > 0 ? (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                        <span className="font-bold text-amber-900 dark:text-amber-300 block">
                          {unverifiedCount} Laporan Menunggu Verifikasi
                        </span>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                          Segera periksa dan verifikasi dokumentasi pembiasaan siswa.
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-400 py-3 text-center">Semua laporan sudah terverifikasi.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="min-h-[40px] flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Profil Pengguna"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.username} • {currentUser.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('pengaturan');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full min-h-[40px] text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Pengaturan Akun</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full min-h-[40px] text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-rose-600 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 w-full min-w-0">
          <div className="w-full max-w-7xl mx-auto min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardOverview
                currentUser={currentUser}
                schoolInfo={schoolInfo}
                users={users}
                submissions={submissions}
                todayStr={todayStr}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectStudent={(student) => setSelectedStudentForDetail(student)}
                onViewProof={(sub) => setSelectedProof(sub)}
              />
            )}

            {activeTab === 'siswa' && (
              <StudentManagement
                currentUser={currentUser}
                users={users}
                submissions={submissions}
                todayStr={todayStr}
                onSelectStudent={(student) => setSelectedStudentForDetail(student)}
                onUpdateUsers={onUpdateUsers}
                onSendAppreciation={(id, name) => handleSendAppreciation(id, name)}
              />
            )}

            {activeTab === 'pembiasaan' && (
              <HabitGuidanceView
                currentUser={currentUser}
                users={users}
                schoolInfo={schoolInfo}
                onSendAppreciation={(id, name, note) => handleSendAppreciation(id, name, note)}
              />
            )}

            {activeTab === 'laporan' && (
              <ReportsView
                currentUser={currentUser}
                schoolInfo={schoolInfo}
                users={users}
                submissions={submissions}
                todayStr={todayStr}
                onUpdateSubmissions={onUpdateSubmissions}
                onDeleteSubmission={onDeleteSubmission}
                onViewProof={(sub) => setSelectedProof(sub)}
              />
            )}

            {activeTab === 'statistik' && (
              <StatisticsView
                users={users}
                submissions={submissions}
                todayStr={todayStr}
              />
            )}

            {activeTab === 'pengaturan' && (
              <SettingsView
                currentUser={currentUser}
                schoolInfo={schoolInfo}
                users={users}
                quizzes={quizzes}
                onUpdateSchoolInfo={onUpdateSchoolInfo}
                onUpdateUsers={onUpdateUsers}
                onUpdateQuizzes={onUpdateQuizzes}
              />
            )}
          </div>
        </main>
      </div>

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
            showToast('✅ Laporan berhasil diverifikasi!');
          }}
          onDelete={onDeleteSubmission}
        />
      )}

      {/* Student Detail Modal */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          submissions={submissions}
          todayStr={todayStr}
          onClose={() => setSelectedStudentForDetail(null)}
          onViewProof={(sub) => setSelectedProof(sub)}
          onSendAppreciation={(id, name) => handleSendAppreciation(id, name)}
        />
      )}
    </div>
  );
};
