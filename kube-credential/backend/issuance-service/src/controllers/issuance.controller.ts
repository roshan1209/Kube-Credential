import { Request, Response } from 'express';
import { issueCredential, getCredentialById } from '../services/issuance.service';

export async function issueCredentialHandler(req: Request, res: Response) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid credential payload' });
    }

    const { alreadyExisted, record, message } = await issueCredential(req.body);

    if (alreadyExisted) {
      return res.status(200).json({
        status: 'already_issued',
        id: record.id,
        issuedAt: record.issuedAt,
        workerId: record.workerId,
        message: message ?? 'credential already issued'
      });
    }

    return res.status(201).json({
      status: 'issued',
      id: record.id,
      issuedAt: record.issuedAt,
      workerId: record.workerId,
      message
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}

export async function getCredentialHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id required' });
    }
    const record = await getCredentialById(id);
    if (!record) {
      return res.status(404).json({ error: 'not found' });
    }
    return res.status(200).json(record);
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
