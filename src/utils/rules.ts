/**
 * Core business and pedagogical logic for ROBO-PINTAR (RPM)
 * Unit-testable without UI or network dependencies
 */

export interface StudentProfile {
  name: string;
  grade: 'X' | 'XI' | 'XII';
  department: string; // 'TJKT'
  avatarUrl?: string;
  theme?: 'dark';
}

export interface StructuredRPMResponse {
  greeting: string;
  explanation: string;
  exampleQuestion: string;
  solutionAndDiscussion: string;
  cheatSheet: string;
  closingQuestion: string;
  isStructured: boolean;
}

/**
 * Validates or parses RPM 6-step pedagogical response structure:
 * 1. SAPAAN
 * 2. PENJELASAN SINGKAT
 * 3. CONTOH SOAL
 * 4. JAWABAN DAN PEMBAHASAN
 * 5. HAFALAN / RUMUS / KATA KUNCI
 * 6. PERTANYAAN PENUTUP
 */
export function parseRPMSections(rawText: string): StructuredRPMResponse {
  const defaultResult: StructuredRPMResponse = {
    greeting: '',
    explanation: '',
    exampleQuestion: '',
    solutionAndDiscussion: '',
    cheatSheet: '',
    closingQuestion: '',
    isStructured: false,
  };

  if (!rawText) return defaultResult;

  // Check if markers exist
  const hasGreeting = /1\.\s*SAPAAN|SAPAAN/i.test(rawText);
  const hasExplanation = /2\.\s*PENJELASAN\s*SINGKAT|PENJELASAN\s*SINGKAT/i.test(rawText);
  const hasExample = /3\.\s*CONTOH\s*SOAL|CONTOH\s*SOAL/i.test(rawText);
  const hasDiscussion = /4\.\s*JAWABAN\s*DAN\s*PEMBAHASAN|PEMBAHASAN/i.test(rawText);
  const hasCheatSheet = /5\.\s*HAFALAN|RUMUS|KATA\s*KUNCI|CHEAT\s*SHEET/i.test(rawText);
  const hasClosing = /6\.\s*PERTANYAAN\s*PENUTUP|PERTANYAAN\s*PENUTUP/i.test(rawText);

  // If at least 3 sections are found, treat as structured response
  const sectionCount = [hasGreeting, hasExplanation, hasExample, hasDiscussion, hasCheatSheet, hasClosing].filter(Boolean).length;
  const isStructured = sectionCount >= 3;

  return {
    ...defaultResult,
    isStructured,
  };
}

/**
 * Filter topics by class (X Fase E, XI Fase F, XII Fase F)
 */
export function getTopicsForGrade(grade: 'X' | 'XI' | 'XII'): string[] {
  switch (grade) {
    case 'X':
      return [
        'Dasar-Dasar TJKT & Proses Bisnis',
        'Teknologi 5G, IoT & Fiber Optik',
        'K3LH & Budaya Kerja Industri',
        'Perakitan Komputer & Hardware',
        'Instalasi OS Linux & Windows',
        'Troubleshooting Hardware PC',
        'Media Jaringan & Kabel UTP/STP',
        'Alat Ukur Jaringan (OTDR & LAN Tester)',
      ];
    case 'XI':
      return [
        'Fiber Optik & FTTH (Splicing & ODP)',
        'Wi-Fi & Hotspot Mikrotik',
        'Debian Server (SSH, FTP, Apache)',
        'DNS Server Bind9 & DHCP Server',
        'Database Server (MariaDB / MySQL)',
        'Mikrotik RouterOS: IP & NAT',
        'Switching & Konfigurasi VLAN',
        'Routing Statis & RIP/OSPF',
        'Firewall Filter & Keamanan Jaringan',
      ];
    case 'XII':
      return [
        'Routing Dinamis OSPF & BGP',
        'Keamanan Jaringan & VPN WireGuard',
        'IDS/IPS & Cyber Security Hardening',
        'Virtualisasi Proxmox & VPS Cloud',
        'Manajemen Bandwidth & QoS Simple Queue',
        'Monitoring Jaringan (The Dude / Zabbix)',
        'Produk Kreatif & Kewirausahaan Jasa ISP',
      ];
    default:
      return [];
  }
}

/**
 * Virtual Linux Debian & Mikrotik Terminal Command Simulator
 */
export interface TerminalCommandResult {
  output: string;
  isError?: boolean;
  stateChange?: Record<string, string>;
  isCompletedGoal?: boolean;
}

