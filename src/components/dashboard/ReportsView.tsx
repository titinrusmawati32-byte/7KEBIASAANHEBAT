import React, { useState } from 'react';
import { User, Submission, SchoolInfo } from '../../types';
import { HABITS } from '../../data/habitsData';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  Check
} from 'lucide-react';

interface ReportsViewProps {
  currentUser: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  todayStr: string;
  onUpdateSubmissions: (subs: Submission[]) => void;
  onDeleteSubmission?: (id: string) => void;
  onViewProof: (sub: Submission) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentUser,
  schoolInfo,
  users,
  submissions,
  todayStr,
  onUpdateSubmissions,
  onDeleteSubmission,
  onViewProof,
}) => {
  const [dateFilter, setDateFilter] = useState<string>(todayStr);
  const [selectedClass, setSelectedClass] = useState<string>('semua');
  const [selectedHabit, setSelectedHabit] = useState<string>('semua');
  const [selectedStudent, setSelectedStudent] = useState<string>('semua');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'terverifikasi' | 'menunggu'>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const students = users.filter((u) => u.role === 'siswa');
  const classOptions = Array.from(new Set(students.map((s) => s.class))).filter(Boolean);

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesDate = !dateFilter || sub.date === dateFilter;
    const matchesClass = selectedClass === 'semua' || sub.class === selectedClass;
    const matchesHabit = selectedHabit === 'semua' || sub.habitId === selectedHabit;
    const matchesStudent = selectedStudent === 'semua' || sub.studentId === selectedStudent;
    const matchesStatus =
      statusFilter === 'semua' ||
      (statusFilter === 'terverifikasi' && sub.teacherVerified) ||
      (statusFilter === 'menunggu' && !sub.teacherVerified);
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.note && sub.note.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDate && matchesClass && matchesHabit && matchesStudent && matchesStatus && matchesSearch;
  });

  // Verify single submission
  const handleToggleVerify = (subId: string) => {
    const updated = submissions.map((s) =>
      s.id === subId ? { ...s, teacherVerified: !s.teacherVerified } : s
    );
    onUpdateSubmissions(updated);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Tanggal,Waktu,Nama Siswa,Kelas,Kebiasaan,Catatan,Poin,Status Verifikasi\n';
    const rows = filteredSubmissions
      .map((s) => {
        const habit = HABITS.find((h) => h.id === s.habitId);
        return `"${s.date}","${s.completedAt}","${s.studentName}","${s.class}","${habit?.title || s.habitId}","${(s.note || '').replace(/"/g, '""')}","${s.pointsEarned}","${s.teacherVerified ? 'Terverifikasi' : 'Menunggu'}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Pembiasaan_${dateFilter || 'Semua'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Laporan Pembiasaan Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring, verifikasi, dan ekspor data pembiasaan harian siswa ({filteredSubmissions.length} Laporan).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 no-print">
        {/* Row 1: Search & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau catatan..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="absolute right-2.5 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded"
              >
                Reset
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="semua">Semua Kelas</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Habit, Student, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="semua">Semua Kebiasaan (7 Kebiasaan)</option>
              {HABITS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.number}. {h.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="semua">Semua Siswa</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.class})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="semua">Semua Status Verifikasi</option>
              <option value="terverifikasi">Status: Terverifikasi</option>
              <option value="menunggu">Status: Menunggu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Print KOP Header (Visible only when printed) */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-black pb-4">
        <h1 className="text-xl font-bold uppercase">{schoolInfo.schoolName}</h1>
        <h2 className="text-sm font-semibold">{schoolInfo.portalTitle}</h2>
        <p className="text-xs text-slate-600 mt-1">
          Laporan Rekapitulasi Pembiasaan Karakter Siswa • Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}
        </p>
      </div>

      {/* Reports Table for Tablet & Desktop, and Card List for Mobile */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Desktop & Tablet Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Waktu & Tanggal</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Kebiasaan</th>
                <th className="py-3 px-4">Catatan / Foto</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada laporan pembiasaan yang sesuai dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const habit = HABITS.find((h) => h.id === sub.habitId);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        <div>{sub.completedAt}</div>
                        <div className="text-[10px] text-slate-400">{sub.date}</div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {sub.studentName}
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {sub.class}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <span>{habit?.emoji}</span>
                          <span>{habit?.title || sub.habitId}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-[200px]">
                        {sub.note && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-1 mb-1">
                            "{sub.note}"
                          </p>
                        )}
                        {sub.photoUrl ? (
                          <button
                            onClick={() => onViewProof(sub)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 no-print"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat Foto Bukti</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Tanpa Foto</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            sub.teacherVerified
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          {sub.teacherVerified ? 'Terverifikasi' : 'Menunggu'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right no-print">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleVerify(sub.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              sub.teacherVerified
                                ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                                : 'text-slate-400 border-slate-200 hover:text-emerald-600 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                            }`}
                            title={sub.teacherVerified ? 'Batal Verifikasi' : 'Verifikasi Laporan'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          {onDeleteSubmission && (
                            <button
                              onClick={() => {
                                if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
                                  onDeleteSubmission(sub.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Hapus Laporan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Mobile Card List View (No horizontal scrolling on phones!) */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada laporan pembiasaan yang sesuai dengan filter.
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const habit = HABITS.find((h) => h.id === sub.habitId);

              return (
                <div key={sub.id} className="p-4 space-y-3">
                  {/* Student & Habit Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-2xl p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shrink-0">
                        {habit?.emoji || '⭐'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {sub.studentName}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded shrink-0">
                            {sub.class}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                          {habit?.number}. {habit?.title || sub.habitId}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {sub.completedAt} • {sub.date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${
                        sub.teacherVerified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      {sub.teacherVerified ? 'Terverifikasi' : 'Menunggu'}
                    </span>
                  </div>

                  {/* Note if any */}
                  {sub.note && (
                    <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic">
                      "{sub.note}"
                    </div>
                  )}

                  {/* Mobile Actions: Touch-friendly */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <div>
                      {sub.photoUrl ? (
                        <button
                          onClick={() => onViewProof(sub)}
                          className="min-h-[40px] px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Foto Bukti</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Tanpa Foto</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVerify(sub.id)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                          sub.teacherVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-sky-600 text-white border-transparent hover:bg-sky-700 shadow-sm'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{sub.teacherVerified ? 'Batal' : 'Verifikasi'}</span>
                      </button>

                      {onDeleteSubmission && (
                        <button
                          onClick={() => {
                            if (confirm('Hapus laporan ini?')) {
                              onDeleteSubmission(sub.id);
                            }
                          }}
                          className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors"
                          title="Hapus Laporan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
