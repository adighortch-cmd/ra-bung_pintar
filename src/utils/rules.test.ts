import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseRPMSections,
  getTopicsForGrade,
  simulateTerminalCommand,
  calculateQuizResult,
} from './rules';

test('getTopicsForGrade returns proper curriculum for class X, XI, and XII', () => {
  const topicsX = getTopicsForGrade('X');
  assert.ok(topicsX.length >= 5);
  assert.ok(topicsX.some((t) => t.includes('Dasar-Dasar TJKT')));

  const topicsXI = getTopicsForGrade('XI');
  assert.ok(topicsXI.some((t) => t.includes('Fiber Optik')));
  assert.ok(topicsXI.some((t) => t.includes('Debian Server')));

  const topicsXII = getTopicsForGrade('XII');
  assert.ok(topicsXII.some((t) => t.includes('Routing Dinamis')));
  assert.ok(topicsXII.some((t) => t.includes('Virtualisasi Proxmox')));
});

test('parseRPMSections correctly detects structured pedagogical content', () => {
  const sampleStructured = `
1. SAPAAN:
Halo Andi! Semangat belajarnya ya.

2. PENJELASAN SINGKAT:
DHCP (Dynamic Host Configuration Protocol) adalah layanan yang membagikan IP address secara otomatis.

3. CONTOH SOAL:
Sebutkan port default yang digunakan DHCP server!

4. JAWABAN DAN PEMBAHASAN:
Port UDP 67 untuk server dan port 68 untuk client.

5. HAFALAN / RUMUS / KATA KUNCI:
D-O-R-A: Discover, Offer, Request, Acknowledge.

6. PERTANYAAN PENUTUP:
Bisa sebutkan file konfigurasi DHCP di Debian?
  `;

  const parsed = parseRPMSections(sampleStructured);
  assert.equal(parsed.isStructured, true);

  const sampleUnstructured = 'Perintah untuk melihat IP adalah ip a.';
  const parsed2 = parseRPMSections(sampleUnstructured);
  assert.equal(parsed2.isStructured, false);
});

test('simulateTerminalCommand handles standard networking commands', () => {
  const ipResult = simulateTerminalCommand('ip a');
  assert.ok(ipResult.output.includes('eth0'));
  assert.ok(ipResult.output.includes('192.168.100.2'));

  const pingResult = simulateTerminalCommand('ping 8.8.8.8');
  assert.ok(pingResult.output.includes('PING 8.8.8.8'));
  assert.ok(pingResult.output.includes('0% packet loss'));

  const restartResult = simulateTerminalCommand('systemctl restart isc-dhcp-server');
  assert.ok(restartResult.output.includes('[ OK ]'));
  assert.equal(restartResult.isCompletedGoal, true);

  const clearResult = simulateTerminalCommand('clear');
  assert.equal(clearResult.output, '__CLEAR__');
});

test('calculateQuizResult accurately scores user test answers', () => {
  const questions = [
    { id: 1, correctIndex: 2 },
    { id: 2, correctIndex: 0 },
    { id: 3, correctIndex: 1 },
    { id: 4, correctIndex: 3 },
  ];

  const userAnswersAllCorrect = { 1: 2, 2: 0, 3: 1, 4: 3 };
  const res1 = calculateQuizResult(userAnswersAllCorrect, questions);
  assert.equal(res1.score, 100);
  assert.equal(res1.correctCount, 4);

  const userAnswersHalf = { 1: 2, 2: 0, 3: 0, 4: 1 };
  const res2 = calculateQuizResult(userAnswersHalf, questions);
  assert.equal(res2.score, 50);
  assert.equal(res2.correctCount, 2);
});
