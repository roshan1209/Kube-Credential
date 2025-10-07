import crypto from 'crypto';
import path from 'path';
import { ensureDataFile, readJson, writeJson } from '../utils/db';
import { getWorkerId } from '../utils/worker';
import { CredentialRecord, IssueResult, StoredDbShape } from '../models/credential.model';

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

export async function issueCredential(payload: unknown): Promise<IssueResult> {
  const dbPath = getDbFilePath();
  await ensureDataFile(dbPath);

  const id = computeCredentialId(payload);
  const db = (await readJson<StoredDbShape>(dbPath)) || { credentials: {} };
  const existing = db.credentials[id];
  if (existing) {
    return {
      alreadyExisted: true,
      record: existing,
      message: 'credential already issued'
    };
  }

  const record: CredentialRecord = {
    id,
    data: payload as Record<string, unknown>,
    issuedAt: new Date().toISOString(),
    workerId: getWorkerId()
  };

  db.credentials[id] = record;
  await writeJson(dbPath, db);

  return {
    alreadyExisted: false,
    record,
    message: `credential issued by ${record.workerId}`
  };
}

export async function getCredentialById(id: string): Promise<CredentialRecord | null> {
  const dbPath = getDbFilePath();
  await ensureDataFile(dbPath);
  const db = (await readJson<StoredDbShape>(dbPath)) || { credentials: {} };
  return db.credentials[id] ?? null;
}
