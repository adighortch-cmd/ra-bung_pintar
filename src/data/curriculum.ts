export interface SubjectTopic {
  id: string;
  title: string;
  grade: 'X' | 'XI' | 'XII';
  phase: 'Fase E' | 'Fase F';
  category: string;
  summary: string;
  presetPrompts: string[];
}

export const CURRICULUM_DATA: SubjectTopic[] = [
  // KELAS X — FASE E (Dasar-Dasar Kejuruan TJKT)
  {
    id: 'x-bisnis',
    title: 'Proses Bisnis Bidang TJKT',
    grade: 'X',
    phase: 'Fase E',
    category: 'Dasar Kejuruan',
    summary: 'Perencanaan, analisis kebutuhan pelanggan, manajemen layanan, dan proses bisnis bidang TJKT.',
    presetPrompts: [
      'Jelaskan alur proses bisnis instalasi jaringan internet untuk kantor atau sekolah!',
      'Bagaimana cara menganalisis kebutuhan pelanggan jasa jaringan TJKT?',
    ],
  },
  {
    id: 'x-tech-future',
    title: 'Teknologi 5G, IoT, Cloud & Fiber Optik',
    grade: 'X',
    phase: 'Fase E',
    category: 'Teknologi Terkini',
    summary: 'Perkembangan teknologi 5G, Internet of Things (IoT), Cloud Computing, dan jaringan Fiber Optik.',
    presetPrompts: [
      'Jelaskan perbedaan mendasar jaringan 4G dan 5G beserta penerapannya!',
      'Bagaimana cara kerja teknologi IoT dan Cloud Computing di kehidupan sehari-hari?',
    ],
  },
  {
    id: 'x-profesi',
    title: 'Profesi & Kewirausahaan TJKT',
    grade: 'X',
    phase: 'Fase E',
    category: 'Karier & Usaha',
    summary: 'Profil profesi Network Engineer, SysAdmin, Teknisi FO, serta peluang technopreneur bidang TJKT.',
    presetPrompts: [
      'Apa saja prospek profesi dan sertifikasi karier untuk lulusan SMK TJKT?',
      'Peluang wirausaha bidang TJKT apa yang cocok dikembangkan di Tana Toraja?',
    ],
  },
  {
    id: 'x-k3lh',
    title: 'K3LH & Budaya Kerja Industri',
    grade: 'X',
    phase: 'Fase E',
    category: 'Budaya Industri',
    summary: 'Keselamatan dan kesehatan kerja (APD panjat tower/FO), ergonomi teknisi, serta budaya kerja 5R.',
    presetPrompts: [
      'Sebutkan APD wajib saat instalasi kabel fiber optik dan pemanjatan tower!',
      'Apa prosedur K3 keselamatan kerja saat merakit komputer di laboratorium?',
    ],
  },
  {
    id: 'x-hardware',
    title: 'Perakitan & Troubleshooting PC',
    grade: 'X',
    phase: 'Fase E',
    category: 'Hardware & PC',
    summary: 'Perakitan komputer, identifikasi komponen, dan troubleshooting perangkat komputer (POST/Beep BIOS).',
    presetPrompts: [
      'Bagaimana urutan langkah merakit PC dari pemasangan prosesor hingga cable management?',
      'Jelaskan arti bunyi beep BIOS dan langkah troubleshooting PC yang tidak tampil di layar!',
    ],
  },
  {
    id: 'x-instalasi-os',
    title: 'Instalasi Windows & Linux',
    grade: 'X',
    phase: 'Fase E',
    category: 'Sistem Operasi',
    summary: 'Pembuatan bootable USB, partisi GPT/MBR, instalasi sistem operasi Windows & Linux, dan driver.',
    presetPrompts: [
      'Jelaskan perbedaan skema partisi MBR dan GPT saat instalasi Windows atau Linux!',
      'Bagaimana langkah instalasi dual-boot Linux Debian/Ubuntu dengan Windows secara aman?',
    ],
  },
  {
    id: 'x-media-kabel',
    title: 'Media & Jaringan Telekomunikasi',
    grade: 'X',
    phase: 'Fase E',
    category: 'Media Transmisi',
    summary: 'Kabel UTP/STP standar EIA/TIA 568A/568B, crimping RJ-45 straight/cross, dan media nirkabel.',
    presetPrompts: [
      'Sebutkan urutan warna kabel UTP standar T568B untuk kabel straight dan cross!',
      'Apa perbedaan karakteristik kabel UTP Cat5e, Cat6, dan Fiber Optik?',
    ],
  },
  {
    id: 'x-alat-ukur',
    title: 'Penggunaan Alat Ukur Jaringan',
    grade: 'X',
    phase: 'Fase E',
    category: 'Instrumentasi',
    summary: 'Penggunaan LAN Tester, Multimeter, Optical Power Meter (OPM), VFL, dan OTDR.',
    presetPrompts: [
      'Bagaimana cara mengukur redaman kabel fiber optik menggunakan OPM dan OLS?',
      'Apa fungsi OTDR dan bagaimana cara membaca grafik redaman sambungan fiber?',
    ],
  },

  // KELAS XI — FASE F (Konsentrasi Kejuruan TJKT)
  {
    id: 'xi-fo-ftth',
    title: 'Fiber Optik & FTTH',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Jaringan Kabel & Nirkabel',
    summary: 'Infrastruktur kabel optik, fusion splicing, ODC, ODP, splitter pasif, dan topologi FTTH GPON.',
    presetPrompts: [
      'Jelaskan langkah demi langkah proses penyambungan fiber optik dengan Fusion Splicer!',
      'Apa fungsi OLT, ODC, ODP, dan ONT dalam topologi jaringan FTTH?',
    ],
  },
  {
    id: 'xi-wifi-hotspot',
    title: 'Wi-Fi, Hotspot & Kabel LAN',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Jaringan Kabel & Nirkabel',
    summary: 'Infrastruktur jaringan kabel terstruktur, frekuensi Wi-Fi 2.4/5 GHz, dan Hotspot Mikrotik.',
    presetPrompts: [
      'Bagaimana cara konfigurasi Hotspot Server di Mikrotik RouterOS untuk jaringan sekolah?',
      'Mengapa sinyal 5 GHz lebih cepat namun jangkauannya lebih pendek dibanding 2.4 GHz?',
    ],
  },
  {
    id: 'xi-debian-server',
    title: 'Linux Debian & Windows Server',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Administrasi Sistem Jaringan',
    summary: 'Instalasi Debian & Windows Server, User Management, File Sharing (Samba/SMB), dan konfigurasi IP.',
    presetPrompts: [
      'Bagaimana konfigurasi IP Address statis pada /etc/network/interfaces di Debian Server?',
      'Jelaskan cara manajemen user, group, dan File Sharing Samba di Linux Debian!',
    ],
  },
  {
    id: 'xi-layanan-server',
    title: 'SSH, FTP, Web Apache & Database',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Administrasi Sistem Jaringan',
    summary: 'Remote server SSH, transfer file FTP/SFTP, Web Server Apache2 VirtualHost, dan MariaDB/MySQL.',
    presetPrompts: [
      'Jelaskan cara instalasi dan konfigurasi Web Server Apache dengan Virtual Host di Debian!',
      'Apa perbedaan FTP dan SFTP serta bagaimana cara mengamankan akses remote SSH?',
    ],
  },
  {
    id: 'xi-dns-dhcp',
    title: 'DHCP Server & DNS Server (Bind9)',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Administrasi Infrastruktur',
    summary: 'Konfigurasi isc-dhcp-server (proses DORA), DNS Bind9 forward/reverse zone, dan verifikasi.',
    presetPrompts: [
      'Jelaskan proses 4 tahap D.O.R.A pada DHCP Server serta isi file /etc/dhcp/dhcpd.conf!',
      'Bagaimana konfigurasi zone forward dan reverse di Bind9 untuk domain smkn3tator.sch.id?',
    ],
  },
  {
    id: 'xi-mikrotik-vlan',
    title: 'Switching, VLAN & Routing Statis',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Administrasi Infrastruktur',
    summary: 'Switching manageable, VLAN IEEE 802.1Q (Access & Trunk), Mikrotik/Cisco, dan Routing Statis.',
    presetPrompts: [
      'Bagaimana cara membedakan Access Port dan Trunk Port pada konfigurasi VLAN Switch?',
      'Bagaimana cara konfigurasi Routing Statis dan NAT Masquerade di Mikrotik RouterOS?',
    ],
  },

  // KELAS XII — FASE F (Konsentrasi Kejuruan Lanjutan)
  {
    id: 'xii-routing-dinamis',
    title: 'Routing Dinamis (OSPF & BGP)',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Administrasi Infrastruktur',
    summary: 'Routing dinamis OSPF Single/Multi Area dan pengenalan BGP pada router Mikrotik dan Cisco.',
    presetPrompts: [
      'Jelaskan cara kerja routing dinamis OSPF dan perbedaannya dengan routing statis!',
      'Bagaimana langkah konfigurasi OSPF Area 0 di router Mikrotik atau Cisco IOS?',
    ],
  },
  {
    id: 'xii-firewall-security',
    title: 'Firewall, Enkripsi & VPN',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Keamanan Jaringan',
    summary: 'Firewall chain Input/Forward/Output, enkripsi SSL/TLS, dan tunneling VPN (WireGuard/OpenVPN).',
    presetPrompts: [
      'Jelaskan perbedaan chain Input, Forward, dan Output pada Firewall Mikrotik/iptables!',
      'Bagaimana konsep enkripsi dan arsitektur VPN Site-to-Site menggunakan WireGuard?',
    ],
  },
  {
    id: 'xii-ids-backup',
    title: 'IDS/IPS, Cyber Security & Backup',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Keamanan Jaringan',
    summary: 'Deteksi intrusi IDS/IPS (Snort/Suricata), mitigasi serangan lab, serta strategi Backup & Recovery.',
    presetPrompts: [
      'Apa perbedaan IDS dan IPS dalam menjaga keamanan jaringan server sekolah?',
      'Bagaimana merancang strategi Backup & Recovery server dengan aturan 3-2-1?',
    ],
  },
  {
    id: 'xii-cloud-proxmox',
    title: 'Virtualisasi, VPS & Cloud Hosting',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Layanan Jaringan & Cloud',
    summary: 'Virtualisasi Proxmox VE (KVM/LXC), manajemen VPS, Cloud Computing (IaaS/PaaS/SaaS), dan Hosting.',
    presetPrompts: [
      'Jelaskan perbedaan model layanan Cloud Computing IaaS, PaaS, dan SaaS beserta contohnya!',
      'Bagaimana membandingkan efisiensi Container LXC dengan Virtual Machine KVM di Proxmox?',
    ],
  },
  {
    id: 'xii-pkk-isp',
    title: 'Produk Kreatif & Pemasaran Jasa TJKT',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Kewirausahaan TJKT',
    summary: 'Ide bisnis bidang TJKT, analisis peluang usaha (SWOT), perencanaan produk, dan pemasaran jasa jaringan.',
    presetPrompts: [
      'Bagaimana cara menyusun analisis peluang usaha (SWOT) untuk jasa instalasi jaringan & CCTV?',
      'Buatkan perencanaan paket layanan internet dan penawaran jasa jaringan untuk UMKM!',
    ],
  },
];
