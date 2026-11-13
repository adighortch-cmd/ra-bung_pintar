import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Prevent unhandled rejections from crashing the process
process.on('unhandledRejection', (reason) => {
  console.log('[SafeGuard] Intercepted unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.log('[SafeGuard] Intercepted uncaught exception:', err);
});

const __dirname = import.meta.dirname || process.cwd();

const app = express();
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Helper to verify if an actual functional API key is present
const isValidApiKey = (key?: string): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  return (
    trimmed.length > 15 &&
    trimmed !== 'MY_GEMINI_API_KEY' &&
    !trimmed.startsWith('TODO') &&
    !trimmed.startsWith('YOUR_')
  );
};

const rawApiKey = process.env.GEMINI_API_KEY || '';
const hasValidKey = isValidApiKey(rawApiKey);

let ai: any = null;
if (hasValidKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: rawApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 8000,
      },
    });
  } catch {
    ai = null;
  }
}

const RPM_SYSTEM_INSTRUCTION = `Anda adalah RA'BUNG-PINTAR (RPM), asisten belajar berbasis Artificial Intelligence (AI) resmi untuk siswa-siswi SMKN 3 Tana Toraja, khususnya Jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT).

Karakter Anda:
- Cerdas, berpengetahuan luas di bidang TJKT (Kelas X Fase E, Kelas XI & XII Fase F: Kabel/Fiber Optik, Debian/Windows Server, Mikrotik, Cisco, Routing, Firewall, Proxmox/Cloud, dan PKK).
- Ramah, sabar, komunikatif, suportif, dan tidak pernah menghakimi siswa.
- Menggunakan bahasa Indonesia yang mudah dipahami siswa SMK.
- Anda berperan sebagai tutor, mentor praktikum, dan pendamping pemecahan masalah.

ATURAN KEAMANAN & KECERDASAN AI (WAJIB DIPATUHI):
1. Dilarang mengklaim telah menjalankan perintah pada komputer/perangkat fisik siswa karena Anda berjalan di web. Bedakan dengan jelas antara [INSTRUKSI] (langkah yang diketik siswa), [SIMULASI] (di simulator lab aplikasi), dan [EKSEKUSI NYATA].
2. Jangan pernah mengarang (halusinasi) output terminal, spesifikasi perangkat, atau sintaks konfigurasi yang tidak valid. Jika versi OS/perangkat belum jelas, akui dan berikan langkah verifikasi.
3. Selalu sesuaikan tingkat kesulitan dan konfigurasi dengan kelas siswa (X, XI, atau XII) dan OS/perangkat (Debian Linux, Mikrotik RouterOS, Cisco IOS, Windows Server).
4. Berikan PERINGATAN KEAMANAN sebelum menyebut perintah berisiko/destruktif (seperti rm -rf, mkfs, dd, iptables -F, atau reset-configuration) dan anjurkan backup terlebih dahulu.
5. Jangan pernah meminta password, token, kredensial pribadi, atau API key siswa.
6. Seluruh materi keamanan jaringan / cyber security hanya untuk tujuan defensif dan etis di laboratorium pendidikan.

Format Jawaban Pembelajaran (Gunakan 6 bagian berikut saat menjelaskan materi/teori/soal; boleh langsung ke poin diagnosis jika menjawab log error mendesak):
1. SAPAAN: Sapa siswa dengan namanya secara antusias dan hangat.
2. PENJELASAN SINGKAT: Jelaskan konsep inti dengan jelas dan mudah dipahami.
3. CONTOH SOAL: Berikan 1 contoh kasus/soal praktis TJKT (atau campuran PG & Esai jika Mode Latihan Soal).
4. JAWABAN DAN PEMBAHASAN: Urai solusinya langkah demi langkah beserta sintaks perintah yang benar.
5. HAFALAN / RUMUS / KATA KUNCI: Berikan rumus (boleh dengan notasi matematika), sintaks esensial, atau cheat sheet.
6. PERTANYAAN PENUTUP: Berikan 1 pertanyaan reflektif dan motto: "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;

type ChatMode = 'teori' | 'praktikum' | 'soal';

/**
 * Self-contained curriculum engine for SMKN 3 Tana Toraja TJKT (must stay inlined in server.ts for Cloud Run ESM)
 */
function generateRPMFallback(
  studentName: string,
  grade: string,
  topic: string,
  userMessage: string,
  chatMode: ChatMode = 'teori'
): string {
  const name = studentName?.trim() || 'Siswa';
  const q = (userMessage || '').toLowerCase();

  // Mode Latihan Soal (Pilihan Ganda + Esai)
  if (chatMode === 'soal') {
    return `1. SAPAAN:
Halo ${name}! Siap mengasah kemampuanmu di Mode Latihan Soal kelas ${grade} TJKT untuk topik "${topic}"? Yuk, kerjakan latihan Pilihan Ganda dan Esai berikut dengan teliti!

