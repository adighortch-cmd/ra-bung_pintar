export interface LabStep {
  id: number;
  instruction: string;
  expectedCommand: string;
  explanation: string;
  hint: string;
}

export interface PracticalLab {
  id: string;
  title: string;
  grade: 'X' | 'XI' | 'XII';
  category: string;
  difficulty: 'Dasar' | 'Menengah' | 'Lanjutan';
  estimatedTime: string;
  objective: string;
  topologyDescription: string;
  steps: LabStep[];
}

export const PRACTICAL_LABS: PracticalLab[] = [
  {
    id: 'lab-debian-ip',
    title: 'Konfigurasi IP Address Statis Debian Server',
    grade: 'XI',
    category: 'Administrasi Sistem Jaringan',
    difficulty: 'Dasar',
    estimatedTime: '20 Menit',
    objective: 'Mengatur antarmuka eth0 (Internet) dan eth1 (LAN Lokal) dengan IP statis pada berkas konfigurasi Debian.',
    topologyDescription: 'Debian Server memiliki 2 kartu jaringan: eth0 terhubung ke router gateway (192.168.100.1), eth1 menjadi gateway bagi switch lab siswa (192.168.1.1/24).',
    steps: [
      {
        id: 1,
        instruction: 'Periksa daftar kartu jaringan yang tersedia di server.',
        expectedCommand: 'ip a',
        explanation: 'Perintah "ip a" menampilkan seluruh interface fisik dan logical beserta status UP/DOWN.',
        hint: 'Ketik "ip a" lalu tekan Enter.',
      },
      {
        id: 2,
        instruction: 'Buka dan periksa konfigurasi berkas network interfaces.',
        expectedCommand: 'cat /etc/network/interfaces',
        explanation: 'File /etc/network/interfaces adalah tempat penyimpanan konfigurasi IP statis maupun DHCP di Debian.',
        hint: 'Ketik "cat /etc/network/interfaces"',
      },
      {
        id: 3,
        instruction: 'Lakukan pengujian koneksi internet dari server menuju DNS Google (8.8.8.8).',
        expectedCommand: 'ping 8.8.8.8',
        explanation: 'Ping ICMP memastikan interface gateway telah meneruskan paket keluar jaringan secara normal.',
        hint: 'Ketik "ping 8.8.8.8"',
      },
    ],
  },
  {
    id: 'lab-dhcp-server',
    title: 'Instalasi & Verifikasi DHCP Server Debian',
    grade: 'XI',
    category: 'Administrasi Sistem Jaringan',
    difficulty: 'Menengah',
    estimatedTime: '25 Menit',
    objective: 'Mengaktifkan service isc-dhcp-server untuk membagikan IP otomatis pada interface eth1 ke seluruh komputer lab.',
    topologyDescription: 'Server Debian (192.168.1.1) membagikan range IP 192.168.1.10 - 192.168.1.50 dengan subnet mask 255.255.255.0 dan lease time 7200 detik.',
    steps: [
      {
        id: 1,
        instruction: 'Periksa status layanan ISC DHCP Server.',
        expectedCommand: 'systemctl status isc-dhcp-server',
        explanation: 'Memastikan service DHCP server berjalan aktif (active - running) tanpa syntax error.',
        hint: 'Ketik "systemctl status isc-dhcp-server"',
      },
      {
        id: 2,
        instruction: 'Restart layanan DHCP server setelah melakukan perubahan konfigurasi.',
        expectedCommand: 'systemctl restart isc-dhcp-server',
        explanation: 'Setiap pengeditan berkas /etc/dhcp/dhcpd.conf harus di-reload atau di-restart agar aturan baru diterapkan.',
        hint: 'Ketik "systemctl restart isc-dhcp-server"',
      },
    ],
  },
  {
    id: 'lab-mikrotik-gateway',
    title: 'Konfigurasi Mikrotik Router: IP, NAT Masquerade & Route',
    grade: 'XI',
    category: 'Administrasi Infrastruktur Jaringan',
    difficulty: 'Menengah',
    estimatedTime: '30 Menit',
    objective: 'Mengonfigurasi router Mikrotik agar klien LAN bisa mengakses internet melalui ether1 dengan NAT Masquerade.',
    topologyDescription: 'Mikrotik ether1 (Internet: 192.168.100.2/24), ether2 (Lab Siswa: 192.168.10.1/24), ether3 (Lab Guru: 192.168.20.1/24).',
    steps: [
      {
        id: 1,
        instruction: 'Periksa daftar alamat IP yang sudah terpasang di interface Mikrotik.',
        expectedCommand: '/ip address print',
        explanation: 'Menampilkan tabel IP, network, dan interface yang diasosiasikan.',
        hint: 'Ketik "/ip address print"',
      },
      {
        id: 2,
        instruction: 'Periksa konfigurasi NAT Masquerade pada firewall Mikrotik.',
        expectedCommand: '/ip firewall nat print',
        explanation: 'NAT Masquerade mentranslasikan IP privat siswa menjadi IP publik router saat menuju internet.',
        hint: 'Ketik "/ip firewall nat print"',
      },
    ],
  },
  {
    id: 'lab-firewall-security',
    title: 'Keamanan Jaringan: Firewall Filtering & Port Hardening',
    grade: 'XII',
    category: 'Keamanan Jaringan',
    difficulty: 'Lanjutan',
    estimatedTime: '35 Menit',
    objective: 'Mengamankan server dari serangan port scanning, brute force SSH, serta mengatur chain policy INPUT & FORWARD.',
    topologyDescription: 'Firewall Linux iptables dengan filter policy drop secara default untuk traffic luar yang mencurigakan.',
    steps: [
      {
        id: 1,
        instruction: 'Tampilkan seluruh aturan filter iptables saat ini beserta detail packet counter.',
        expectedCommand: 'iptables -L',
        explanation: 'Melihat status aturan Chain INPUT, FORWARD, dan OUTPUT pada tabel filter Linux.',
        hint: 'Ketik "iptables -L"',
      },
      {
        id: 2,
        instruction: 'Lakukan uji ping ke gateway untuk memastikan traffic ICMP diizinkan.',
        expectedCommand: 'ping 8.8.8.8',
        explanation: 'Uji konektivitas dasar untuk memverifikasi rule filter tidak memblokir koneksi sah.',
        hint: 'Ketik "ping 8.8.8.8"',
      },
    ],
  },
];
