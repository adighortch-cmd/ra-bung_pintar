import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateRPMFallback, generateTroubleshootFallback } from './src/utils/curriculumEngine';

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

const RPM_SYSTEM_INSTRUCTION = `Anda adalah RA'BUNG-Pintar, asisten belajar berbasis Artificial Intelligence (AI) resmi untuk siswa-siswi SMKN 3 Tana Toraja, khususnya Jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT).
Karakter Anda:
- Cerdas, berpengetahuan luas di bidang TJKT, Linux Server, Cisco, Mikrotik, Jaringan Fiber Optik, dan Cloud Computing.
- Ramah, sabar, komunikatif, suportif, dan tidak pernah menghakimi siswa.
- Menggunakan bahasa Indonesia yang mudah dipahami anak SMK (usia 15–18 tahun).
- Anda adalah tutor, mentor praktikum, dan pendamping troubleshooting laboratorium.

Format Jawaban Pembelajaran (WAJIB 6 BAGIAN bila menjelaskan materi atau teori):
1. SAPAAN: Sapa siswa dengan namanya secara antusias dan hangat.
2. PENJELASAN SINGKAT: Jelaskan konsep inti secara jelas dan analogi sederhana.
3. CONTOH SOAL: Berikan 1 contoh kasus/soal praktis di lapangan TJKT.
4. JAWABAN DAN PEMBAHASAN: Urai solusinya langkah demi langkah.
5. HAFALAN / RUMUS / KATA KUNCI: Berikan sintaks perintah esensial, tabel ringkas, atau cheat sheet.
6. PERTANYAAN PENUTUP: Berikan 1 pertanyaan tantangan reflektif untuk siswa dan kata motivasi ("Belajar Cerdas, Praktik Tuntas, Masa Depan Berkualitas!").

Untuk respon troubleshooting teknis atau pesan error terminal:
Boleh langsung format ringkas:
- DIAGNOSIS AKAR MASALAH
- ANALISIS PENYEBAB
- LANGKAH SOLUSI PERBAIKAN (sintaks perintah jelas)
- TIPS PENCEGAHAN`;

// 1. Chat endpoint with latency-budgeted AI and deterministic fallback
app.post('/api/chat', async (req, res) => {
  const {
    message = '',
    history = [],
    studentName = 'Siswa',
    grade = 'XI',
    topic = 'Dasar-Dasar TJKT',
    imageBase64,
    imageMimeType = 'image/png',
  } = req.body;

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

      const promptContext = `[Konteks Siswa: Nama="${studentName}", Kelas="${grade} TJKT", Topik="${topic}"]\n\nPertanyaan Siswa:\n${message || 'Analisis gambar jaringan ini.'}`;
      currentParts.push({ text: promptContext });
      contents.push({ role: 'user', parts: currentParts });

      const config: any = {
        systemInstruction: RPM_SYSTEM_INSTRUCTION,
      };

      // Call Gemini 3.1 Flash Lite with .catch() attached to prevent unhandled rejection
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
  const fallbackReply = generateRPMFallback(studentName, grade, topic, message);
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
3. SOLUSI PERBAIKAN (sintaks perintah terminal konkret)
4. CARA VERIFIKASI PENGUJIAN`,
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

// 3. Quiz endpoint
app.post('/api/quiz/generate', async (req, res) => {
  const { grade = 'XI', topic = 'TJKT' } = req.body;

  if (hasValidKey && ai) {
    try {
      const prompt = `Buatkan 5 soal kuis pilihan ganda untuk siswa SMK jurusan TJKT kelas ${grade} dengan topik: "${topic}".
Format JSON array:
[
  {
    "question": "Pertanyaan...",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correctIndex": 0,
    "explanation": "Penjelasan..."
  }
]`;

      const geminiPromise = ai.models
        .generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        })
        .catch(() => null);

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3500));
      const response: any = await Promise.race([geminiPromise, timeoutPromise]);

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ questions: parsed });
      }
    } catch {
      // Continue to curated fallback questions
    }
  }

  // Fallback curated questions for the grade
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

  res.json({ questions: fallbackQuestions });
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
