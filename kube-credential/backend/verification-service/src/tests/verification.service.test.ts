import { computeCredentialId, verifyCredential } from '../services/verification.service';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'tmp-test-v');
const dbPath = path.join(tempDir, 'db.json');

beforeAll(async () => {
  await fs.promises.mkdir(tempDir, { recursive: true });
  process.env.DB_FILE = dbPath;
});

afterAll(async () => {
  try { await fs.promises.rm(tempDir, { recursive: true, force: true }); } catch {}
});

it('computes stable id for same JSON with different key order', () => {
  const a = { b: 2, a: 1 };
  const b = { a: 1, b: 2 };
  expect(computeCredentialId(a)).toEqual(computeCredentialId(b));
});

it('returns invalid when not found locally and no fallback', async () => {
  const payload = { subject: 'charlie', level: 3 };
  const res = await verifyCredential(payload);
  expect(res.valid).toBe(false);
});