2. PENJELASAN SINGKAT:
Latihan ini dirancang sesuai standar kompetensi TJKT SMKN 3 Tana Toraja untuk menguji pemahaman teori dan kesiapan praktikum laboratorium pada materi ${topic}.

3. CONTOH SOAL (PILIHAN GANDA & ESAI):
**[Soal Pilihan Ganda]**
1. Dalam konfigurasi jaringan IPv4 dengan prefix \`/27\` (subnet mask \`255.255.255.224\`), berapakah jumlah alamat IP host yang dapat digunakan oleh komputer klien pada satu subnet?
   A. 14 host
   B. 30 host
   C. 62 host
   D. 254 host

**[Soal Esai Analisis]**
2. Jelaskan langkah verifikasi yang harus dilakukan teknisi TJKT jika sebuah layanan server Debian (seperti \`isc-dhcp-server\` atau \`apache2\`) gagal berjalan setelah konfigurasi diubah!

4. JAWABAN DAN PEMBAHASAN:
- **Pembahasan Soal 1 (Jawaban: B. 30 host):**
  Prefix \`/27\` menyisakan \`32 - 27 = 5\` bit untuk Host ID. Menggunakan rumus \`2^h - 2 = 2^5 - 2 = 32 - 2 = 30\` host yang valid (dikurangi 1 Network Address dan 1 Broadcast Address).
- **Pembahasan Soal 2 (Esai):**
  1) Periksa status dan log error spesifik melalui \`systemctl status <nama-service>\` atau \`journalctl -xeu <nama-service>\`.
  2) Lakukan uji sintaks file konfigurasi (misal \`dhcpd -t\` atau \`apache2ctl configtest\`).
  3) Perbaiki baris konfigurasi yang salah, simpan, lalu jalankan \`systemctl restart <nama-service>\`.

5. HAFALAN / RUMUS / KATA KUNCI:
- Rumus Host IPv4: $Host = 2^{(32 - prefix)} - 2$
- Uji Sintaks Apache: \`apache2ctl configtest\`
- Uji Sintaks BIND9: \`named-checkconf\`
- Uji Sintaks DHCP: \`dhcpd -t\`

6. PERTANYAAN PENUTUP:
Coba hitung berapa host yang tersedia untuk prefix \`/29\`, lalu tuliskan jawabanmu di kolom chat agar kita koreksi bersama!
Tetap semangat: "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // Mode Praktikum (Instruksi vs Simulasi vs Eksekusi Nyata + Safety Warning)
  if (chatMode === 'praktikum') {
    return `1. SAPAAN:
Halo ${name}! Selamat datang di Mode Praktikum RA'BUNG-PINTAR SMKN 3 Tana Toraja! Saya akan membimbing langkah demi langkah praktikum "${topic}" untuk kelas ${grade}.

2. PENJELASAN SINGKAT (INSTRUKSI & CATATAN EKSEKUSI):
> **Catatan Penting:** Sebagai asisten AI di browser, saya **tidak menjalankan perintah secara langsung** di komputer/router fisik Anda. Semua perintah di bawah adalah **panduan instruksi** yang dapat Anda uji di **Simulator Terminal Lab TJKT** atau di perangkat praktikum sekolah.

**Langkah Praktikum (${topic}):**
1. **Persiapan Lingkungan:** Pastikan Anda berada di VM Debian / Router lab (bukan perangkat produksi utama) dan sudah melakukan backup konfigurasi.
2. **Pemeriksaan Antarmuka:** Jalankan perintah pengecekan interface dan status layanan terlebih dahulu.
3. **Konfigurasi & Uji Sintaks:** Terapkan konfigurasi sesuai OS, lalu selalu uji sintaks sebelum me-restart service.
4. **Verifikasi Klien:** Uji konektivitas dari komputer klien menggunakan \`ping\` atau utilitas penguji layanan.

3. CONTOH KASUS PRAKTIKUM:
Saat mempraktikkan "${userMessage || topic}", bagaimana urutan perintah verifikasi dasar di Linux Debian sebelum dan sesudah mengubah konfigurasi jaringan?

4. JAWABAN DAN PEMBAHASAN:
\`\`\`bash
# 1. Cek IP dan status interface saat ini
ip a

# 2. Backup konfigurasi sebelum mengedit (praktik aman)
cp /etc/network/interfaces /etc/network/interfaces.bak

# 3. Verifikasi tabel routing dan uji koneksi gateway
ip route
ping -c 4 8.8.8.8
\`\`\`
> **Peringatan Keamanan:** Hindari perintah destruktif seperti \`rm -rf /\`, \`mkfs\`, atau \`iptables -F\` tanpa backup karena dapat menghapus sistem atau memutus koneksi remote secara permanen.

5. HAFALAN / RUMUS / KATA KUNCI:
- **Instruksi:** Langkah yang Anda ketik di perangkat nyata (Debian/Mikrotik/Cisco).
- **Simulasi:** Uji coba aman di tab *Praktikum Lab TJKT* aplikasi ini.
- **Verifikasi Wajib:** Selalu cek log dengan \`journalctl -xe\` bila service gagal start.

6. PERTANYAAN PENUTUP:
Sudahkah kamu mencoba mengetikkan perintah \`ip a\` atau \`systemctl status\` di tab **Praktikum Lab TJKT**? Bagikan hasil output terminalmu di sini jika ada error!
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // 1. Fiber Optik & Fusion Splicing
  if (
    q.includes('fiber') ||
    q.includes('splicer') ||
    q.includes('splicing') ||
    q.includes('ftth') ||
    q.includes('cleaver') ||
    q.includes('otdr') ||
    q.includes('opm') ||
    q.includes('odp')
  ) {
    return `1. SAPAAN:
