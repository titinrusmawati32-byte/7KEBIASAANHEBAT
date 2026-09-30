import React, { useState } from 'react';
import { User, Submission } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Star,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Users
} from 'lucide-react';

interface StudentManagementProps {
  currentUser: User;
  users: User[];
  submissions: Submission[];
  todayStr: string;
  onSelectStudent: (student: User) => void;
  onUpdateUsers: (newUsers: User[]) => void;
  onSendAppreciation: (studentId: string, studentName: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  currentUser,
  users,
  submissions,
  todayStr,
  onSelectStudent,
  onUpdateUsers,
  onSendAppreciation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('semua');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'baik' | 'perhatian' | 'bimbingan'>('semua');

  // Modal tambah siswa
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNISN, setNewStudentNISN] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Kelas 5 A');

  const students = users.filter((u) => u.role === 'siswa');

  // Extract unique classes
  const classOptions = Array.from(new Set(students.map((s) => s.class))).filter(Boolean);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'semua' || student.class === selectedClass;

    const studentTodaySubs = submissions.filter(
      (s) => s.studentId === student.id && s.date === todayStr
    );
    const count = studentTodaySubs.length;

    let status: 'baik' | 'perhatian' | 'bimbingan' = 'baik';
    if (count < 4) status = 'bimbingan';
    else if (count < 6) status = 'perhatian';

    const matchesStatus = statusFilter === 'semua' || status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentNISN.trim()) return;

    const newStudent: User = {
      id: `u-${Date.now()}`,
      name: newStudentName.trim(),
      username: newStudentNISN.trim(),
      role: 'siswa',
      class: newStudentClass,
      points: 0,
      isOnline: true,
    };

    onUpdateUsers([...users, newStudent]);
    setNewStudentName('');
    setNewStudentNISN('');
    setShowAddModal(false);
  };

  const handleDeleteStudent = (student: User) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa "${student.name}"?`)) {
      onUpdateUsers(users.filter((u) => u.id !== student.id));
    }
  };

  const baikCount = students.filter((s) => {
    const c = submissions.filter((sub) => sub.studentId === s.id && sub.date === todayStr).length;
    return c >= 6;
  }).length;
  const perhatianCount = students.filter((s) => {
    const c = submissions.filter((sub) => sub.studentId === s.id && sub.date === todayStr).length;
    return c >= 4 && c < 6;
  }).length;
  const bimbinganCount = students.filter((s) => {
    const c = submissions.filter((sub) => sub.studentId === s.id && sub.date === todayStr).length;
    return c < 4;
  }).length;

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Header and Add Student */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Data Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar lengkap seluruh siswa yang dipantau pembiasaannya ({students.length} Siswa).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* 4 Summary Cards: Mobile-first CSS Grid (grid-cols-1 for mobile, sm:grid-cols-2 for tablet, lg:grid-cols-4 for desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Siswa</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 border border-sky-100 dark:border-sky-900 shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{students.length}</span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500">Siswa</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Terdaftar dalam sistem</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Status Baik</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{baikCount}</span>
            <span className="text-[10px] sm:text-xs font-medium text-emerald-600">Siswa</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Capaian &ge; 6 kebiasaan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Perlu Perhatian</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-900 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{perhatianCount}</span>
            <span className="text-[10px] sm:text-xs font-medium text-amber-600">Siswa</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Capaian 4 - 5 kebiasaan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Perlu Bimbingan</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 border border-rose-100 dark:border-rose-900 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{bimbinganCount}</span>
            <span className="text-[10px] sm:text-xs font-medium text-rose-600">Siswa</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Capaian &lt; 4 kebiasaan</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa atau NISN..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Filter Kelas */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="semua">Semua Kelas</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="semua">Semua Status</option>
            <option value="baik">Status: Baik (&gt;=6)</option>
            <option value="perhatian">Perlu Perhatian (4-5)</option>
            <option value="bimbingan">Perlu Bimbingan (&lt;4)</option>
          </select>
        </div>
      </div>

      {/* Students Table for Tablet & Desktop, and Card List for Mobile */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Desktop & Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">NISN / Username</th>
                <th className="py-3 px-4">Progres Hari Ini</th>
                <th className="py-3 px-4">Poin Karakter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada siswa yang sesuai dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentTodaySubs = submissions.filter(
                    (s) => s.studentId === student.id && s.date === todayStr
                  );
                  const count = studentTodaySubs.length;
                  const percent = Math.round((count / 7) * 100);

                  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
                  let badgeLabel = 'Baik';

                  if (count < 4) {
                    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
                    badgeLabel = 'Perlu Bimbingan';
                  } else if (count < 6) {
                    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
                    badgeLabel = 'Perlu Perhatian';
                  }

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center border border-sky-100 dark:border-sky-900">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {student.class}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {student.username}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1 max-w-[120px]">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <span>{count}/7</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                count >= 6 ? 'bg-emerald-500' : count >= 4 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {student.points || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeClass}`}>
                          {badgeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>

                          <button
                            onClick={() => onSendAppreciation(student.id, student.name)}
                            className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                            title="Beri Apresiasi Poin"
                          >
                            <Star className="w-4 h-4" />
                          </button>

                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteStudent(student)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (No horizontal scrolling!) */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada siswa yang sesuai dengan filter atau pencarian.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const studentTodaySubs = submissions.filter(
                (s) => s.studentId === student.id && s.date === todayStr
              );
              const count = studentTodaySubs.length;
              const percent = Math.round((count / 7) * 100);

              let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
              let badgeLabel = 'Baik';

              if (count < 4) {
                badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
                badgeLabel = 'Perlu Bimbingan';
              } else if (count < 6) {
                badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
                badgeLabel = 'Perlu Perhatian';
              }

              return (
                <div key={student.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-sm shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </h4>
                        <p className="text-[10px] text-slate-400">{student.class} • NISN: {student.username}</p>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeClass}`}>
                      {badgeLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Progres Hari Ini:</span>
                      <strong className="text-slate-900 dark:text-white font-semibold">{count}/7 kebiasaan ({percent}%)</strong>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          count >= 6 ? 'bg-emerald-500' : count >= 4 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{student.points || 0} Poin</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSendAppreciation(student.id, student.name)}
                        className="min-h-[40px] px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Apresiasi</span>
                      </button>

                      <button
                        onClick={() => onSelectStudent(student)}
                        className="min-h-[40px] px-3.5 py-1.5 bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Tambah Siswa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Tambah Siswa Baru
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Masukkan identitas siswa untuk mulai memantau pembiasaan karakternya.
            </p>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NISN / Nomor Induk Siswa
                </label>
                <input
                  type="text"
                  required
                  value={newStudentNISN}
                  onChange={(e) => setNewStudentNISN(e.target.value)}
                  placeholder="Contoh: 0081234567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kelas
                </label>
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Kelas 1 A">Kelas 1 A</option>
                  <option value="Kelas 2 A">Kelas 2 A</option>
                  <option value="Kelas 3 A">Kelas 3 A</option>
                  <option value="Kelas 4 A">Kelas 4 A</option>
                  <option value="Kelas 5 A">Kelas 5 A</option>
                  <option value="Kelas 5 B">Kelas 5 B</option>
                  <option value="Kelas 6 A">Kelas 6 A</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
