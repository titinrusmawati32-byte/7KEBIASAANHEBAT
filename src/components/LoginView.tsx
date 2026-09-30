import React, { useState, useEffect } from 'react';
import { SchoolInfo, User } from '../types';
import {
  Play,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Clock,
  HelpCircle,
  LogIn,
  Tv,
  X,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';

interface LoginViewProps {
  schoolInfo: SchoolInfo;
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  schoolInfo,
  users,
  onLogin,
}) => {
  const [selectedRole, setSelectedRole] = useState<'siswa' | 'guru_kepsek'>('siswa');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const nextTheme = !isDarkTheme;
    setIsDarkTheme(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Live Clock Updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes} WIB`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = usernameInput.trim().toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase() === trimmed ||
        u.name.toLowerCase() === trimmed ||
        u.id.toLowerCase() === trimmed
    );

    if (matchedUser) {
      if (selectedRole === 'siswa' && matchedUser.role !== 'siswa') {
        setErrorMessage('Akun ini terdaftar sebagai Guru/Kepsek. Silakan pilih tab Guru / Kepsek.');
        return;
      }
      if (selectedRole === 'guru_kepsek' && matchedUser.role === 'siswa') {
        setErrorMessage('Akun ini terdaftar sebagai Siswa. Silakan pilih tab Siswa.');
        return;
      }
      showToast(`Selamat datang, ${matchedUser.name}!`);
      setTimeout(() => onLogin(matchedUser), 400);
    } else {
      // Auto-create demo user
      const newDemoUser: User = {
        id: `user-${Date.now()}`,
        name: usernameInput,
        username: usernameInput,
        role: selectedRole === 'siswa' ? 'siswa' : 'guru',
        class: 'Kelas 5 A',
        points: 20,
        isOnline: true,
      };
      showToast(`Selamat datang, ${newDemoUser.name}!`);
      setTimeout(() => onLogin(newDemoUser), 400);
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemo = (userId: string, role: 'siswa' | 'guru_kepsek') => {
    setSelectedRole(role);
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUsernameInput(user.username);
      setPasswordInput('******');
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 pb-12 flex flex-col items-center justify-center transition-colors">
      <div className="w-full max-w-4xl space-y-6">
        {/* Top Header */}
        <header className="flex items-center justify-between gap-2 py-1">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-emerald-500">👋</span>
            <span>Selamat Datang di Portal Pembiasaan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-medium transition-colors"
            >
              {isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkTheme ? 'Terang' : 'Gelap'}</span>
            </button>

            <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentTime || '07:15 WIB'}</span>
            </div>
          </div>
        </header>

        {/* School Branding */}
        <section className="flex flex-col items-center text-center my-2">
          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-3 p-2 flex items-center justify-center">
            <img
              src={schoolInfo.logo1Url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png'}
              alt={schoolInfo.schoolName}
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {schoolInfo.schoolName || 'UPTD SATDIK SDN SUMBEREJO 04'}
          </h1>

          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Portal 7 Kebiasaan Anak Indonesia Hebat
          </p>
        </section>

        {/* Main 2-Column Section: Video + Login Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Video */}
          <section className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 bg-sky-50 dark:bg-sky-950 text-sky-600 rounded-lg">
                  <Tv className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">Video Panduan Senam</span>
              </div>
              <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-md">
                Kemendikdasmen
              </span>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 group">
              {isPlayingVideo ? (
                <iframe
                  className="w-full h-full"
                  src={
                    schoolInfo.youtubeEmbedUrl ||
                    'https://www.youtube-nocookie.com/embed/J---aiyznGQ?autoplay=1&rel=0'
                  }
                  title="Senam Anak Indonesia Hebat"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => setIsPlayingVideo(true)}
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEHkmiBzIdj2tUQrGp-adOp192tTdV97fAIMCapg1PgFGJXPUebuZcFdPI9HbF88QyBpssD6ekZm7R4Cv0QgKV9Dm4X3qeXyYj--Sgl-v_0npvGVPYLYcZ6GvegXiqYLqLIZnYwwZ8rDKbix0fP-LoofStBA_K6Lsd0l8CSoIoP9kTdw-TODWRF-nSfInhAPDG1nEXWZlOJ3DZYWfyDNpbDJr_cHBSxBPigFCkK2ubngfRqV2tRNqO8g"
                    alt="Senam Pagi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white drop-shadow">
                        Senam Anak Indonesia Hebat
                      </p>
                      <span className="text-[10px] text-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 3 Menit Pembiasaan
                      </span>
                    </div>
                    <span className="bg-sky-600 text-white font-semibold text-[10px] px-2.5 py-1 rounded-lg">
                      Putar
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Login Card */}
          <section className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-6 relative">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Masuk ke Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 mt-0.5">
              Silakan masuk untuk memantau atau melaporkan pembiasaan karakter.
            </p>

            {/* Role Toggle */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 gap-1">
              <button
                type="button"
                onClick={() => setSelectedRole('siswa')}
                className={`py-2 rounded-lg font-semibold text-xs transition-all ${
                  selectedRole === 'siswa'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Siswa
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('guru_kepsek')}
                className={`py-2 rounded-lg font-semibold text-xs transition-all ${
                  selectedRole === 'guru_kepsek'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Guru / Kepsek
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 mb-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{selectedRole === 'siswa' ? 'Nomor Induk Siswa (NISN) / Nama' : 'Username / NIP Pendidik'}</span>
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={
                    selectedRole === 'siswa'
                      ? 'Contoh: 0129384756 (atau Reza)'
                      : 'Contoh: guru_didin (atau Didin)'
                  }
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Kata Sandi</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    showToast('Silakan hubungi Wali Kelas / Operator SDN Sumberejo 04 untuk informasi akun.')
                  }
                  className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" /> Butuh bantuan login?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Masuk ke Portal</span>
                <LogIn className="w-4 h-4" />
              </button>
            </form>
          </section>
        </div>

        {/* Quick Demo Access Grid */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Akses Cepat Uji Coba (Pilih Akun Demo)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('s1', 'siswa')}
              className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-sky-300 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                R
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Reza Rahadian</p>
                <span className="text-[10px] text-slate-500 block truncate">Siswa (5A)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('s2', 'siswa')}
              className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-sky-300 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                V
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Revandito</p>
                <span className="text-[10px] text-slate-500 block truncate">Siswa (5A)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('t1', 'guru_kepsek')}
              className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-sky-300 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                D
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Pak Didin S.Pd</p>
                <span className="text-[10px] text-slate-500 block truncate">Guru Wali Kelas</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin1', 'guru_kepsek')}
              className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-sky-300 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                K
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Kepala Sekolah</p>
                <span className="text-[10px] text-slate-500 block truncate">Administrator</span>
              </div>
            </button>
          </div>
        </section>

        {/* 7 Habits Preview Pills */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Target 7 Pembiasaan Karakter Anak Indonesia Hebat
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {[
              { emoji: '🌅', label: '1. Bangun Pagi' },
              { emoji: '🤲', label: '2. Beribadah' },
              { emoji: '🏃', label: '3. Berolahraga' },
              { emoji: '🍎', label: '4. Makan Sehat' },
              { emoji: '📖', label: '5. Gemar Belajar' },
              { emoji: '🤝', label: '6. Bermasyarakat' },
              { emoji: '😴', label: '7. Tidur Tepat Waktu' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Kemendikdasmen • UPTD Satdik SDN Sumberejo 04
          </p>
        </footer>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2 text-xs font-semibold animate-fadeIn border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
