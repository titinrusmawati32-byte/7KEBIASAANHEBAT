import { Habit } from '../types';

export const HABITS: Habit[] = [
  {
    id: 'bangun_pagi',
    number: 1,
    title: 'Bangun Pagi',
    shortTitle: 'Bangun Pagi',
    emoji: '🌅',
    bgColor: '#fef08a', // light yellow
    cardBg: '#fef9c3',
    btnBg: '#eab308',
    timeRange: '04:30 - 06:00 WIB',
    description: 'Bangun tidur tepat waktu di pagi hari, merapikan tempat tidur sendiri, dan menghirup udara segar pagi.',
    guidance: [
      'Bangun sebelum jam 06.00 pagi tanpa bermalas-malasan',
      'Merapikan seprai, bantal, dan selimut sendiri',
      'Minum segelas air putih hangat'
    ],
    tips: 'Bangun pagi membuat tubuh segar, pikiran jernih, dan tidak terburu-buru berangkat sekolah!',
    photoRequired: true,
  },
  {
    id: 'ibadah',
    number: 2,
    title: 'Beribadah',
    shortTitle: 'Ibadah',
    emoji: '🕌',
    bgColor: '#bae6fd', // light sky blue
    cardBg: '#e0f2fe',
    btnBg: '#0284c7',
    timeRange: 'Sesuai Waktu Ibadah',
    description: 'Melaksanakan ibadah tepat waktu sesuai dengan agama dan kepercayaan masing-masing.',
    guidance: [
      'Sholat Subuh / Berdoa pagi sesuai keyakinan',
      'Membaca kitab suci / Al-Qur\'an / Doa harian',
      'Mengucapkan syukur atas berkah hari ini'
    ],
    tips: 'Beribadah memupuk ketenangan hati, kejujuran, dan akhlak mulia.',
    photoRequired: false,
  },
  {
    id: 'olahraga',
    number: 3,
    title: 'Berolahraga',
    shortTitle: 'Olahraga',
    emoji: '🏃',
    bgColor: '#bbf7d0', // light green / teal
    cardBg: '#dcfce7',
    btnBg: '#16a34a',
    timeRange: '15 - 30 Menit',
    description: 'Melakukan gerak tubuh, Senam Anak Indonesia Hebat, atau olahraga ringan untuk menjaga kebugaran jasmani.',
    guidance: [
      'Melakukan peregangan otot',
      'Mengikuti gerakan Senam Anak Indonesia Hebat',
      'Jalan sehat, bersepeda, atau bermain bola'
    ],
    tips: 'Tubuh yang sehat dan kuat membuat belajar jadi lebih bersemangat!',
    photoRequired: true,
  },
  {
    id: 'makan_sehat',
    number: 4,
    title: 'Makan Sehat',
    shortTitle: 'Makan Sehat',
    emoji: '🍎',
    bgColor: '#fecdd3', // light pink/red
    cardBg: '#ffe4e6',
    btnBg: '#e11d48',
    timeRange: 'Sarapan & Makan Siang',
    description: 'Mengonsumsi makanan bergizi seimbang (nasi, lauk pauk, sayur, buah, dan air putih secukupnya).',
    guidance: [
      'Sarapan sehat sebelum berangkat sekolah',
      'Memilih cemilan bergizi (buah-buahan / susu)',
      'Mencuci tangan dengan sabun sebelum & sesudah makan'
    ],
    tips: 'Gizi seimbang menjadi bahan bakar otak untuk berpikir cepat!',
    photoRequired: true,
  },
  {
    id: 'gemar_belajar',
    number: 5,
    title: 'Gemar Belajar',
    shortTitle: 'Gemar Belajar',
    emoji: '📖',
    bgColor: '#e9d5ff', // light purple
    cardBg: '#f3e8ff',
    btnBg: '#9333ea',
    timeRange: '30 - 60 Menit',
    description: 'Membaca buku pengetahuan/cerita, mengerjakan tugas sekolah (PR), atau mempelajari hal bermanfaat baru.',
    guidance: [
      'Membaca buku literasi minimal 15 menit',
      'Mengerjakan PR dan mengulang pelajaran esok hari',
      'Menanyakan hal yang belum dipahami kepada guru/orang tua'
    ],
    tips: 'Membaca adalah jendela dunia. Semakin rajin belajar, semakin dekat dengan cita-cita!',
    photoRequired: false,
  },
  {
    id: 'bermasyarakat',
    number: 6,
    title: 'Bermasyarakat',
    shortTitle: 'Bermasyarakat',
    emoji: '🤝',
    bgColor: '#ccfbf1', // light teal
    cardBg: '#f0fdf4',
    btnBg: '#0d9488',
    timeRange: 'Fleksibel',
    description: 'Membantu orang tua di rumah, bersikap sopan santun, bergotong-royong, atau membantu teman.',
    guidance: [
      'Membantu menyapu rumah atau mencuci piring sendiri',
      'Mengucapkan 3 Kata Ajaib: Maaf, Tolong, dan Terima Kasih',
      'Menjaga kebersihan lingkungan rumah & sekolah'
    ],
    tips: 'Anak hebat adalah anak yang santun, peduli, dan suka menolong sesama!',
    photoRequired: false,
  },
  {
    id: 'tidur_cepat',
    number: 7,
    title: 'Tidur Cepat',
    shortTitle: 'Tidur Cepat',
    emoji: '😴',
    bgColor: '#ddd6fe', // light indigo/violet
    cardBg: '#ede9fe',
    btnBg: '#4f46e5',
    timeRange: '20:00 - 21:00 WIB (Malam Hari)',
    description: 'Mati lampu kamar, jauhkan gadget, dan tidur tepat waktu agar istirahat cukup (minimal 8 jam).',
    guidance: [
      'Mencuci kaki & menggosok gigi sebelum tidur',
      'Mematikan HP / layar gadget 30 menit sebelum tidur',
      'Tidur paling lambat pukul 21.00 WIB'
    ],
    tips: 'Tidur cukup memulihkan stamina dan menjaga pertumbuhan tubuh ideal.',
    photoRequired: false,
  },
];