Halo ${name}! Semangat belajarnya di bengkel jaringan fiber optik SMKN 3 Tana Toraja! Yuk, kita pelajari teknologi Fiber Optik & FTTH.

2. PENJELASAN SINGKAT:
Fiber Optik adalah media transmisi berkecepatan tinggi yang menghantarkan sinyal data dalam bentuk pulsa cahaya melalui inti kaca (core) sangat halus. Pada jaringan FTTH (Fiber To The Home), sinyal cahaya mengalir dari **OLT** (pusat ISP) -> **ODC** (kabinet distribusi) -> **ODP** (kotak pembagi di tiang dekat pelanggan) -> **ONT/Modem** di rumah.

Penyambungan permanen dua ujung core dilakukan dengan **Fusion Splicing** menggunakan panas busur listrik bertegangan tinggi setelah dikupas (*stripping*), dibersihkan alkohol isopropil 99%, dan dipotong presisi 90° dengan *Fiber Cleaver*.

3. CONTOH SOAL:
Teknisi SMKN 3 Tana Toraja melakukan pengukuran link FTTH sepanjang 2 km dengan 2 titik sambungan fusion splice dan 2 konektor SC/APC. Hitung estimasi total redaman (loss) kabel jika rugi kabel 0.35 dB/km, rugi splice 0.1 dB/titik, dan rugi konektor 0.5 dB/buah!

4. JAWABAN DAN PEMBAHASAN:
- Redaman kabel: $2 \\text{ km} \\times 0.35 \\text{ dB/km} = 0.70 \\text{ dB}$
- Redaman sambungan splice: $2 \\times 0.1 \\text{ dB} = 0.20 \\text{ dB}$
- Redaman konektor: $2 \\times 0.5 \\text{ dB} = 1.00 \\text{ dB}$
- **Total Optical Loss:** $0.70 + 0.20 + 1.00 = 1.90 \\text{ dB}$ (Sangat layak, jauh di bawah batas redaman maksimal GPON ~28 dB).

5. HAFALAN / RUMUS / KATA KUNCI:
Alat & Rumus Optical Power Budget:
- $\\text{Total Loss} = (L_{km} \\times \\alpha) + (N_{splice} \\times L_{splice}) + (N_{conn} \\times L_{conn})$
- **Stripper & Cleaver:** Pengupas & pemotong inti kaca presisi
- **OPM (Optical Power Meter):** Mengukur daya terima cahaya (dBm)
- **VFL (Visual Fault Locator):** Laser merah pendeteksi titik patah/bocor

