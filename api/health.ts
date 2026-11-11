export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    appName: "RA'BUNG-Pintar",
    school: 'SMKN 3 Tana Toraja',
    platform: 'Vercel / Cloud Run Serverless',
    timestamp: new Date().toISOString(),
  });
}
