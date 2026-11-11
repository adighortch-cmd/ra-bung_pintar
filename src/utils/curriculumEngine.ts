/**
 * RA'BUNG-Pintar Curriculum Engine
 * Provides deterministic, high-quality, 6-part pedagogical Indonesian responses
 * for SMKN 3 Tana Toraja TJKT curriculum (Kelas X, XI, XII).
 *
 * Runs seamlessly both in Node.js serverless functions and directly in the browser,
 * guaranteeing 100% reliability on Vercel, Netlify, Cloud Run, or offline environments.
 */

export interface CurriculumResponse {
  reply: string;
  modelUsed: string;
}

export function generateRPMFallback(
  studentName: string,
  grade: string,
  topic: string,
  userMessage: string
): string {
  const name = studentName?.trim() || 'Siswa';
  const q = (userMessage || '').toLowerCase();

  // 1. Fiber Optik & Fusion Splicing
  if (
    q.includes('fiber') ||
    q.includes('splicer') ||
    q.includes('splicing') ||
    q.includes('ftth') ||
    q.includes('cleaver') ||
    q.includes('otdr') ||
    q.includes('opm')
  ) {
    return `1. SAPAAN:
Halo ${name}! Semangat belajarnya di bengkel jaringan fiber optik SMKN 3 Tana Toraja! Yuk, kita pelajari langkah penyambungan kabel serat optik dengan Fusion Splicer.

2. PENJELASAN SINGKAT:
Fusion Splicing adalah teknik menyambungkan dua ujung inti serat optik (core) menggunakan panas busur listrik bertegangan tinggi sehingga melebur menjadi satu jalur kaca tanpa hambatan. Kualitas sambungan ditentukan oleh kebersihan potongan sudut 90 derajat yang dihasilkan alat pemotong khusus (Cleaver).

Langkah demi langkah kerja teknisi:
1. Pengupasan (Stripping): Kupas jaket pelindung luar (jacket) dan lapisan akrilat (coating) menggunakan fiber stripper hingga menyisakan inti kaca (cladding 125µm).
2. Pembersihan (Cleaning): Bersihkan inti kaca dengan tisu bebas serat (lint-free wipe) yang dibasahi alkohol isopropil 99%.
3. Pemotongan (Cleaving): Potong serat menggunakan Fiber Cleaver berpresisi tinggi dengan sudut potong sedekat mungkin ke 0 derajat.
4. Pemasangan Protection Sleeve: Pasang selongsong pelindung bakar sebelum penyambungan.
5. Penyambungan (Fusion Splicing): Letakkan kedua ujung pada V-groove mesin splicer, tutup penutup, tekan tombol SET/ARC untuk peleburan otomatis.
6. Pemanasan (Heating): Geser protection sleeve ke titik sambungan dan panaskan pada oven splicer selama ~30 detik.

3. CONTOH SOAL:
Teknisi SMKN 3 Tana Toraja sedang melakukan perbaikan kabel FO feeder yang putus. Setelah proses splicing, mesin splicer menampilkan estimasi loss sambungan sebesar 0.18 dB. Apakah hasil sambungan tersebut memenuhi standar industri untuk link FTTH? Jelaskan!

4. JAWABAN DAN PEMBAHASAN:
Hasil sambungan sebesar 0.18 dB tergolong cukup baik, namun standar kualitas terbaik (telco grade) untuk fusion splicing modern idealnya berada di bawah ≤ 0.05 dB (maksimal toleransi 0.1 dB per titik sambungan).
Rekomendasi perbaikan: Buka kembali, bersihkan V-groove, potong ulang menggunakan cleaver yang pisaunya bersih dan tajam, lalu lakukan re-splicing untuk mendapatkan redaman di bawah 0.03 dB.

5. HAFALAN / RUMUS / KATA KUNCI:
Alat Wajib Praktik FO:
- Miller Stripper : Pengupas jaket & coating kabel
- Fiber Cleaver  : Pemotong inti kaca presisi tinggi
- Fusion Splicer : Mesin las busur listrik serat optik
- OPM (Optical Power Meter) : Pengukur kuat sinyal cahaya (dBm)
- VFL (Visual Fault Locator) : Senter laser merah pencari kebocoran sinar

6. PERTANYAAN PENUTUP:
Berapa panjang gelombang standar (nanometer) yang biasanya digunakan untuk transmisi downstream internet GPON ke rumah pelanggan?
Ingat motto kebanggaan kita: "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
  }

  // 2. DHCP & DORA
  if (q.includes('dhcp') || q.includes('dora') || q.includes('ip pool')) {
    return `1. SAPAAN:
Halo ${name}! Keren banget kamu sudah mulai mendalami administrasi server jaringan kelas ${grade} TJKT! Mari kita kupas tuntas cara kerja DHCP Server.

2. PENJELASAN SINGKAT:
DHCP (Dynamic Host Configuration Protocol) adalah protokol berbasis client-server yang bertugas membagikan konfigurasi IP Address, Subnet Mask, Default Gateway, dan DNS Server secara otomatis ke seluruh perangkat komputer di jaringan LAN. Tanpa DHCP, administrator jaringan sekolah harus mendatangi setiap komputer satu per satu untuk menyetel IP statis.

3. CONTOH SOAL:
Di laboratorium komputer SMKN 3 Tana Toraja terdapat 35 unit PC klien yang terhubung ke switch lab pada subnet 192.168.10.0/24. Jika IP 192.168.10.1 digunakan sebagai gateway router dan IP 192.168.10.2 digunakan sebagai server, tentukan range IP DHCP pool yang aman untuk 35 klien tersebut!

4. JAWABAN DAN PEMBAHASAN:
Langkah penentuan pool:
- Subnet: 192.168.10.0/24 (Range total: 192.168.10.1 s.d. 192.168.10.254)
- IP Khusus Statis: 192.168.10.1 (Router) & 192.168.10.2 (Server)
- Range Pool Klien: 192.168.10.10 sampai 192.168.10.50 (Menyediakan 41 alokasi IP dinamis)
Konfigurasi pada berkas /etc/dhcp/dhcpd.conf di Debian:
\`\`\`bash
subnet 192.168.10.0 netmask 255.255.255.0 {
  range 192.168.10.10 192.168.10.50;
  option routers 192.168.10.1;
  option domain-name-servers 8.8.8.8, 1.1.1.1;
  default-lease-time 7200;
  max-lease-time 14400;
}
\`\`\`

5. HAFALAN / RUMUS / KATA KUNCI:
Proses 4 Tahap D.O.R.A:
1. Discover    : Klien mengirim broadcast mencari DHCP server
2. Offer       : Server menawarkan sewa IP kepada klien
3. Request     : Klien meminta resmi IP yang ditawarkan
4. Acknowledge : Server mengesahkan dan memberikan sewa IP

Port Jaringan: UDP Port 67 (Server) dan UDP Port 68 (Client).

6. PERTANYAAN PENUTUP:
Apa yang akan terjadi jika di dalam satu jaringan switch lokal yang sama aktif 2 unit DHCP server dengan konfigurasi IP yang berbeda?
Tetap semangat belajar, "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
  }

  // 3. VLAN & Trunking
  if (
    q.includes('vlan') ||
    q.includes('trunk') ||
    q.includes('access port') ||
    q.includes('802.1q') ||
    q.includes('inter-vlan')
  ) {
    return `1. SAPAAN:
Halo ${name}! Topik Virtual Local Area Network (VLAN) ini sangat penting untuk sertifikasi MTCNA dan CCNA kejuruan TJKT. Yuk, kita bedah bersama!

2. PENJELASAN SINGKAT:
VLAN adalah teknologi pada switch manageable yang membagi satu switch fisik menjadi beberapa jaringan lokal virtual yang terisolasi. Meskipun berada di switch fisik yang sama, komputer di VLAN 10 (misal: Ruang Guru) tidak bisa saling berkomunikasi langsung dengan komputer di VLAN 20 (misal: Ruang Siswa) sebelum melalui router.

3. CONTOH SOAL:
Sebuah switch memiliki port Fa0/1 terhubung ke Router Mikrotik, port Fa0/2 terhubung ke PC Guru (VLAN 10), dan port Fa0/3 terhubung ke PC Siswa (VLAN 20). Tentukan mode port switch untuk masing-masing interface tersebut!

4. JAWABAN DAN PEMBAHASAN:
- Port Fa0/1: Mode TRUNK (Membawa banyak tag VLAN 802.1Q menuju router)
- Port Fa0/2: Mode ACCESS dengan VLAN ID 10
- Port Fa0/3: Mode ACCESS dengan VLAN ID 20
Perintah Cisco Switch:
\`\`\`bash
Switch(config)# interface fa0/1
Switch(config-if)# switchport mode trunk
Switch(config)# interface fa0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
\`\`\`

5. HAFALAN / RUMUS / KATA KUNCI:
- Standard Tagging: IEEE 802.1Q (Dot1Q)
- Access Port : Menghubungkan switch ke perangkat end-device (PC/Printer)
- Trunk Port  : Menghubungkan switch ke switch lain atau router
- Inter-VLAN Routing: "Router-on-a-Stick" menggunakan sub-interface (contoh: eth0.10 dan eth0.20)

6. PERTANYAAN PENUTUP:
Berapa nilai maksimal VLAN ID yang dapat dikonfigurasi berdasarkan standar IEEE 802.1Q?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
  }

  // 4. DNS Server & BIND9
  if (
    q.includes('dns') ||
    q.includes('bind9') ||
    q.includes('domain') ||
    q.includes('resolv') ||
    q.includes('nslookup') ||
    q.includes('forward zone')
  ) {
    return `1. SAPAAN:
Halo ${name}! Topik Domain Name System (DNS) adalah tulang punggung internet. Senang sekali kamu mempelajarinya hari ini!

2. PENJELASAN SINGKAT:
DNS bertindak sebagai "buku telepon" internet. DNS menerjemahkan nama domain yang mudah diingat manusia (seperti smkn3tanatoraja.sch.id) menjadi deretan alamat IP numerik (seperti 103.125.40.10) yang dipahami oleh komputer dan router.

3. CONTOH SOAL:
Di server Debian 12 lab SMKN 3 Tana Toraja, kamu ditugaskan membuat record domain intranet 'portal.smk3.lan' mengarah ke IP web server 192.168.10.5. Jenis DNS record apa yang harus dibuat pada file zone forward?

4. JAWABAN DAN PEMBAHASAN:
Record yang harus dibuat adalah Type **A (Address Record)** untuk IPv4.
Konfigurasi pada berkas /etc/bind/db.smk3.lan:
\`\`\`bind
portal.smk3.lan.   IN   A   192.168.10.5
\`\`\`
Jika ingin membuat alias (misal 'www.smk3.lan'), gunakan record CNAME (Canonical Name).

5. HAFALAN / RUMUS / KATA KUNCI:
Record Penting DNS:
- A     : Hostname -> IPv4
- AAAA  : Hostname -> IPv6
- CNAME : Alias ke domain lain
- MX    : Mail Exchange (Server Email)
- NS    : Name Server resmi domain
- PTR   : Reverse DNS (IP -> Hostname)
Port Default DNS: UDP & TCP Port 53.

6. PERTANYAAN PENUTUP:
Perintah terminal apa di Linux yang paling sering kamu pakai untuk menguji resolusi DNS lokal? (nslookup, dig, atau host?)
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
  }

  // 5. Routing Statis vs Dinamis (OSPF, Mikrotik, Cisco)
  if (
    q.includes('routing') ||
    q.includes('ospf') ||
    q.includes('gateway') ||
    q.includes('mikrotik') ||
    q.includes('cisco') ||
    q.includes('routeros') ||
    q.includes('rip')
  ) {
    return `1. SAPAAN:
Halo ${name}! Luar biasa, materi routing adalah keahlian utama seorang Network Engineer! Mari kita perdalam bersama RA'BUNG-Pintar.

2. PENJELASAN SINGKAT:
Routing adalah proses meneruskan paket data dari satu jaringan ke jaringan lain yang berbeda segmen melalui router.
- **Routing Statis**: Administrator jaringan menentukan rute secara manual tabel demi tabel. Cocok untuk jaringan skala kecil yang jarang berubah.
- **Routing Dinamis**: Router saling bertukar informasi tabel routing secara otomatis menggunakan protokol seperti OSPF atau RIP. Cocok untuk jaringan skala menengah hingga enterprise.

3. CONTOH SOAL:
Router Mikrotik RB750 di lab ingin menghubungkan jaringan lokal 192.168.20.0/24 menuju internet melalui gateway ISP di 10.10.1.1. Bagaimana perintah penambahan default route di terminal RouterOS?

4. JAWABAN DAN PEMBAHASAN:
Perintah RouterOS Mikrotik:
\`\`\`bash
/ip route add dst-address=0.0.0.0/0 gateway=10.10.1.1 comment="Default Gateway Internet"
\`\`\`
Penjelasan:
- \`dst-address=0.0.0.0/0\` artinya seluruh tujuan paket di dunia yang tidak tercatat di routing table lokal akan dilempar ke gateway.
- \`gateway=10.10.1.1\` adalah IP antarmuka router modem ISP.

5. HAFALAN / RUMUS / KATA KUNCI:
Parameter Utama Routing:
- Administrative Distance (AD): Mikrotik Static = 1, OSPF = 110, RIP = 120 (Makin kecil makin dipercaya)
- Metric / Cost: Nilai bobot jalur tercepat
- 0.0.0.0/0 : Default Route ("Gateway of Last Resort")

6. PERTANYAAN PENUTUP:
Menurutmu, mengapa protokol OSPF lebih disukai dibanding RIP pada jaringan besar SMKN 3 Tana Toraja?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
  }

  // 6. Linux Debian Server (Apache, SSH, FTP, Nginx)
  if (
    q.includes('debian') ||
    q.includes('apache') ||
    q.includes('nginx') ||
    q.includes('ssh') ||
    q.includes('ftp') ||
    q.includes('linux') ||
    q.includes('systemctl')
  ) {
    return `1. SAPAAN:
Halo ${name}! Administrasi Sistem Jaringan berbasis Linux Debian adalah kompetensi inti kejuruan TJKT SMKN 3 Tana Toraja. Yuk, kita bedah tuntas!

2. PENJELASAN SINGKAT:
Linux Debian Server banyak dipilih di industri karena stabilitas dan keamanannya yang tinggi. Dalam administrasi server, seluruh konfigurasi dilakukan melalui file teks di direktori /etc/ dan layanan dikelola melalui utilitas systemd (systemctl).

3. CONTOH SOAL:
Setelah mengedit file VirtualHost Apache di \`/etc/apache2/sites-available/smk3.conf\`, apa urutan perintah yang benar untuk mengaktifkan situs tersebut dan menerapkan perubahannya tanpa mematikan koneksi server?

4. JAWABAN DAN PEMBAHASAN:
Urutan perintah yang benar:
\`\`\`bash
# 1. Aktifkan konfigurasi site
a2ensite smk3.conf

# 2. Uji kebenaran sintaks konfigurasi
apache2ctl configtest

# 3. Reload service secara aman
systemctl reload apache2
\`\`\`

5. HAFALAN / RUMUS / KATA KUNCI:
Perintah Layanan Systemd:
- \`systemctl start <service>\`   : Menyalakan layanan
- \`systemctl stop <service>\`    : Mematikan layanan
- \`systemctl restart <service>\` : Memulai ulang layanan
- \`systemctl status <service>\`  : Memeriksa status (running/failed)
- \`systemctl enable <service>\`  : Mengaktifkan autostart saat server boot

6. PERTANYAAN PENUTUP:
Apa perbedaan mendasar antara perintah \`systemctl restart\` dan \`systemctl reload\` pada web server production?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
  }

  // General 6-part response for any TJKT query
  return `1. SAPAAN:
Halo ${name}! Senang sekali bisa mendampingi belajarmu di SMKN 3 Tana Toraja pada materi ${topic}. Pertanyaanmu sangat menarik untuk dibahas!

2. PENJELASAN SINGKAT:
Dalam kejuruan TJKT kelas ${grade}, pemahaman konsep dasar dan implementasi langsung di laboratorium adalah kunci utama. ${userMessage}.
Setiap konfigurasi perangkat jaringan (baik Linux Debian, Mikrotik RouterOS, maupun Cisco) selalu membutuhkan ketelitian pada:
- Penetapan layer pengalamatan IP dan subnetting yang benar.
- Pengaturan default gateway dan tabel routing.
- Hak akses berkas dan aturan keamanan firewall.

3. CONTOH SOAL:
Misalkan kamu diminta mendokumentasikan topologi jaringan sekolah dengan alokasi IP jaringan 192.168.0.0/26. Berapa jumlah host maksimal yang dapat digunakan pada setiap subnet?

4. JAWABAN DAN PEMBAHASAN:
Prefix /26 memiliki subnet mask 255.255.255.192.
Rumus jumlah host: 2^(32 - 26) - 2 = 2^6 - 2 = 64 - 2 = 62 host per subnet.
Dua alamat tidak dapat dipakai untuk host karena:
- Alamat pertama (Host ID 0) adalah Network Address.
- Alamat terakhir (Host ID 63) adalah Broadcast Address.

5. HAFALAN / RUMUS / KATA KUNCI:
Perintah Terminal Esensial TJKT:
- \`ip a\` : Melihat interface dan IP address aktif di Linux
- \`ping -c 4 <ip>\` : Menguji konektivitas latensi ICMP
- \`systemctl status <service>\` : Memeriksa kesehatan layanan server
- \`/ip route print\` : Menampilkan tabel routing di Mikrotik

6. PERTANYAAN PENUTUP:
Sudahkah kamu mencoba mempraktikkannya langsung di tab "Praktikum Lab TJKT" RA'BUNG-Pintar?
Mari kita buktikan: "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!"`;
}

export function generateTroubleshootFallback(
  studentName: string,
  osEnvironment: string,
  logText: string
): string {
  const name = studentName?.trim() || 'Siswa';
  const log = (logText || '').toLowerCase();

  return `DIAGNOSIS TROUBLESHOOTING RA'BUNG-PINTAR:
Target: ${osEnvironment || 'Debian Linux'} untuk ${name}

1. AKAR PENYEBAB MASALAH:
${
  log.includes('dhcp')
    ? 'Terdapat kesalahan penulisan (syntax error) pada baris subnet atau netmask di /etc/dhcp/dhcpd.conf. Nomor subnet tidak cocok dengan netmask yang ditentukan (misal menggunakan 192.168.1.5 bukannya network address 192.168.1.0).'
    : log.includes('port 80') || log.includes('address already in use')
    ? 'Port 80 (HTTP) telah digunakan oleh proses lain (kemungkinan Nginx, Lighttpd, atau instance Apache lama yang menggantung).'
    : 'Konektivitas antarmuka jaringan terputus (down), konfigurasi gateway tidak tercapai, atau aturan firewall memblokir paket.'
}

2. LANGKAH PEMERIKSAAN AWAL:
- Cek status log mendalam: \`journalctl -xeu <service-name>\`
- Verifikasi syntax berkas konfigurasi sebelum menjalankan service.
- Periksa port yang aktif: \`netstat -tlpn\` atau \`ss -tulpn\`.

3. SOLUSI PERBAIKAN:
${
  log.includes('dhcp')
    ? `Jalankan perintah berikut:
\`\`\`bash
# Edit file konfigurasi DHCP
nano /etc/dhcp/dhcpd.conf

# Pastikan deklarasi subnet menggunakan network address:
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.10 192.168.1.50;
    option routers 192.168.1.1;
}

# Simpan lalu restart service
systemctl restart isc-dhcp-server
\`\`\``
    : `\`\`\`bash
# Periksa port yang bertabrakan
lsof -i :80
# Matikan proses yang menghambat lalu start kembali
systemctl restart apache2
\`\`\``
}

4. CARA VERIFIKASI PENGUJIAN:
Jalankan \`systemctl status <service>\` dan pastikan berwarna hijau dengan status \`active (running)\`. Lakukan tes koneksi klien via \`ping\` atau akses browser lokal.`;
}