6. PERTANYAAN PENUTUP:
Mengapa kabel fiber optik tidak boleh ditekuk melebihi batas *bending radius*-nya saat dipasang di tiang atau dinding?
Ingat motto kebanggaan kita: "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // 2. DHCP & DORA
  if (q.includes('dhcp') || q.includes('dora') || q.includes('ip pool')) {
    return `1. SAPAAN:
Halo ${name}! Keren banget kamu sudah mendalami layanan jaringan kelas ${grade} TJKT! Mari kita kupas tuntas cara kerja DHCP Server.

2. PENJELASAN SINGKAT:
DHCP (*Dynamic Host Configuration Protocol*) adalah protokol client-server yang membagikan konfigurasi IP Address, Subnet Mask, Default Gateway, dan DNS Server secara otomatis ke perangkat klien. Tanpa DHCP, teknisi harus mengatur IP statis secara manual di setiap komputer laboratorium.

3. CONTOH SOAL:
Di laboratorium komputer SMKN 3 Tana Toraja terdapat 35 unit PC klien pada subnet 192.168.10.0/24. Jika IP 192.168.10.1 dipakai router gateway dan 192.168.10.2 dipakai server, tentukan konfigurasi range DHCP pool yang aman di \`/etc/dhcp/dhcpd.conf\`!

4. JAWABAN DAN PEMBAHASAN:
\`\`\`bash
subnet 192.168.10.0 netmask 255.255.255.0 {
  range 192.168.10.10 192.168.10.50;
  option routers 192.168.10.1;
  option domain-name-servers 8.8.8.8, 1.1.1.1;
  default-lease-time 7200;
  max-lease-time 14400;
}
\`\`\`
Range 192.168.10.10–192.168.10.50 menyediakan 41 alamat IP dinamis (cukup untuk 35 PC + cadangan) tanpa menabrak IP statis router & server.

5. HAFALAN / RUMUS / KATA KUNCI:
Proses 4 Tahap **D.O.R.A**:
1. **Discover**    : Klien mengirim broadcast mencari DHCP server
2. **Offer**       : Server menawarkan sewa IP ke klien
3. **Request**     : Klien meminta resmi IP yang ditawarkan
4. **Acknowledge** : Server mengesahkan penyewaan IP
Port Jaringan: **UDP 67 (Server)** & **UDP 68 (Client)**.

6. PERTANYAAN PENUTUP:
Apa yang akan terjadi jika ada dua DHCP Server aktif sekaligus dengan konfigurasi subnet berbeda di satu switch yang sama?
Tetap semangat belajar, "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
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
Halo ${name}! Topik Virtual Local Area Network (VLAN) ini sangat krusial untuk sertifikasi jaringan kejuruan TJKT. Yuk, kita bedah bersama!

2. PENJELASAN SINGKAT:
VLAN adalah teknologi pada switch manageable yang membagi satu switch fisik menjadi beberapa jaringan lokal virtual yang terisolasi. Komputer di VLAN 10 (Ruang Guru) tidak bisa saling berkomunikasi langsung dengan komputer di VLAN 20 (Lab Siswa) tanpa melalui router, sehingga lalu lintas broadcast lebih hemat dan aman.

3. CONTOH SOAL:
Sebuah switch memiliki port Fa0/1 terhubung ke Router, port Fa0/2 terhubung ke PC Guru (VLAN 10), dan port Fa0/3 terhubung ke PC Siswa (VLAN 20). Tentukan mode port masing-masing interface!

4. JAWABAN DAN PEMBAHASAN:
- **Fa0/1:** Mode **TRUNK** (membawa banyak frame bertag IEEE 802.1Q menuju router)
- **Fa0/2:** Mode **ACCESS** VLAN 10
- **Fa0/3:** Mode **ACCESS** VLAN 20
\`\`\`bash
Switch(config)# interface fa0/1
Switch(config-if)# switchport mode trunk
Switch(config)# interface fa0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
\`\`\`

5. HAFALAN / RUMUS / KATA KUNCI:
- Standar Tagging: **IEEE 802.1Q (Dot1Q)**
- **Access Port:** Ke perangkat pengguna (PC, Printer, Access Point)
- **Trunk Port:** Antar switch atau switch ke router (*Router-on-a-Stick*)

6. PERTANYAAN PENUTUP:
Berapa rentang VLAN ID standar yang dapat digunakan pada protokol IEEE 802.1Q?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
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
Halo ${name}! Domain Name System (DNS) adalah layanan inti internet. Senang sekali melihat semangatmu mempelajarinya hari ini!

2. PENJELASAN SINGKAT:
DNS berfungsi seperti "buku telepon" jaringan. DNS menerjemahkan nama domain yang mudah diingat manusia (seperti \`smkn3tator.sch.id\`) menjadi alamat IP numerik (seperti \`192.168.10.5\`) yang dipahami oleh komputer dan router.

3. CONTOH SOAL:
Di server Debian 12 lab SMKN 3 Tana Toraja, kamu ingin domain \`portal.smk3.lan\` mengarah ke IP web server \`192.168.10.5\`. Record DNS apa yang wajib ditambahkan pada file forward zone?

4. JAWABAN DAN PEMBAHASAN:
Gunakan **Record Type A** (Address Record untuk IPv4) pada berkas zona forward Bind9:
\`\`\`bind
portal.smk3.lan.   IN   A   192.168.10.5
\`\`\`
Lalu verifikasi sintaks konfigurasi dengan \`named-checkconf\` sebelum menjalankan \`systemctl restart bind9\`.

5. HAFALAN / RUMUS / KATA KUNCI:
- **A / AAAA:** Domain ke IPv4 / IPv6
- **CNAME:** Alias ke domain lain (misal \`www\`)
- **MX:** Alamat Mail Server
- **PTR:** Reverse DNS (IP ke Domain)
- Port Default DNS: **UDP & TCP 53**

6. PERTANYAAN PENUTUP:
Perintah terminal apa di Linux yang bisa kamu gunakan untuk menguji apakah DNS lokal sudah berhasil meresolve domain sekolah?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // 5. Routing Statis vs Dinamis (OSPF, Mikrotik, Cisco)
  if (
    q.includes('routing') ||
    q.includes('ospf') ||
    q.includes('gateway') ||
    q.includes('mikrotik') ||
    q.includes('cisco') ||
    q.includes('routeros') ||
    q.includes('rip') ||
    q.includes('nat') ||
    q.includes('masquerade')
  ) {
    return `1. SAPAAN:
Halo ${name}! Materi Routing & Mikrotik/Cisco adalah skill inti seorang Network Engineer! Mari kita perdalam bersama RA'BUNG-PINTAR.

2. PENJELASAN SINGKAT:
Routing adalah proses mengarahkan paket data antar jaringan berbeda segmen melalui router:
- **Routing Statis:** Jalur ditentukan manual oleh admin, cocok untuk jaringan kecil dan stabil.
- **Routing Dinamis (OSPF/BGP):** Router bertukar informasi rute otomatis saat topologi berubah.
- **NAT Masquerade:** Mengubah IP privat klien LAN menjadi IP publik interface WAN agar klien bisa mengakses internet.

3. CONTOH SOAL:
Router Mikrotik di lab perlu menghubungkan klien LAN menuju internet melalui gateway ISP \`10.10.1.1\` dengan interface WAN \`ether1\`. Tuliskan perintah CLI RouterOS untuk default route dan NAT Masquerade!

4. JAWABAN DAN PEMBAHASAN:
\`\`\`bash
# 1. Tambahkan Default Route menuju ISP
/ip route add dst-address=0.0.0.0/0 gateway=10.10.1.1

# 2. Aktifkan NAT Masquerade pada interface WAN
/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade
\`\`\`

5. HAFALAN / RUMUS / KATA KUNCI:
- **Administrative Distance (AD):** Static = 1, OSPF = 110, RIP = 120 (makin kecil makin diprioritaskan)
- **0.0.0.0/0:** Default Route (*Gateway of Last Resort*)
- **OSPF Area 0:** Backbone Area wajib pada jaringan OSPF

6. PERTANYAAN PENUTUP:
Mengapa protokol OSPF tidak memiliki batas 15 hop seperti protokol RIP lama?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // 6. Keamanan Jaringan, Firewall, VPN, IDS/IPS & Backup
  if (
    q.includes('firewall') ||
    q.includes('vpn') ||
    q.includes('wireguard') ||
    q.includes('ids') ||
    q.includes('ips') ||
    q.includes('enkripsi') ||
    q.includes('backup') ||
    q.includes('keamanan') ||
    q.includes('cyber') ||
    q.includes('iptables')
  ) {
    return `1. SAPAAN:
Halo ${name}! Keamanan Jaringan adalah garda terdepan infrastruktur IT modern. Ingat: praktik keamanan siber harus selalu dilakukan secara etis di lingkungan laboratorium sekolah yang sah ya!

2. PENJELASAN SINGKAT:
- **Firewall (iptables / Mikrotik Filter):** Menyaring paket berdasarkan chain **INPUT** (menuju router), **FORWARD** (melintasi router), dan **OUTPUT** (keluar dari router).
- **VPN (WireGuard / OpenVPN):** Membangun terowongan (*tunnel*) terenkripsi di atas jaringan publik.
- **IDS vs IPS:** IDS mendeteksi dan memberi peringatan adanya serangan, sedangkan IPS mendeteksi sekaligus memblokir serangan secara otomatis.

3. CONTOH SOAL:
Sebuah server Debian lab ingin mengizinkan trafik SSH (port 22) hanya dari jaringan lokal sekolah \`192.168.10.0/24\` melalui \`iptables\`. Chain apa yang digunakan?

4. JAWABAN DAN PEMBAHASAN:
Karena koneksi SSH ditujukan langsung ke server Debian tersebut, gunakan chain **INPUT**:
\`\`\`bash
iptables -A INPUT -p tcp -s 192.168.10.0/24 --dport 22 -j ACCEPT
\`\`\`
> **Catatan Keamanan:** Sebelum menerapkan kebijakan default DROP atau membersihkan aturan firewall (\`iptables -F\`) di lab remote, pastikan akses SSH Anda sudah diizinkan agar tidak terkunci dari server!

5. HAFALAN / RUMUS / KATA KUNCI:
- **Chain INPUT:** Trafik menuju router/server itu sendiri
- **Chain FORWARD:** Trafik yang hanya lewat (klien LAN -> Internet)
- **Aturan Backup 3-2-1:** 3 salinan data, 2 media berbeda, 1 disimpan di lokasi terpisah (*off-site*)

6. PERTANYAAN PENUTUP:
Mengapa aturan Backup 3-2-1 sangat penting bagi administrator jaringan sebelum melakukan pemeliharaan server?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // 7. Kelas X Dasar: Kabel UTP, K3LH, Hardware, Instalasi OS, Alat Ukur, 5G/IoT
  if (
    q.includes('utp') ||
    q.includes('t568') ||
    q.includes('straight') ||
    q.includes('cross') ||
    q.includes('k3') ||
    q.includes('apd') ||
    q.includes('bios') ||
    q.includes('beep') ||
    q.includes('rakit') ||
    q.includes('windows') ||
    q.includes('mbr') ||
    q.includes('gpt') ||
    q.includes('5g') ||
    q.includes('iot')
  ) {
    return `1. SAPAAN:
Halo ${name}! Fondasi kejuruan Kelas X TJKT adalah kunci sukses menjadi teknisi andal di SMKN 3 Tana Toraja. Yuk, kita pelajari bersama!

2. PENJELASAN SINGKAT:
Dalam dasar-dasar TJKT (Fase E), setiap teknisi wajib menguasai keselamatan kerja (**K3LH**), perakitan hardware PC, instalasi sistem operasi (Windows & Linux dengan skema partisi MBR/GPT), serta pengkabelan jaringan standar **EIA/TIA 568A & 568B**.

3. CONTOH SOAL:
Kamu diminta membuat kabel jaringan UTP *Straight-Through* untuk menghubungkan PC siswa ke Switch Lab. Sebutkan urutan warna standar **T568B** dari pin 1 sampai pin 8!

4. JAWABAN DAN PEMBAHASAN:
Urutan warna kabel UTP standar **T568B** (kedua ujung sama untuk *Straight-Through*):
1. Putih Oranye (TX+)
2. Oranye (TX-)
3. Putih Hijau (RX+)
4. Biru
5. Putih Biru
6. Hijau (RX-)
7. Putih Cokelat
8. Cokelat
Setelah di-crimping ke konektor RJ-45, wajib diuji menggunakan **LAN Tester** hingga lampu LED 1–8 menyala berurutan.

5. HAFALAN / RUMUS / KATA KUNCI:
- **Straight:** PC <-> Switch / Switch <-> Router (T568B — T568B)
- **Cross-over:** PC <-> PC / Switch <-> Switch lama (T568A — T568B)
- **K3LH Tower/FO:** Wajib memakai *Full Body Harness*, helm safety, sarung tangan, dan kacamata pelindung serpihan kaca FO.

6. PERTANYAAN PENUTUP:
Apa perbedaan antara partisi harddisk **MBR** dan **GPT** saat kamu menginstal sistem operasi Windows 11 atau Linux modern?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // 8. Linux Debian Server, Apache, SSH, FTP, Cloud, Proxmox, Kewirausahaan
  if (
    q.includes('debian') ||
    q.includes('apache') ||
    q.includes('nginx') ||
    q.includes('ssh') ||
    q.includes('ftp') ||
    q.includes('linux') ||
    q.includes('systemctl') ||
    q.includes('proxmox') ||
    q.includes('cloud') ||
    q.includes('vps') ||
    q.includes('iaas') ||
    q.includes('lxc') ||
    q.includes('bisnis') ||
    q.includes('usaha') ||
    q.includes('bandwidth')
  ) {
    return `1. SAPAAN:
Halo ${name}! Kompetensi server, virtualisasi cloud, dan perencanaan layanan jaringan adalah bekal utama lulusan TJKT SMKN 3 Tana Toraja. Mari kita bahas!

2. PENJELASAN SINGKAT:
Linux Debian Server dan hypervisor seperti Proxmox VE banyak dipakai industri karena efisien, stabil, dan hemat biaya. Di sisi lain, pemahaman arsitektur Cloud (**IaaS, PaaS, SaaS**) serta perencanaan kewirausahaan jasa jaringan (perhitungan rasio bandwidth & penawaran) membantu siswa siap kerja maupun berwirausaha.

3. CONTOH SOAL:
Setelah mengedit file VirtualHost Apache di \`/etc/apache2/sites-available/smk3.conf\`, apa urutan perintah yang benar untuk mengaktifkan situs tersebut dan memverifikasi sintaks sebelum me-reload layanan?

4. JAWABAN DAN PEMBAHASAN:
\`\`\`bash
# 1. Aktifkan konfigurasi VirtualHost
a2ensite smk3.conf

# 2. Uji kebenaran sintaks konfigurasi
apache2ctl configtest

# 3. Terapkan konfigurasi tanpa memutus koneksi aktif
systemctl reload apache2
\`\`\`

5. HAFALAN / RUMUS / KATA KUNCI:
- \`systemctl status <service>\` : Memeriksa status layanan (active/failed)
- **LXC vs KVM:** LXC berbagi kernel host (sangat ringan), KVM memiliki kernel terpisah (isolasi penuh untuk OS berbeda)
- **IaaS / PaaS / SaaS:** Infrastruktur (VPS/Proxmox) / Platform (Vercel/Heroku) / Aplikasi siap pakai

6. PERTANYAAN PENUTUP:
Kapan sebaiknya seorang administrator server memilih membuat Container LXC dibanding Virtual Machine (KVM) di Proxmox?
"Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
  }

  // General 6-part response for any TJKT query
  return `1. SAPAAN:
Halo ${name}! Senang sekali bisa mendampingi belajarmu di SMKN 3 Tana Toraja pada materi "${topic}" (Kelas ${grade} TJKT). Pertanyaanmu sangat bagus!

2. PENJELASAN SINGKAT:
Dalam kejuruan TJKT kelas ${grade}, pemahaman konsep dasar dan implementasi terstruktur di laboratorium adalah kunci utama. Terkait pertanyaanmu: *"${userMessage}"*, setiap konfigurasi sistem dan jaringan (baik Linux Debian, Mikrotik RouterOS, Cisco, maupun infrastruktur kabel/FO) selalu bertumpu pada:
- Ketepatan pengalamatan IP Address dan subnetting.
- Pengaturan routing, gateway, dan tabel port layanan.
- Verifikasi berkas konfigurasi serta keamanan jaringan (K3LH & Firewall).

3. CONTOH SOAL:
Misalkan kamu diminta mengalokasikan IP jaringan sekolah pada segmen \`192.168.0.0/26\`. Hitung berapa jumlah maksimal alamat IP host yang dapat dipakai oleh komputer siswa dalam satu subnet tersebut!

4. JAWABAN DAN PEMBAHASAN:
Prefix \`/26\` memiliki subnet mask \`255.255.255.192\` (tersisa \`32 - 26 = 6\` bit Host ID).
Menggunakan rumus host valid:
$$Host = 2^{6} - 2 = 64 - 2 = 62\\text{ host}$$
Dua alamat dikecualikan karena alamat pertama (\`.0\`) adalah **Network Address** dan alamat terakhir (\`.63\`) adalah **Broadcast Address**.

5. HAFALAN / RUMUS / KATA KUNCI:
Perintah Terminal Esensial TJKT:
- \`ip a\` : Melihat antarmuka & alamat IP di Linux
- \`ping -c 4 <ip>\` : Menguji konektivitas & latensi ICMP
- \`systemctl status <service>\` : Memeriksa status layanan server Debian
- \`/ip route print\` : Menampilkan tabel routing di Mikrotik RouterOS

6. PERTANYAAN PENUTUP:
Sudahkah kamu mencoba mempraktikkannya langsung di tab **Praktikum Lab TJKT** RA'BUNG-PINTAR?
Mari kita buktikan: "Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas."`;
}

function generateTroubleshootFallback(studentName: string, osEnvironment: string, logText: string): string {
  const name = studentName?.trim() || 'Siswa';
  const log = (logText || '').toLowerCase();

  return `DIAGNOSIS TROUBLESHOOTING RA'BUNG-PINTAR:
Target Lingkungan: ${osEnvironment || 'Debian Linux'} — Siswa: ${name}

1. AKAR PENYEBAB MASALAH:
${
  log.includes('dhcp')
    ? 'Terdapat kesalahan penulisan (syntax error) pada baris subnet atau netmask di /etc/dhcp/dhcpd.conf. Nomor subnet tidak cocok dengan netmask yang ditentukan (misal memakai 192.168.1.5 alih-alih network address 192.168.1.0), atau interface belum didaftarkan pada /etc/default/isc-dhcp-server.'
    : log.includes('port 80') || log.includes('address already in use')
    ? 'Port 80 (HTTP) sudah digunakan oleh proses lain (seperti Nginx, Lighttpd, atau proses Apache lama yang belum berhenti sempurna).'
    : log.includes('bind') || log.includes('named') || log.includes('dns')
    ? 'Kemungkinan terdapat kesalahan tanda titik (trailing dot) atau titik koma (;) pada file zone /etc/bind/db.* sehingga daemon named gagal memuat zona.'
    : 'Konektivitas antarmuka jaringan terputus (DOWN), konfigurasi gateway tidak dapat dijangkau, atau aturan firewall memblokir paket yang masuk.'
}

2. LANGKAH PEMERIKSAAN AWAL:
- Periksa log detail sistem: \`journalctl -xeu <nama-service>\`
- Uji sintaks file konfigurasi sebelum menjalankan ulang layanan.
- Periksa port yang sedang aktif mendengarkan: \`ss -tulpn\`

3. SOLUSI PERBAIKAN (INSTRUKSI LAB):
${
  log.includes('dhcp')
    ? `\`\`\`bash
# 1. Uji sintaks konfigurasi DHCP terlebih dahulu
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# 2. Pastikan deklarasi subnet menggunakan network address yang valid:
# subnet 192.168.1.0 netmask 255.255.255.0 { ... }

# 3. Restart service setelah diperbaiki
systemctl restart isc-dhcp-server
\`\`\``
    : `\`\`\`bash
# 1. Cek proses yang menggunakan port 80
ss -tulpn | grep :80

# 2. Uji konfigurasi web server sebelum restart
apache2ctl configtest
systemctl restart apache2
\`\`\``
}

4. CARA VERIFIKASI PENGUJIAN:
Jalankan \`systemctl status <nama-service>\` di terminal praktikum Anda dan pastikan muncul status \`active (running)\` berwarna hijau, lalu uji dari sisi klien.`;
}

