import React, { useState, useRef } from 'react';
import {
  AlertTriangle,
  Upload,
  Sparkles,
  Check,
  Copy,
  Terminal,
  Server,
  ShieldAlert,
  ArrowRight,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { StudentProfile } from '../utils/rules';

interface TroubleshooterAIViewProps {
  student: StudentProfile;
}

const ERROR_PRESETS = [
  {
    title: 'Service DHCP Failed',
    os: 'Debian 12 Server',
    log: `Job for isc-dhcp-server.service failed because the control process exited with error code.
See "systemctl status isc-dhcp-server.service" and "journalctl -xeu isc-dhcp-server.service" for details.
dhcpd[1240]: /etc/dhcp/dhcpd.conf line 22: subnet 192.168.1.0 netmask 255.255.255.0: bad subnet number/mask combination.`,
  },
  {
    title: 'Ping Destination Host Unreachable',
    os: 'Mikrotik & Cisco',
    log: `From 192.168.10.1 icmp_seq=1 Destination Host Unreachable
From 192.168.10.1 icmp_seq=2 Destination Host Unreachable
Packet Tracer: Switch port GigabitEthernet0/1 VLAN 10 is down, line protocol is down.`,
  },
  {
    title: 'Apache2 Could Not Bind Port 80',
    os: 'Debian / Ubuntu',
    log: `(98)Address already in use: AH00072: make_sock: could not bind to address [::]:80
(98)Address already in use: AH00072: make_sock: could not bind to address 0.0.0.0:80
no listening sockets available, shutting down. AH00015: Unable to open logs`,
  },
];

export const TroubleshooterAIView: React.FC<TroubleshooterAIViewProps> = ({ student }) => {
  const [osEnvironment, setOsEnvironment] = useState('Debian Linux Server');
  const [logInput, setLogInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!logInput.trim() && !uploadedImage) {
      setErrorMessage('Mohon tempelkan log error atau unggah foto screenshot.');
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);
    setDiagnosisResult(null);

    try {
      const res = await fetch('/api/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logText: logInput,
          imageBase64: uploadedImage || undefined,
          osEnvironment,
          studentName: student.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses diagnosis.');
      }

      setDiagnosisResult(data.diagnosis);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat mendiagnosis masalah.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyResult = () => {
    if (!diagnosisResult) return;
    navigator.clipboard.writeText(diagnosisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadPreset = (preset: (typeof ERROR_PRESETS)[0]) => {
    setOsEnvironment(preset.os);
    setLogInput(preset.log);
    setUploadedImage(null);
    setErrorMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              AI Diagnostic Engine & Troubleshooting TJKT
            </span>
          </div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl mt-1">
            Pusat Diagnosis Gangguan Jaringan & Server
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Unggah tangkapan layar terminal error atau tempelkan log pesan kesalahan untuk analisis akar masalah dan solusi perbaikan dari RA'BUNG-Pintar.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Input Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            {/* Environment Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Perangkat / Sistem Operasi
              </label>
              <select
                value={osEnvironment}
                onChange={(e) => setOsEnvironment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="Debian Linux Server">Debian Linux Server (11 / 12)</option>
                <option value="Mikrotik RouterOS">Mikrotik RouterOS (v6 / v7)</option>
                <option value="Cisco IOS Switch & Router">Cisco IOS Switch & Router (Packet Tracer)</option>
                <option value="Ubuntu Server">Ubuntu Server</option>
                <option value="Windows Server / Active Directory">Windows Server / Active Directory</option>
              </select>
            </div>

            {/* Error presets */}
            <div>
              <span className="text-xs text-slate-400 block mb-1.5">Contoh Masalah Umum di Lab:</span>
              <div className="flex flex-wrap gap-1.5">
                {ERROR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(p)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Error log text area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Salin & Tempel Pesan Error / Log Terminal
              </label>
              <textarea
                rows={5}
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                placeholder="Contoh: dhcpd: bad subnet number/mask combination pada /etc/dhcp/dhcpd.conf..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-slate-700/80 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-600 leading-relaxed"
              />
            </div>

            {/* Screenshot Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Unggah Screenshot / Foto Terminal
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {uploadedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 p-2 bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={uploadedImage} alt="Uploaded error" className="w-14 h-14 object-cover rounded-lg" />
                    <span className="text-xs text-emerald-400 font-medium">Foto siap dianalisis</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-4 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900 text-center transition-all flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400"
                >
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <span>Klik untuk unggah screenshot atau seret gambar ke sini</span>
                  <span className="text-[10px] text-slate-400">Mendukung PNG, JPG, WebP</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/40">
                {errorMessage}
              </p>
            )}

            {/* Action Submit */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>RA'BUNG-Pintar Sedang Menganalisis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Diagnosis Masalah dengan AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Diagnosis Result (6 cols) */}
        <div className="lg:col-span-6">
          <div className="h-full min-h-[460px] p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-sm">
                  Hasil Diagnosis & Rekomendasi Solusi
                </h3>
              </div>
              {diagnosisResult && (
                <button
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Solusi'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 mt-3 overflow-y-auto">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-full border-3 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                  <p className="text-xs text-slate-300 font-mono">
                    Memeriksa kode error, sintaks konfigurasi, dan dependensi sistem...
                  </p>
                </div>
              ) : diagnosisResult ? (
                <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {diagnosisResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400">
                  <AlertTriangle className="w-8 h-8 text-slate-400" />
                  <p className="text-xs">
                    Belum ada diagnosis. Masukkan log error di sebelah kiri lalu klik "Diagnosis Masalah dengan AI".
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
