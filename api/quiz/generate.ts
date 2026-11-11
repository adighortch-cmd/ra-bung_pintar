export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { topic = 'TJKT' } = body;

  const fallbackQuestions = [
    {
      question: `Pada konfigurasi routing ${topic}, parameter apa yang menentukan jalur terbaik dengan prioritas nilai terkecil?`,
      options: ['Administrative Distance (AD)', 'Maximum Transmission Unit (MTU)', 'Bandwidth Limit', 'Hop Count'],
      correctIndex: 0,
      explanation: 'Administrative Distance (AD) adalah nilai keandalan rute; nilai AD yang lebih kecil selalu diprioritaskan oleh tabel routing router.',
    },
    {
      question: 'Berapa subnet mask default untuk prefix /28 dalam notasi desimal bertitik?',
      options: ['255.255.255.240', '255.255.255.248', '255.255.255.224', '255.255.255.192'],
      correctIndex: 0,
      explanation: '/28 memiliki 28 bit angka 1 (11111111.11111111.11111111.11110000), yang setara dengan 255.255.255.240 dan menyisakan 14 usable IP host.',
    },
    {
      question: 'Perintah Linux untuk memonitor lalu lintas data jaringan secara real-time berdasarkan port adalah...',
      options: ['tcpdump -i eth0', 'cat /etc/hosts', 'chmod 777', 'mkdir /var/log'],
      correctIndex: 0,
      explanation: 'tcpdump adalah paket analyzer berbasis baris perintah yang sangat ampuh untuk menangkap dan menganalisis paket data jaringan di Linux.',
    },
  ];

  res.status(200).json({ questions: fallbackQuestions });
}
