import { computeCredentialId, issueCredential } from '../services/issuance.service';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'tmp-test');
const dbPath = path.join(tempDir, 'db.json');

beforeAll(async () => {
  await fs.promises.mkdir(tempDir, { recursive: true });
  process.env.DB_FILE = dbPath;
  process.env.WORKER_ID = 'worker-123';
});

afterAll(async () => {
  try { await fs.promises.rm(tempDir, { recursive: true, force: true }); } catch {}
});

it('computes stable id for same JSON with different key order', () => {
  const a = { b: 2, a: 1 };
  const b = { a: 1, b: 2 };
  expect(computeCredentialId(a)).toEqual(computeCredentialId(b));
});

it('issues a new credential then detects duplicate', async () => {
  const payload = { subject: 'alice', type: 'test', claims: { age: 30 } };
  const first = await issueCredential(payload);
  expect(first.alreadyExisted).toBe(false);
  expect(first.record.workerId).toBe('worker-123');
  const second = await issueCredential(payload);
  expect(second.alreadyExisted).toBe(true);
  expect(second.record.id).toBe(first.record.id);
});
