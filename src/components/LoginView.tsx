import React, { useState, useEffect } from 'react';
import { SchoolInfo, User } from '../types';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  School,
  BadgeCheck,
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
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim()) {
      setErrorMessage('Silakan isi NISN atau NIP/Username kamu!');
      return;
    }

    const trimmed = usernameInput.trim().toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase() === trimmed ||
        u.name.toLowerCase() === trimmed ||
        u.id.toLowerCase() === trimmed
    );

    if (matchedUser) {
      if (selectedRole === 'siswa' && matchedUser.role !== 'siswa') {
        setErrorMessage('Akun ini terdaftar sebagai Guru/Kepsek. Silakan ganti tab ke GURU/KEPSEK.');
        return;
      }
      if (selectedRole === 'guru_kepsek' && matchedUser.role === 'siswa') {
        setErrorMessage('Akun ini terdaftar sebagai Siswa. Silakan ganti tab ke SISWA.');
        return;
      }
      showToast(`Selamat datang, ${matchedUser.name}! Mengarahkan ke portal...`);
      setTimeout(() => onLogin(matchedUser), 600);
    } else {
      // Auto-create demo user
      const newDemoUser: User = {
        id: `user-${Date.now()}`,
        name: usernameInput,
        username: usernameInput,
        role: selectedRole === 'siswa' ? 'siswa' : 'guru',
        class: selectedRole === 'siswa' ? 'Kelas 5 A' : 'Kelas 5 A',
        points: 20,
        isOnline: true,
      };
      showToast(`Selamat datang, ${newDemoUser.name}!`);
      setTimeout(() => onLogin(newDemoUser), 600);
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemo = (userId: string, role: 'siswa' | 'guru_kepsek', label: string) => {
    setSelectedRole(role);
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUsernameInput(user.username);
      setPasswordInput('******');
      showToast(`Akun ${user.name} dipilih! Klik Masuk.`);
    } else {
      showToast(`Memilih akun demo ${label}...`);
    }
  };

  return (
    <div className="min-h-screen bg-bright-yellow-blue text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden p-3 md:p-6 pb-12 flex flex-col items-center transition-colors duration-300">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-yellow-300/60 dark:bg-amber-900/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -right-16 w-72 h-72 bg-sky-300/60 dark:bg-sky-900/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-400/50 dark:bg-blue-900/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-4xl space-y-5">
        {/* Top Real-time Dynamic Ribbon */}
        <header className="flex items-center justify-between gap-2 py-1">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full border-brutal-sm shadow-brutal-sm text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="text-emerald-500">👋</span>
            <span>Selamat Pagi, Sahabat Hebat!</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 bg-yellow-300 dark:bg-slate-800 text-slate-900 dark:text-yellow-300 px-3 py-1.5 rounded-full border-brutal-sm shadow-brutal-sm text-xs font-black transition-all hover:scale-105 active:scale-95"
            >
              {isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkTheme ? 'Terang' : 'Gelap'}</span>
            </button>

            <div className="flex items-center gap-2 bg-emerald-400 text-slate-900 px-3.5 py-1.5 rounded-full border-brutal-sm shadow-brutal-sm text-xs font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime || '07:15 WIB'}</span>
            </div>
          </div>
        </header>

        {/* School Branding & Crest */}
        <section className="flex flex-col items-center text-center my-2">
          <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-900 rounded-full border-brutal shadow-brutal mb-3 p-1">
            <img
              src={schoolInfo.logo3Url || schoolInfo.logo1Url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCY4oHhmgg9yt8rQ7TF4rAPMmwNnNRCGhYF7O8XSER9vcYZd7SvylUpMPuYePHEhIhi-1CF67oa8fmo4K_-1T9ZSzIyPsy5OdLdZQheqOKejKrhEgWmVcw_YMiXG6KBR_Hitit1F5LLcXfn5gMI3Y2rdgiWNGLNprl_5h8CO-D0og2J9zNt7uFYoUekzwWxb2sLJFIL060NCi8a9HZCuZLoz-2lnWZ907l7UuEx-95S0UeHluDavQtA'}
              alt={schoolInfo.schoolName}
              className="w-full h-full object-contain rounded-full"
            />
            <span className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 bg-emerald-400 text-slate-900 rounded-full border-brutal-sm shadow-sm">
              <BadgeCheck className="w-4 h-4 fill-emerald-800 text-white" />
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wide">
            {schoolInfo.schoolName || 'UPTD SATDIK SDN SUMBEREJO 04'}
          </h1>

          <div className="mt-1 bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-400 px-4 py-1 rounded-full shadow-sm">
            <p className="text-xs md:text-sm font-black text-amber-900 dark:text-amber-300">
              🌟 Portal Karakter & 7 Kebiasaan Anak Indonesia Hebat
            </p>
          </div>
        </section>

        {/* Main 2-Column Section: Video Pembiasaan + Pintu Masuk Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Video Pembiasaan Card */}
          <section className="lg:col-span-6 bg-white dark:bg-slate-900 border-brutal shadow-brutal rounded-3xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full border-brutal-sm">
                  <Tv className="w-4 h-4" />
                </span>
                <span className="font-black text-sm text-slate-900 dark:text-white">Video Pembiasaan Pagi</span>
              </div>
              <span className="text-[10px] bg-amber-300 text-slate-900 font-black px-2.5 py-0.5 rounded-full border-brutal-sm">
                Kemendikdasmen
              </span>
            </div>

            {/* Interactive Video Box */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-brutal bg-slate-900 group shadow-sm">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Ripple Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-14 h-14 bg-emerald-400/50 rounded-full animate-ping" />
                      <div className="w-12 h-12 bg-emerald-400 text-slate-900 rounded-full border-brutal-sm flex items-center justify-center shadow-lg transition-transform active:scale-95 group-hover:scale-110">
                        <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-black text-white drop-shadow">
                        Senam Pagi Anak Indonesia Hebat 2025
                      </p>
                      <span className="text-[10px] text-yellow-300 font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 3 Menit Pembiasaan
                      </span>
                    </div>
                    <span className="bg-yellow-300 text-slate-900 font-black text-[10px] px-2.5 py-0.5 rounded-full border-brutal-sm shadow">
                      Putar Video
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Login Main Interactive Card ("Pintu Masuk Petualangan") */}
          <section className="lg:col-span-6 bg-white dark:bg-slate-900 border-brutal shadow-brutal-lg rounded-3xl p-5 relative">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl animate-bounce">🚀</span>
              <h2 className="text-xl font-black font-heading text-slate-900 dark:text-white">
                Pintu Masuk Petualangan
              </h2>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-4">
              Yuk masuk untuk catat 7 kebiasaan hebatmu hari ini!
            </p>

            {/* Role Toggle Pill Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-950 border-brutal-sm rounded-2xl mb-4 gap-1">
              <button
                type="button"
                onClick={() => setSelectedRole('siswa')}
                className={`py-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'siswa'
                    ? 'bg-emerald-400 text-slate-900 border-brutal-sm shadow-brutal-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🎒 SISWA</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('guru_kepsek')}
                className={`py-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'guru_kepsek'
                    ? 'bg-yellow-300 text-slate-900 border-brutal-sm shadow-brutal-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>👩‍🏫 GURU / KEPSEK</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 mb-3 bg-red-100 dark:bg-red-950/80 border-2 border-red-500 rounded-xl text-xs font-bold text-red-800 dark:text-red-300">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {selectedRole === 'siswa'
                      ? 'Nomor Induk Siswa Nasional (NISN)'
                      : 'NIP / ID Pendidik'}
                  </span>
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={
                    selectedRole === 'siswa'
                      ? 'Contoh: 0129384756 (atau Reza)'
                      : 'Contoh: 198402122010012004 (atau Didin)'
                  }
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kata Sandi Rahasia</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Ketik kata sandi..."
                    required
                    className="w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border-brutal-sm rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    showToast('Hubungi Wali Kelasmu di SDN Sumberejo 04 untuk reset sandi.')
                  }
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" /> Lupa NISN? Tanya Wali Kelas
                </button>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-900 rounded-full font-black text-sm border-brutal shadow-brutal active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>MASUK SEKARANG</span>
                <LogIn className="w-4 h-4" />
              </button>
            </form>
          </section>
        </div>

        {/* Quick Access Demo Users Pill Grid */}
        <section className="bg-slate-100 dark:bg-slate-900 border-brutal shadow-brutal-sm rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Akses Cepat (Akun Uji Coba Demo)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Demo 1 */}
            <button
              type="button"
              onClick={() => handleQuickDemo('s1', 'siswa', 'Reza Rahadian')}
              className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-800 rounded-xl border-brutal-sm shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-sky-200 dark:bg-sky-900 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center font-black text-xs">
                👦
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">Reza Rahadian</p>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 block truncate">
                  Kelas 5 A (Siswa)
                </span>
              </div>
            </button>

            {/* Demo 2 */}
            <button
              type="button"
              onClick={() => handleQuickDemo('s2', 'siswa', 'Aisyah Putri')}
              className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-800 rounded-xl border-brutal-sm shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-900 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center font-black text-xs">
                👧
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">Revandito</p>
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 block truncate">
                  Kelas 5 A (Siswa)
                </span>
              </div>
            </button>

            {/* Demo 3 */}
            <button
              type="button"
              onClick={() => handleQuickDemo('g1', 'guru_kepsek', 'Didin Eka')}
              className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-800 rounded-xl border-brutal-sm shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-900 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center font-black text-xs">
                👩‍🏫
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">Didin Eka</p>
                <span className="text-[10px] font-extrabold text-sky-700 dark:text-sky-400 block truncate">
                  Wali Kelas 5 A
                </span>
              </div>
            </button>

            {/* Demo 4 */}
            <button
              type="button"
              onClick={() => handleQuickDemo('a1', 'guru_kepsek', 'Kepala Sekolah')}
              className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-800 rounded-xl border-brutal-sm shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 text-slate-900 dark:text-white border-brutal-sm flex items-center justify-center font-black text-xs">
                🏛️
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">Kepala Sekolah</p>
                <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-400 block truncate">
                  Admin Evaluator
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* 7 Habits Micro Badge Marquee Strip */}
        <section className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">
              Tujuh Kebiasaan Utama Hari Ini
            </span>
            <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
              100% Karakter Unggul
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {[
              { emoji: '🌅', label: 'Bangun Pagi' },
              { emoji: '🤲', label: 'Beribadah' },
              { emoji: '🏃', label: 'Berolahraga' },
              { emoji: '📖', label: 'Gemar Belajar' },
              { emoji: '🍎', label: 'Makan Sehat' },
              { emoji: '🤝', label: 'Bermasyarakat' },
              { emoji: '😴', label: 'Tidur Cepat' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center gap-1.5 bg-white dark:bg-slate-800 border-brutal-sm px-3 py-1.5 rounded-full shadow-sm"
              >
                <span className="text-sm">{item.emoji}</span>
                <span className="text-[11px] font-black text-slate-900 dark:text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center pt-2">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Kemendikdasmen • UPTD Satdik SDN Sumberejo 04
          </p>
        </footer>
      </div>

      {/* Interactive Toast Modal Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white border-2 border-emerald-400 px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