export function simulateTerminalCommand(
  rawCommand: string,
  currentDirectory: string = '/home/siswa',
  labContext?: { labId: string; stepIndex: number }
): TerminalCommandResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { output: '' };
  }

  // Built-in common command handling
  if (trimmed === 'clear') {
    return { output: '__CLEAR__' };
  }

  if (trimmed === 'help') {
    return {
      output: `Perintah yang tersedia dalam simulator terminal TJKT:
- ip a / ifconfig           : Melihat interface jaringan & IP
- ping <ip/host>            : Tes koneksi ICMP
- nano <file> / cat <file>  : Membaca konfigurasi berkas
- systemctl status <srv>    : Cek status service (isc-dhcp-server, bind9, apache2)
- systemctl restart <srv>   : Me-restart service server
- ip route / route -n       : Melihat tabel routing
- iptables -L -n -v         : Melihat aturan firewall
- /ip address print         : Perintah Mikrotik RouterOS
- /ip route print           : Routing Mikrotik
- pwd, ls, whoami, uname -a : Perintah dasar Linux`,
    };
  }

  if (trimmed === 'whoami') {
    return { output: 'root' };
  }

  if (trimmed === 'pwd') {
    return { output: currentDirectory };
  }

  if (trimmed === 'uname -a') {
    return { output: 'Linux debian-tjkt-smkn3 6.1.0-18-amd64 #1 SMP PREEMPT_DYNAMIC Debian GNU/Linux 12 (bookworm)' };
  }

  if (trimmed === 'ls' || trimmed === 'ls -la') {
    return {
      output: `drwxr-xr-x 4 root root 4096 Nov 11 08:30 .
drwxr-xr-x 3 root root 4096 Nov 11 08:00 ..
-rw-r--r-- 1 root root  220 Nov 11 08:15 .bashrc
drwxr-xr-x 2 root root 4096 Nov 11 08:20 network_lab
-rw-r--r-- 1 root root  512 Nov 11 08:25 notes_praktikum.txt`,
    };
  }

  if (trimmed === 'ip a' || trimmed === 'ip addr' || trimmed === 'ip address' || trimmed === 'ifconfig') {
    return {
      output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:fa:4a:12 brd ff:ff:ff:ff:ff:ff
    inet 192.168.100.2/24 brd 192.168.100.255 scope global eth0
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:1c:7b:99 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.1/24 brd 192.168.1.255 scope global eth1
       valid_lft forever preferred_lft forever`,
    };
  }

  if (trimmed.startsWith('ping')) {
    const target = trimmed.split(' ')[1] || '8.8.8.8';
    return {
      output: `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=118 time=18.4 ms
64 bytes from ${target}: icmp_seq=2 ttl=118 time=17.9 ms
64 bytes from ${target}: icmp_seq=3 ttl=118 time=19.1 ms
--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max = 17.912/18.471/19.102 ms`,
    };
  }

  if (trimmed.includes('/etc/network/interfaces')) {
    return {
      output: `# /etc/network/interfaces - SMKN 3 Tana Toraja Lab Server
auto lo
iface lo inet loopback

# WAN Interface (ke ISP / Internet)
auto eth0
iface eth0 inet static
    address 192.168.100.2
    netmask 255.255.255.0
    gateway 192.168.100.1
    dns-nameservers 8.8.8.8 1.1.1.1

# LAN Interface (ke Switch Lab Siswa)
auto eth1
iface eth1 inet static
    address 192.168.1.1
    netmask 255.255.255.0`,
    };
  }

  // Destructive command safety warning (AI Safety Rule #4)
  if (
    /rm\s+-rf\s+\//.test(trimmed) ||
    trimmed.includes('mkfs') ||
    trimmed.includes('dd if=') ||
    trimmed.includes('iptables -F') ||
    trimmed.includes('reset-configuration')
  ) {
    return {
      isError: true,
      output: `[PERINGATAN KEAMANAN RA'BUNG-PINTAR (SIMULASI)]\nPerintah "${trimmed}" berpotensi menghapus data atau memutus seluruh aturan jaringan secara permanen!\nDi lingkungan produksi nyata, selalu lakukan backup konfigurasi terlebih dahulu dan pastikan Anda berada di lab virtual yang aman.`,
    };
  }

  if (trimmed.includes('systemctl status bind9') || trimmed.includes('systemctl status named')) {
    return {
      output: `● named.service - BIND Domain Name Server (SIMULASI)
     Loaded: loaded (/lib/systemd/system/named.service; enabled)
     Active: active (running) since Mon 2026-11-11 08:20:14 WITA; 15min ago
       Docs: man:named(8)
   Main PID: 1024 (named)
     Status: "all zones loaded cleanly"`,
    };
  }

  if (trimmed.includes('systemctl status apache2') || trimmed.includes('systemctl status ssh')) {
    const srv = trimmed.includes('apache2') ? 'apache2' : 'ssh';
    return {
      output: `● ${srv}.service - ${srv === 'apache2' ? 'The Apache HTTP Server' : 'OpenBSD Secure Shell server'} (SIMULASI)
     Loaded: loaded (/lib/systemd/system/${srv}.service; enabled)
     Active: active (running) since Mon 2026-11-11 08:18:05 WITA; 18min ago
     Status: "Service ready for laboratory testing"`,
    };
  }

  if (trimmed.includes('systemctl status isc-dhcp-server')) {
    return {
      output: `● isc-dhcp-server.service - LSB: DHCP server
     Loaded: loaded (/etc/init.d/isc-dhcp-server; generated)
     Active: active (running) since Mon 2026-11-11 08:14:02 WITA; 25min ago
       Docs: man:systemd-sysv-generator(8)
    Process: 942 ExecStart=/etc/init.d/isc-dhcp-server start (code=exited, status=0/SUCCESS)
      Tasks: 1 (limit: 4652)
     Memory: 6.8M
        CPU: 124ms
     CGroup: /system.slice/isc-dhcp-server.service
             └─954 /usr/sbin/dhcpd -4 -q -cf /etc/dhcp/dhcpd.conf eth1`,
    };
  }

  if (trimmed.includes('systemctl restart') || trimmed.includes('systemctl start') || trimmed.includes('systemctl reload')) {
    const srv = trimmed.split(' ')[2] || 'service';
    return {
      output: `[ OK ] Restarting ${srv}... Service restarted successfully (Simulasi Virtual).`,
      isCompletedGoal: true,
    };
  }

  if (trimmed.startsWith('nslookup') || trimmed.startsWith('dig ')) {
    const domain = trimmed.split(' ')[1] || 'smkn3tator.sch.id';
    return {
      output: `Server:         127.0.0.1
Address:        127.0.0.1#53

Name:   ${domain}
Address: 192.168.1.1
(Hasil simulasi DNS lokal — jalankan di Debian lab nyata untuk verifikasi)`,
    };
  }

  if (trimmed.startsWith('named-checkconf') || trimmed.startsWith('apache2ctl configtest')) {
    return {
      output: `Syntax OK (Konfigurasi lolos pemeriksaan sintaks di lingkungan simulasi).`,
      isCompletedGoal: true,
    };
  }

  if (trimmed.startsWith('/ip address print') || trimmed.startsWith('ip address print')) {
    return {
      output: `Flags: X - disabled, I - invalid, D - dynamic 
 #   ADDRESS            NETWORK         INTERFACE                               
 0   192.168.100.2/24   192.168.100.0   ether1-Internet                         
 1   192.168.10.1/24    192.168.10.0    ether2-Lab-Siswa                        
 2   192.168.20.1/24    192.168.20.0    ether3-Lab-Guru`,
    };
  }

  if (trimmed.startsWith('/ip route print') || trimmed.startsWith('ip route')) {
    return {
      output: `Flags: D - DYNAMIC; A - ACTIVE; c - CONNECT, s - STATIC
 #     DST-ADDRESS        GATEWAY         DISTANCE
 0  As 0.0.0.0/0          192.168.100.1          1
   DAc 192.168.10.0/24    ether2-Lab-Siswa       0
   DAc 192.168.100.0/24   ether1-Internet        0`,
    };
  }

  if (trimmed.startsWith('/ip firewall nat print') || trimmed.startsWith('ip firewall nat print')) {
    return {
      output: `Flags: X - disabled, I - invalid, D - dynamic 
 0    chain=srcnat action=masquerade out-interface=ether1-Internet log=no`,
    };
  }

  if (trimmed.startsWith('/interface vlan print') || trimmed.startsWith('show vlan')) {
    return {
      output: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/4 - Fa0/24
10   Lab_Siswa_TJKT                   active    Fa0/2
20   Ruang_Guru                       active    Fa0/3`,
    };
  }

  if (trimmed.startsWith('iptables -L')) {
    return {
      output: `Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:ssh
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http
ACCEPT     icmp --  anywhere             anywhere             icmp echo-request

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination`,
    };
  }

  // Fallback realistic response
  return {
    output: `[SIMULASI] ${trimmed.split(' ')[0]}: dijalankan di sandbox virtual TJKT (bukan pada komputer nyata Anda).
Tip: Ketik 'help' untuk daftar perintah atau pilih langkah di panel kiri.`,
  };
}

/**
 * Quiz calculation utility
 */
export function calculateQuizResult(
  userAnswers: Record<number, number>,
  questions: Array<{ id: number; correctIndex: number }>
): { score: number; percentage: number; total: number; correctCount: number } {
  const total = questions.length;
  if (total === 0) return { score: 0, percentage: 0, total: 0, correctCount: 0 };

  let correctCount = 0;
  for (const q of questions) {
    if (userAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  }

  const percentage = Math.round((correctCount / total) * 100);
  const score = percentage;

  return {
    score,
    percentage,
    total,
    correctCount,
  };
}
