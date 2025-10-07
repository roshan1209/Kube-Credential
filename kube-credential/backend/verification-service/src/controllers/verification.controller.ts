import { Request, Response } from 'express';
import { verifyCredential } from '../services/verification.service';

export async function verifyCredentialHandler(req: Request, res: Response) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid credential payload' });
    }

    const result = await verifyCredential(req.body);
    if (result.valid) {
      return res.status(200).json({
        status: 'valid',
        id: result.record!.id,
        issuedAt: result.record!.issuedAt,
        workerId: result.record!.workerId
      });
    }
    return res.status(404).json({ status: 'invalid', message: 'credential not found' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
