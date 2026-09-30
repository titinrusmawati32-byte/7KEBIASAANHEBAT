import React from 'react';
import { User, SchoolInfo } from '../../types';
import {
  User as UserIcon,
  School,
  BadgeCheck,
  BookOpen,
  Calendar,
  LogOut,
  Shield
} from 'lucide-react';

interface StudentProfileViewProps {
  user: User;
  schoolInfo: SchoolInfo;
  onLogout: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  user,
  schoolInfo,
  onLogout,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto min-w-0 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Profil Siswa
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Informasi data diri dan keanggotaan di portal pembiasaan karakter.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-2xl flex items-center justify-center border border-sky-200 dark:border-sky-800 shadow-sm">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Siswa Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.class} • NISN / ID: {user.username}
            </p>
            <p className="text-xs text-slate-400">
              {schoolInfo.schoolName || 'UPTD SATDIK SDN SUMBEREJO 04'}
            </p>
          </div>
        </div>

        {/* Info Fields */}
        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Satuan Pendidikan</span>
            <span className="font-semibold text-slate-900 dark:text-white text-right">
              {schoolInfo.schoolName}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Rombongan Belajar</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.class}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nomor Induk Siswa (NISN)</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              {user.username}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Poin Karakter Terkumpul</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {user.points || 0} Poin Bintang
            </span>
          </div>
        </div>

        {/* Logout action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun Siswa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
