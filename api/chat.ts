import { generateRPMFallback } from '../src/utils/curriculumEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      message = '',
      studentName = 'Siswa',
      grade = 'XI',
      topic = 'Dasar-Dasar TJKT',
      chatMode = 'teori',
    } = body;

    const normalizedMode = chatMode === 'praktikum' || chatMode === 'soal' ? chatMode : 'teori';
    const reply = generateRPMFallback(studentName, grade, topic, message, normalizedMode);
    res.status(200).json({
      reply,
      modelUsed: "RA'BUNG Curriculum Engine",
    });
  } catch {
    const reply = generateRPMFallback('Siswa', 'XI', 'Dasar-Dasar TJKT', '', 'teori');
    res.status(200).json({
      reply,
      modelUsed: "RA'BUNG Curriculum Engine",
    });
  }
}
