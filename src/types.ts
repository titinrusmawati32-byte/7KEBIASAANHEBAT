export type Role = 'siswa' | 'guru' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string; // NISN or Username
  password?: string;
  role: Role;
  class: string; // e.g. "Kelas 5 A"
  points: number;
  avatar?: string;
  isOnline?: boolean;
}

export type HabitId = 
  | 'bangun_pagi'
  | 'ibadah'
  | 'olahraga'
  | 'makan_sehat'
  | 'gemar_belajar'
  | 'bermasyarakat'
  | 'tidur_cepat';

export interface Habit {
  id: HabitId;
  number: number;
  title: string;
  shortTitle: string;
  emoji: string;
  bgColor: string;
  cardBg: string;
  btnBg: string;
  timeRange: string;
  description: string;
  guidance: string[];
  tips: string;
  photoRequired: boolean;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string; // YYYY-MM-DD
  habitId: HabitId;
  completedAt: string; // HH:MM:SS
  note?: string;
  photoUrl?: string;
  pointsEarned: number;
  teacherVerified?: boolean;
  teacherFeedback?: string;
}

export interface QuizQuestion {
  id: string;
  habitId: HabitId;
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  explanation: string;
}

export interface SchoolInfo {
  schoolName: string; // e.g. "UPTD SATDIK SDN SUMBEREJO 04"
  portalTitle: string; // e.g. "Portal Misi 7 Kebiasaan Anak Hebat"
  subtitle: string;
  logo1Url: string; // Kemdikbud / Tut Wuri
  logo2Url: string; // Pemkab / Daerah
  logo3Url: string; // SD / School Logo
  videoTitle: string; // "Senam Anak Indonesia Hebat"
  videoChannel: string; // "KEMDIKDASMEN"
  youtubeEmbedUrl: string; // "https://www.youtube.com/embed/..." or sample video
}
