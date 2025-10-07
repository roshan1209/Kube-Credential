import request from 'supertest';
import express from 'express';
import http from 'http';
import { app as verificationApp } from '../app';
import { computeCredentialId } from '../services/verification.service';
import { CredentialRecord } from '../models/credential.model';

let server: http.Server;

beforeAll(async () => {
  const issuanceStub = express();
  issuanceStub.get('/api/issuance/:id', (req, res) => {
    const { id } = req.params;
    const record: CredentialRecord = {
      id,
      data: { stub: true },
      issuedAt: new Date().toISOString(),
      workerId: 'worker-stub'
    };
    return res.status(200).json(record);
  });

  server = http.createServer(issuanceStub);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  process.env.ISSUANCE_BASE_URL = `http://127.0.0.1:${port}`;
  process.env.WORKER_ID = 'worker-321';
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

it('verifies via fallback to issuance service', async () => {
  const payload = { subject: 'eve', type: 'guest' };
  const expectedId = computeCredentialId(payload);

  // Verify through verification service (fallback hits issuance by id)
  const verifyRes = await request(verificationApp).post('/api/verification').send(payload).expect(200);
  expect(verifyRes.body.status).toBe('valid');
  expect(verifyRes.body.id).toBe(expectedId);
});
