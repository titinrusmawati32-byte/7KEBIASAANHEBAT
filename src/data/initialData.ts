import { SchoolInfo, User, Submission, QuizQuestion } from '../types';

// Default school header configuration matching the user screenshot
export const INITIAL_SCHOOL_INFO: SchoolInfo = {
  schoolName: 'UPTD SATDIK SDN SUMBEREJO 04',
  portalTitle: 'Portal Misi 7 Kebiasaan Anak Hebat',
  subtitle: 'Pemerintah Kabupaten Jember - Dinas Pendidikan',
  // Official logos / SVGs for Kemdikbud Tut Wuri Handayani, Kabupaten, and SDN
  logo1Url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/500px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png',
  logo2Url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Lambang_Kabupaten_Jember.png',
  logo3Url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/500px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png',
  videoTitle: 'Senam Anak Indonesia Hebat',
  videoChannel: 'KEMDIKDASMEN',
  youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/J---aiyznGQ?autoplay=0&rel=0',
};

// Initial system users
export const INITIAL_USERS: User[] = [
  // Siswa
  {
    id: 's1',
    name: 'REZA',
    username: '12345',
    role: 'siswa',
    class: 'Kelas 5 A',
    points: 20,
    isOnline: true,
  },
  {
    id: 's2',
    name: 'REVANDITO',
    username: '12346',
    role: 'siswa',
    class: 'Kelas 5 A',
    points: 40,
    isOnline: true,
  },
  {
    id: 's3',
    name: 'Fidella cantik',
    username: '12347',
    role: 'siswa',
    class: 'Kelas 5 A',
    points: 10,
    isOnline: false,
  },
  {
    id: 's4',
    name: 'Ahmad Rizky',
    username: '12348',
    role: 'siswa',
    class: 'Kelas 4 B',
    points: 30,
    isOnline: true,
  },
  // Guru
  {
    id: 'g1',
    name: 'DIDIN EKA',
    username: 'didin',
    role: 'guru',
    class: 'Kelas 5 A',
    points: 0,
  },
  {
    id: 'g2',
    name: 'BU RATNA',
    username: 'ratna',
    role: 'guru',
    class: 'Kelas 4 B',
    points: 0,
  },
  // Admin / Kepsek
  {
    id: 'a1',
    name: 'Kepala Sekolah',
    username: 'admin',
    role: 'admin',
    class: 'Kepsek',
    points: 0,
  },
];

// Today's formatted date string YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

export const INITIAL_SUBMISSIONS: Submission[] = [
  // REZA: Olahraga done today
  {
    id: 'sub-1',
    studentId: 's1',
    studentName: 'REZA',
    class: 'Kelas 5 A',
    date: today,
    habitId: 'olahraga',
    completedAt: '06:15:30',
    note: 'Sudah melakukan Senam Anak Indonesia Hebat bersama keluarga di halaman rumah!',
    photoUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    pointsEarned: 10,
    teacherVerified: true,
    teacherFeedback: 'Hebat Reza! Pertahankan semangat olahraganya!',
  },
  // REVANDITO: Bangun Pagi, Ibadah, Olahraga, Makan Sehat done today (matching screenshot 3)
  {
    id: 'sub-2',
    studentId: 's2',
    studentName: 'REVANDITO',
    class: 'Kelas 5 A',
    date: today,
    habitId: 'bangun_pagi',
    completedAt: '05:00:12',
    note: 'Bangun jam 5 pagi dan tempat tidur rapi!',
    photoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    pointsEarned: 10,
    teacherVerified: true,
  },
  {
    id: 'sub-3',
    studentId: 's2',
    studentName: 'REVANDITO',
    class: 'Kelas 5 A',
    date: today,
    habitId: 'ibadah',
    completedAt: '05:20:00',
    note: 'Sholat Subuh berjamaah di masjid',
    pointsEarned: 10,
    teacherVerified: true,
  },
  {
    id: 'sub-4',
    studentId: 's2',
    studentName: 'REVANDITO',
    class: 'Kelas 5 A',
    date: today,
    habitId: 'olahraga',
    completedAt: '06:00:00',
    note: 'Lari pagi 15 menit keliling komplek',
    photoUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    pointsEarned: 10,
    teacherVerified: true,
  },
  {
    id: 'sub-5',
    studentId: 's2',
    studentName: 'REVANDITO',
    class: 'Kelas 5 A',
    date: today,
    habitId: 'makan_sehat',
    completedAt: '06:45:00',
    note: 'Sarapan nasi goreng telur, telur mata sapi, dan buah pisang',
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    pointsEarned: 10,
    teacherVerified: true,
  },
  // Fidella cantik: Makan Sehat done today (matching screenshot 3)
  {
    id: 'sub-6',
    studentId: 's3',
    studentName: 'Fidella cantik',
    class: 'Kelas 5 A',
    date: today,
    habitId: 'makan_sehat',
    completedAt: '06:30:15',
    note: 'Sarapan roti gandum dan minum susu hangat',
    photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    pointsEarned: 10,
    teacherVerified: true,
  },
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    habitId: 'bangun_pagi',
    question: 'Apa manfaat utama dari bangun pagi dan langsung merapikan tempat tidur?',
    options: [
      'Membuat kamar jadi makin berantakan',
      'Melatih kemandirian, kedisiplinan, dan kerapian sejak pagi',
      'Bisa tidur lagi seharian',
      'Membuat terlambat ke sekolah'
    ],
    correctOptionIndex: 1,
    points: 10,
    explanation: 'Merapikan tempat tidur sendiri adalah langkah awal membangun disiplin dan tanggung jawab anak hebat!'
  },
  {
    id: 'q2',
    habitId: 'makan_sehat',
    question: 'Komponen apakah yang tergolong ke dalam makanan bergizi seimbang?',
    options: [
      'Gorengan dan minuman bersoda setiap hari',
      'Permen manis dan mie instan mentah',
      'Nasi/karbohidrat, lauk pauk protein, sayur, buah, dan air putih',
      'Chiki dan es krim berlebihan'
    ],
    correctOptionIndex: 2,
    points: 10,
    explanation: 'Makanan 4 sehat 5 sempurna dan gizi seimbang mendukung tumbuh kembang otak dan tubuh anak Indonesia!'
  },
  {
    id: 'q3',
    habitId: 'olahraga',
    question: 'Berapa durasi minimal olahraga ringan atau Senam Anak Indonesia Hebat yang dianjurkan per hari?',
    options: [
      '1 menit',
      '15 - 30 menit',
      '5 jam non-stop',
      'Tidak usah olahraga sama sekali'
    ],
    correctOptionIndex: 1,
    points: 10,
    explanation: '15 - 30 menit per hari cukup untuk menjaga kebugaran jantung, otot, dan imun tubuh!'
  }
];