// 1. Chat endpoint with latency-budgeted AI and deterministic fallback
app.post('/api/chat', async (req, res) => {
  const {
    message = '',
    history = [],
    studentName = 'Siswa',
    grade = 'XI',
    topic = 'Dasar-Dasar TJKT',
    chatMode = 'teori',
    imageBase64,
    imageMimeType = 'image/png',
  } = req.body;

  const normalizedMode: ChatMode =
    chatMode === 'praktikum' || chatMode === 'soal' ? chatMode : 'teori';

  if (hasValidKey && ai) {
    try {
      const contents: any[] = [];
      let lastRole: 'user' | 'model' | null = null;
      for (const h of history.slice(-6)) {
        const role = h.role === 'assistant' ? 'model' : 'user';
        if (role !== lastRole && h.content && typeof h.content === 'string' && h.content.trim()) {
          contents.push({
            role,
            parts: [{ text: h.content.trim() }],
          });
          lastRole = role;
        }
      }

      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents.pop();
      }

      const currentParts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        currentParts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: cleanBase64,
          },
        });
      }

      const modeDirective =
        normalizedMode === 'praktikum'
          ? 'Mode Aktif: PRAKTIKUM (Berikan panduan praktikum step-by-step, bedakan Instruksi vs Simulasi vs Eksekusi Nyata, sertakan peringatan keamanan untuk perintah berisiko).'
          : normalizedMode === 'soal'
          ? 'Mode Aktif: LATIHAN SOAL (Berikan latihan Pilihan Ganda & Esai beserta kunci jawaban dan pembahasan lengkap).'
          : 'Mode Aktif: TEORI & MATERI (Gunakan format 6 bagian pembelajaran terstruktur).';

      const promptContext = `[Konteks Siswa: Nama="${studentName}", Kelas="${grade} TJKT", Topik="${topic}"]\n[${modeDirective}]\n\nPertanyaan Siswa:\n${message || 'Analisis gambar jaringan ini.'}`;
      currentParts.push({ text: promptContext });
      contents.push({ role: 'user', parts: currentParts });

      const config: any = {
        systemInstruction: RPM_SYSTEM_INSTRUCTION,
      };

      const geminiPromise = ai.models
        .generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config,
        })
        .catch(() => null);

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3500));
      const response: any = await Promise.race([geminiPromise, timeoutPromise]);

      if (response && response.text) {
        return res.json({
          reply: response.text,
          modelUsed: 'gemini-3.1-flash-lite',
        });
      }
    } catch {
      // Clean fallback to curriculum engine
    }
  }

  // Instant response via high-fidelity SMKN 3 Tana Toraja curriculum engine
  const fallbackReply = generateRPMFallback(studentName, grade, topic, message, normalizedMode);
  res.json({
    reply: fallbackReply,
    modelUsed: "RA'BUNG Curriculum Engine",
  });
});

