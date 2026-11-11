export interface QuizQuestion {
  id: number;
  grade: 'X' | 'XI' | 'XII';
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SAMPLE_QUIZZES: QuizQuestion[] = [
  // Kelas X
  {
    id: 1,
    grade: 'X',
    topic: 'Media Jaringan & Kabel UTP',
    question: 'Urutan warna kabel UTP standar T568B untuk pin 1 sampai pin 4 berturut-turut adalah...',
    options: [
      'Putih Oranye, Oranye, Putih Hijau, Biru',
      'Putih Hijau, Hijau, Putih Oranye, Biru',
      'Oranye, Putih Oranye, Biru, Putih Biru',
      'Putih Biru, Biru, Putih Oranye, Hijau',
    ],
    correctIndex: 0,
    explanation: 'Standar T568B berurutan: 1. Putih Oranye, 2. Oranye, 3. Putih Hijau, 4. Biru, 5. Putih Biru, 6. Hijau, 7. Putih Cokelat, 8. Cokelat.',
  },
  {
    id: 2,
    grade: 'X',
    topic: 'Alat Ukur Jaringan',
    question: 'Alat ukur yang digunakan untuk mendeteksi titik putus serat optik dan mengukur jarak patahan secara akurat adalah...',
    options: [
      'LAN Tester RJ-45',
      'Optical Time Domain Reflectometer (OTDR)',
      'Digital Multimeter',
      'Crimping Tool',
    ],
    correctIndex: 1,
    explanation: 'OTDR memancarkan pulsa cahaya laser dan menganalisis pantulan cahaya kembali (backscatter) untuk mengetahui lokasi persis gangguan atau patahan kabel.',
  },
  {
    id: 3,
    grade: 'X',
    topic: 'Perakitan Komputer',
    question: 'Komponen yang berfungsi sebagai jembatan pendingin antara heatsink dan permukaan prosesor (CPU) adalah...',
    options: [
      'Thermal Paste / Pasta Termal',
      'Liquid Nitrogen murni',
      'Silicon Pad isolator',
      'Double tape anti-panas',
    ],
    correctIndex: 0,
    explanation: 'Thermal paste mengisi rongga mikro udara mikroskopis antara permukaan prosesor dan dasar heatsink untuk memaksimalkan konduksi panas.',
  },

  // Kelas XI
  {
    id: 4,
    grade: 'XI',
    topic: 'Administrasi Sistem Jaringan',
    question: 'Pada Debian Server, file utama untuk mengatur alamat IP statis antarmuka jaringan berada pada direktori...',
    options: [
      '/etc/resolv.conf',
      '/etc/network/interfaces',
      '/var/log/syslog',
      '/etc/hosts.allow',
    ],
    correctIndex: 1,
    explanation: 'File /etc/network/interfaces adalah file konfigurasi standar Debian untuk mendefinisikan antarmuka loopback, DHCP, dan IP statis.',
  },
  {
    id: 5,
    grade: 'XI',
    topic: 'DHCP Server',
    question: 'Proses komunikasi 4 tahap pertukaran paket antara DHCP client dan server disingkat menjadi...',
    options: [
      'PING - ECHO - SYN - ACK',
      'D.O.R.A (Discover, Offer, Request, Acknowledge)',
      'TCP - UDP - ICMP - ARP',
      'HELO - EHLO - MAIL - DATA',
    ],
    correctIndex: 1,
    explanation: 'DORA: 1. DHCP Discover (broadcast cari server), 2. DHCP Offer (tawaran IP), 3. DHCP Request (klien meminta IP), 4. DHCP Acknowledge (server menyetujui).',
  },
  {
    id: 6,
    grade: 'XI',
    topic: 'Switching & VLAN',
    question: 'Protokol enkapsulasi trunking standar IEEE yang digunakan untuk menyisipkan tag VLAN ID pada frame Ethernet adalah...',
    options: [
      'IEEE 802.11ax',
      'IEEE 802.1Q (Dot1Q)',
      'IEEE 802.3ad LACP',
      'IEEE 802.1X EAP',
    ],
    correctIndex: 1,
    explanation: 'IEEE 802.1Q (Dot1Q) menambahkan header 4-byte ke frame Ethernet untuk mengidentifikasi kepemilikan VLAN (VLAN ID 1 - 4094).',
  },

  // Kelas XII
  {
    id: 7,
    grade: 'XII',
    topic: 'Routing Dinamis OSPF',
    question: 'Pada arsitektur routing dinamis OSPF, area utama yang wajib ada sebagai tulang punggung (backbone) adalah...',
    options: [
      'Area 1 Stub',
      'Area 0 (Backbone Area)',
      'Area 100 NSSA',
      'Area Virtual-Link',
    ],
    correctIndex: 1,
    explanation: 'Area 0 (Backbone) adalah pusat lalu lintas transit dalam hierarki OSPF; semua area lain harus terhubung secara langsung atau via virtual-link ke Area 0.',
  },
  {
    id: 8,
    grade: 'XII',
    topic: 'Keamanan Jaringan & Firewall',
    question: 'Dalam firewall Mikrotik RouterOS, chain yang digunakan untuk menyaring paket data yang ditujukan langsung ke router itu sendiri (seperti login Winbox atau SSH) adalah...',
    options: [
      'Chain Forward',
      'Chain Output',
      'Chain Input',
      'Chain Prerouting',
    ],
    correctIndex: 2,
    explanation: 'Chain Input memproses paket yang tujuannya adalah router itu sendiri, sedangkan Chain Forward memproses paket yang hanya melintasi (melewati) router.',
  },
];
