import crypto from 'crypto';
import path from 'path';
import { ensureDataFile, readJson } from '../utils/db';
import { getWorkerId } from '../utils/worker';
import { CredentialRecord, StoredDbShape, VerifyResult } from '../models/credential.model';

function getDbFilePath(): string {
  const dbFile = process.env.DB_FILE || path.join(process.cwd(), 'data', 'credentials.json');
  return dbFile;
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, sortObject(v)] as const);
    return Object.fromEntries(entries);
  }
  return value;
}

export function computeCredentialId(payload: unknown): string {
  const canonical = JSON.stringify(sortObject(payload));
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

export async function getCredentialById(id: string): Promise<CredentialRecord | null> {
  const dbPath = getDbFilePath();
  await ensureDataFile(dbPath);
  const db = (await readJson<StoredDbShape>(dbPath)) || { credentials: {} };
  return db.credentials[id] ?? null;
}

export async function verifyCredential(payload: unknown): Promise<VerifyResult> {
  const id = computeCredentialId(payload);
  let record = await getCredentialById(id);
  if (record) {
    return { valid: true, record };
  }

  const base = process.env.ISSUANCE_BASE_URL;
  if (base) {
    try {
      const resp = await fetch(`${base.replace(/\/$/, '')}/api/issuance/${id}`);
      if (resp.ok) {
        const data = (await resp.json()) as CredentialRecord;
        record = data;
        return { valid: true, record };
      }
    } catch {
      // ignore network errors; fall through to invalid
    }
  }

  return { valid: false };
}