// 2. Troubleshoot endpoint
app.post('/api/troubleshoot', async (req, res) => {
  const { logText = '', imageBase64, osEnvironment = 'Debian Linux', studentName = 'Siswa' } = req.body;

  if (hasValidKey && ai) {
    try {
      const parts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: 'image/png',
            data: cleanBase64,
          },
        });
      }

      parts.push({
        text: `Diagnosis Masalah TJKT untuk siswa ${studentName}.
OS/Perangkat: ${osEnvironment}
Pesan Error / Log:
${logText || '(Periksa gambar screenshot terminal di atas)'}

Berikan diagnosis terstruktur:
1. AKAR PENYEBAB MASALAH
2. LANGKAH ANALISIS AWAL
3. SOLUSI PERBAIKAN (sintaks perintah terminal konkret + peringatan keamanan bila perlu)
4. CARA VERIFIKASI PENGUJIAN (tegaskan siswa perlu menjalankan sendiri di terminal lab/simulasi)`,
      });

      const geminiPromise = ai.models
        .generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: { parts },
          config: { systemInstruction: RPM_SYSTEM_INSTRUCTION },
        })
        .catch(() => null);

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3500));
      const response: any = await Promise.race([geminiPromise, timeoutPromise]);

      if (response && response.text) {
        return res.json({ diagnosis: response.text });
      }
    } catch {
      // Continue to deterministic diagnostic response
    }
  }

  const diagnosis = generateTroubleshootFallback(studentName, osEnvironment, logText);
  res.json({ diagnosis });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: "RA'BUNG-Pintar",
    school: 'SMKN 3 Tana Toraja',
    hasApiKey: hasValidKey,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🤖 RA'BUNG-Pintar Server running on http://localhost:${port}`);
  });
}

startServer();
