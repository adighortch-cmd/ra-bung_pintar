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
  // KELAS X - FASE E
  {
    id: 'x-bisnis',
    title: 'Proses Bisnis Bidang TJKT',
    grade: 'X',
    phase: 'Fase E',
    category: 'Dasar Kejuruan',
    summary: 'Perencanaan, analisis kebutuhan pelanggan, strategi bisnis jasa telekomunikasi, dan etika profesi.',
    presetPrompts: [
      'Jelaskan alur proses bisnis instalasi jaringan internet untuk kantor kecil!',
      'Apa saja peluang wirausaha bagi lulusan TJKT di Tana Toraja?',
    ],
  },
  {
    id: 'x-tech-future',
    title: 'Perkembangan 5G, IoT, Cloud & Fiber Optik',
    grade: 'X',
    phase: 'Fase E',
    category: 'Teknologi Terkini',
    summary: 'Evolusi jaringan seluler 5G, smart home IoT, cloud computing, dan serat optik kecepatan tinggi.',
    presetPrompts: [
      'Jelaskan perbedaan mendasar jaringan 4G dan 5G beserta penerapannya!',
      'Bagaimana cara kerja teknologi IoT dan sensor dalam monitoring jaringan?',
    ],
  },
  {
    id: 'x-k3lh',
    title: 'K3LH & Budaya Kerja Industri',
    grade: 'X',
    phase: 'Fase E',
    category: 'Budaya Industri',
    summary: 'Keselamatan dan kesehatan kerja, APD panjat tower, ergonomi teknisi, dan standar 5R (Ringkas, Rapi, Resik, Rawat, Rajin).',
    presetPrompts: [
      'Sebutkan APD wajib saat instalasi kabel fiber optik di tiang luar!',
      'Apa prosedur K3 keselamatan kerja saat merakit PC dan menyolder komponen?',
    ],
  },
  {
    id: 'x-hardware',
    title: 'Perakitan & Troubleshooting Komputer',
    grade: 'X',
    phase: 'Fase E',
    category: 'Hardware',
    summary: 'Komponen motherboard, prosesor, RAM, power supply, instalasi sistem operasi, dan diagnosis bunyi beep BIOS.',
    presetPrompts: [
      'Jelaskan arti kode bunyi beep 1 kali panjang 2 kali pendek pada motherboard AMI BIOS!',
      'Bagaimana urutan langkah merakit PC dari pemasangan prosesor hingga cable management?',
    ],
  },
  {
    id: 'x-media-kabel',
    title: 'Media Jaringan & Pengkabelan UTP/STP',
    grade: 'X',
    phase: 'Fase E',
    category: 'Media Transmisi',
    summary: 'Standar EIA/TIA 568A dan 568B, crimping kabel straight & cross, attenuation, dan penggunaan LAN tester.',
    presetPrompts: [
      'Sebutkan urutan warna kabel UTP standar T568B untuk kabel straight!',
      'Kapan kita menggunakan kabel cross-over dan kapan kabel straight-through?',
    ],
  },
  {
    id: 'x-alat-ukur',
    title: 'Penggunaan Alat Ukur Jaringan',
    grade: 'X',
    phase: 'Fase E',
    category: 'Instrumentasi',
    summary: 'Pengoperasian Optical Time Domain Reflectometer (OTDR), Optical Power Meter (OPM), Visual Fault Locator (laser pen), dan Multimeter.',
    presetPrompts: [
      'Bagaimana cara mengukur redaman kabel fiber optik menggunakan OPM dan OLS?',
      'Berapa standar redaman (dB) yang baik untuk link fiber optik FTTH?',
    ],
  },

  // KELAS XI - FASE F
  {
    id: 'xi-fo-ftth',
    title: 'Teknologi Fiber Optik & FTTH',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Jaringan Kabel & Nirkabel',
    summary: 'Struktur core/cladding serat optik, teknik fusion splicing, ODC, ODP, splitter pasif, dan ONT pelanggan.',
    presetPrompts: [
      'Jelaskan langkah demi langkah proses penyambungan fiber optik dengan Fusion Splicer!',
      'Apa fungsi Optical Distribution Point (ODP) dalam topologi FTTH GPON?',
    ],
  },
  {
    id: 'xi-wifi-hotspot',
    title: 'Wi-Fi & Hotspot Mikrotik',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Jaringan Nirkabel',
    summary: 'Frekuensi 2.4 GHz vs 5 GHz, keamanan WPA3, setup Captive Portal Hotspot Mikrotik, dan User Manager.',
    presetPrompts: [
      'Bagaimana cara konfigurasi Hotspot Server di Mikrotik RouterOS untuk voucher sekolah?',
      'Mengapa sinyal 5 GHz memiliki throughput lebih tinggi tapi jangkauan lebih pendek dari 2.4 GHz?',
    ],
  },
  {
    id: 'xi-debian-server',
    title: 'Administrasi Linux Debian Server',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Sistem Jaringan',
    summary: 'Instalasi Debian minimal, manajemen repository, konfigurasi IP `/etc/network/interfaces`, SSH remote, FTP vs SFTP, Apache2 web server.',
    presetPrompts: [
      'Bagaimana konfigurasi IP Address statis pada file /etc/network/interfaces di Debian 12?',
      'Jelaskan cara instalasi dan konfigurasi Web Server Apache dengan Virtual Host di Debian!',
    ],
  },
  {
    id: 'xi-dns-dhcp',
    title: 'DNS Server Bind9 & DHCP Server',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Sistem Jaringan',
    summary: 'Konfigurasi isc-dhcp-server (range, lease time), bind9 domain forwarding & reverse lookup zone, dan pengujian nslookup/dig.',
    presetPrompts: [
      'Jelaskan arti proses D.O.R.A pada DHCP Server secara runtut!',
      'Bagaimana konfigurasi zone forward dan zone reverse di Bind9 untuk domain sekolah.sch.id?',
    ],
  },
  {
    id: 'xi-mikrotik-vlan',
    title: 'Switching & Konfigurasi VLAN',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Infrastruktur Jaringan',
    summary: 'Konsep Virtual LAN (802.1Q), Trunking vs Access port, VLAN filtering pada RouterOS & Switch manageable.',
    presetPrompts: [
      'Apa keuntungan menggunakan VLAN dibandingkan memisahkan switch secara fisik?',
      'Bagaimana konfigurasi Router on a Stick (sub-interface) untuk routing antar VLAN?',
    ],
  },
  {
    id: 'xi-routing-statis',
    title: 'Routing Statis & Mikrotik Gateway',
    grade: 'XI',
    phase: 'Fase F',
    category: 'Infrastruktur Jaringan',
    summary: 'Tabel routing, default gateway 0.0.0.0/0, routing static multi-hop, dan NAT Masquerade ke internet.',
    presetPrompts: [
      'Bagaimana cara menambahkan default route di Mikrotik via CLI (/ip route add)?',
      'Mengapa NAT Masquerade diperlukan agar klien LAN bisa mengakses internet publik?',
    ],
  },

  // KELAS XII - FASE F
  {
    id: 'xii-routing-dinamis',
    title: 'Routing Dinamis OSPF & BGP',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Infrastruktur Lanjutan',
    summary: 'Algoritma link-state OSPF, pembagian Area 0 Backbone, router ID, metric cost, dan dasar peering BGP antas-AS.',
    presetPrompts: [
      'Jelaskan cara kerja routing dinamis OSPF dan keunggulannya dibanding routing statis!',
      'Bagaimana cara konfigurasi OSPF Single Area di Mikrotik RouterOS?',
    ],
  },
  {
    id: 'xii-firewall-security',
    title: 'Firewall & Keamanan Jaringan',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Keamanan Jaringan',
    summary: 'Chain Input, Forward, Output pada iptables & Mikrotik, pencegahan brute force SSH, DoS protection, dan port scanning detection.',
    presetPrompts: [
      'Jelaskan perbedaan filter rule chain Forward dan chain Input pada firewall Mikrotik!',
      'Bagaimana cara membuat rule firewall untuk memblokir ping ICMP dari luar tapi mengizinkan dari LAN?',
    ],
  },
  {
    id: 'xii-vpn-wireguard',
    title: 'VPN (WireGuard & OpenVPN)',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Keamanan Jaringan',
    summary: 'Enkripsi data, tunneling site-to-site dan client-to-site, konfigurasi modern WireGuard pada Linux & Mikrotik.',
    presetPrompts: [
      'Mengapa protokol VPN WireGuard jauh lebih cepat dan ringan dibanding IPSec/OpenVPN lama?',
      'Bagaimana arsitektur VPN Site-to-Site untuk menghubungkan 2 kantor cabang sekolah?',
    ],
  },
  {
    id: 'xii-cloud-proxmox',
    title: 'Virtualisasi Proxmox & Cloud Computing',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Layanan Cloud',
    summary: 'Type-1 Hypervisor Proxmox VE, KVM vs LXC Container, backup otomatis, clustering, dan manajemen VPS.',
    presetPrompts: [
      'Jelaskan perbedaan performa antara Container LXC dengan Virtual Machine (KVM) di Proxmox!',
      'Bagaimana cara membuat bridge network (vmbr0) di Proxmox agar VM mendapat IP dari router fisik?',
    ],
  },
  {
    id: 'xii-pkk-isp',
    title: 'Produk Kreatif & Bisnis Jasa Jaringan',
    grade: 'XII',
    phase: 'Fase F',
    category: 'Kewirausahaan TJKT',
    summary: 'Rancangan usaha jasa internet (ISP mini/RT RW Net legal), kalkulasi bandwidth rasio, penawaran harga, dan SOP layanan pelanggan.',
    presetPrompts: [
      'Bagaimana cara menghitung kebutuhan bandwidth untuk sekolah dengan 200 pengguna aktif?',
      'Buatkan draf penawaran jasa instalasi jaringan LAN dan hotspot sekolah yang profesional!',
    ],
  },
];
