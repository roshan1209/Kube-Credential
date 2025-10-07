import request from 'supertest';
import { app } from '../app';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'tmp-test-controller');
const dbPath = path.join(tempDir, 'db.json');

beforeAll(async () => {
  await fs.promises.mkdir(tempDir, { recursive: true });
  process.env.DB_FILE = dbPath;
  process.env.WORKER_ID = 'worker-999';
});

afterAll(async () => {
  try { await fs.promises.rm(tempDir, { recursive: true, force: true }); } catch {}
});

it('returns 201 on first issuance and 200 on duplicate', async () => {
  const payload = { subject: 'bob', type: 'employee' };
  const first = await request(app).post('/api/issuance').send(payload).expect(201);
  expect(first.body.status).toBe('issued');
  expect(first.body.workerId).toBe('worker-999');

  const second = await request(app).post('/api/issuance').send(payload).expect(200);
  expect(second.body.status).toBe('already_issued');
  expect(second.body.workerId).toBe('worker-999');
});
