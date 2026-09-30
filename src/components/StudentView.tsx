import React, { useState } from 'react';
import { User, Submission, Habit, QuizQuestion, SchoolInfo } from '../types';
import { StudentDashboardOverview } from './student/StudentDashboardOverview';
import { StudentHabitsList } from './student/StudentHabitsList';
import { StudentHistoryView } from './student/StudentHistoryView';
import { StudentAchievementsView } from './student/StudentAchievementsView';
import { StudentProfileView } from './student/StudentProfileView';
import { StudentHabitModal } from './student/StudentHabitModal';
import { ChestRewardModal } from './ChestRewardModal';
import {
  LayoutDashboard,
  Award,
  History,
  Trophy,
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StudentViewProps {
  user: User;
  schoolInfo?: SchoolInfo;
  submissions: Submission[];
  quizzes: QuizQuestion[];
  onLogout: () => void;
  onSubmitHabit: (
    habitId: Habit['id'],
    note: string,
    photoUrl: string,
    quizAnsweredCorrectly: boolean
  ) => void;
  onDeleteSubmission?: (id: string) => void;
}

export type StudentTab = 'dashboard' | 'kebiasaan' | 'riwayat' | 'prestasi' | 'profil';

export const StudentView: React.FC<StudentViewProps> = ({
  user,
  schoolInfo,
  submissions,
  quizzes,
  onLogout,
  onSubmitHabit,
  onDeleteSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Modals state
  const [activeHabitModal, setActiveHabitModal] = useState<{
    habit: Habit;
    sub?: Submission;
  } | null>(null);
  const [showChestModal, setShowChestModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User's today submissions
  const todaySubs = submissions.filter(
    (s) => s.studentId === user.id && s.date === todayStr
  );
  const completedCount = todaySubs.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kebiasaan', label: '7 Kebiasaan', icon: Award },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'prestasi', label: 'Prestasi', icon: Trophy },
    { id: 'profil', label: 'Profil', icon: UserIcon },
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
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center border border-sky-100 dark:border-sky-900 overflow-hidden shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png"
                alt="Logo Tut Wuri"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                Portal Siswa Hebat
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                SDN SUMBEREJO 04
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              Menu Siswa
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as StudentTab)}
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

        {/* Sidebar Footer: Student Profile & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user.class}
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-white dark:bg-slate-900 h-full flex flex-col justify-between p-4 shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                    <Award className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="font-bold text-xs">Portal Siswa</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
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
                        setActiveTab(item.id as StudentTab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                <p className="font-bold">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.class}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 z-20">
          {/* Header Left: School Logo & Responsive Title */}
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
                  src={schoolInfo?.logo1Url || "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png"}
                  alt="Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
              </div>

              <div className="min-w-0">
                {/* Mobile: Short name */}
                <h2 className="sm:hidden text-xs font-bold text-slate-900 dark:text-white truncate">
                  Portal Siswa <span className="text-[10px] font-normal text-slate-400 capitalize">• {activeTab}</span>
                </h2>
                {/* Tablet / Desktop: Full title */}
                <h2 className="hidden sm:block text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                  Portal 7 Kebiasaan Anak Indonesia Hebat
                </h2>
                <p className="hidden sm:block text-[10px] md:text-[11px] font-medium text-slate-400 truncate">
                  {schoolInfo?.schoolName || 'UPTD SATDIK SDN SUMBEREJO 04'}
                </p>
              </div>
            </div>
          </div>

          {/* Header Right: Notifikasi, Theme toggle, Profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
              aria-label="Ganti Tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
                title="Pemberitahuan"
                aria-label="Pemberitahuan"
              >
                <Bell className="w-4 h-4" />
                {completedCount < 7 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-slate-900 dark:text-white">Pemberitahuan</span>
                    <span className="text-[10px] text-slate-400">{completedCount}/7 selesai</span>
                  </div>

                  <div className="space-y-2">
                    {completedCount === 7 ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                          🎉 Selamat, {user.name}!
                        </span>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                          Semua 7 kebiasaan hari ini sudah tuntas. Buka Peti Apresiasi di menu Prestasi!
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                        <span className="font-bold text-sky-900 dark:text-sky-300 block">
                          Tinggal {7 - completedCount} kebiasaan lagi
                        </span>
                        <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-0.5">
                          Yuk selesaikan pembiasaanmu sebelum hari berganti!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="min-h-[40px] flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Profil Siswa"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs shrink-0">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.class}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('profil');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Profil Saya</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-rose-600 flex items-center gap-2 mt-1"
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 w-full min-w-0">
          <div className="w-full max-w-7xl mx-auto min-w-0">
            {activeTab === 'dashboard' && (
              <StudentDashboardOverview
                user={user}
                submissions={submissions}
                todayStr={todayStr}
                onOpenHabitModal={(habit, sub) => setActiveHabitModal({ habit, sub })}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'kebiasaan' && (
              <StudentHabitsList
                user={user}
                submissions={submissions}
                todayStr={todayStr}
                onOpenHabitModal={(habit, sub) => setActiveHabitModal({ habit, sub })}
              />
            )}

            {activeTab === 'riwayat' && (
              <StudentHistoryView
                user={user}
                submissions={submissions}
              />
            )}

            {activeTab === 'prestasi' && (
              <StudentAchievementsView
                user={user}
                submissions={submissions}
                todayStr={todayStr}
                onOpenChest={() => setShowChestModal(true)}
              />
            )}

            {activeTab === 'profil' && (
              <StudentProfileView
                user={user}
                schoolInfo={
                  schoolInfo || {
                    schoolName: 'UPTD SATDIK SDN SUMBEREJO 04',
                    portalTitle: 'Portal 7 Kebiasaan Anak Indonesia Hebat',
                    subtitle: '',
                    logo1Url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png',
                    logo2Url: '',
                    logo3Url: '',
                    videoTitle: '',
                    videoChannel: '',
                    youtubeEmbedUrl: '',
                  }
                }
                onLogout={onLogout}
              />
            )}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as StudentTab)}
                className={`min-h-[44px] flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Habit Submission / Detail Modal */}
      {activeHabitModal && (
        <StudentHabitModal
          habit={activeHabitModal.habit}
          user={user}
          submission={activeHabitModal.sub}
          quizzes={quizzes}
          onClose={() => setActiveHabitModal(null)}
          onSubmit={(habitId, note, photoUrl, quizAnsweredCorrectly) => {
            onSubmitHabit(habitId, note, photoUrl, quizAnsweredCorrectly);
            showToast(`✅ Laporan ${activeHabitModal.habit.title} berhasil disimpan!`);
          }}
          onDelete={onDeleteSubmission}
        />
      )}

      {/* Chest Reward Modal */}
      {showChestModal && (
        <ChestRewardModal
          user={user}
          completedCount={completedCount}
          onClose={() => setShowChestModal(false)}
        />
      )}
    </div>
  );
};
