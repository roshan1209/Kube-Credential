import request from 'supertest';
import { app } from '../app';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'tmp-test-controller-v');
const dbPath = path.join(tempDir, 'db.json');

beforeAll(async () => {
  await fs.promises.mkdir(tempDir, { recursive: true });
  process.env.DB_FILE = dbPath;
});

afterAll(async () => {
  try { await fs.promises.rm(tempDir, { recursive: true, force: true }); } catch {}
});

it('returns 404 when not found', async () => {
  const payload = { subject: 'dave', type: 'role' };
  const res = await request(app).post('/api/verification').send(payload).expect(404);
  expect(res.body.status).toBe('invalid');
});
