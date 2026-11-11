import { generateTroubleshootFallback } from '../src/utils/curriculumEngine';

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
    const { logText = '', osEnvironment = 'Debian Linux', studentName = 'Siswa' } = body;
    const diagnosis = generateTroubleshootFallback(studentName, osEnvironment, logText);
    res.status(200).json({ diagnosis });
  } catch {
    const diagnosis = generateTroubleshootFallback('Siswa', 'Debian Linux', '');
    res.status(200).json({ diagnosis });
  }
}
