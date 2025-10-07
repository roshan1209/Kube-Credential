export interface CredentialRecord {
  id: string;
  data: Record<string, unknown>;
  issuedAt: string; // ISO timestamp
  workerId: string;
}

export interface StoredDbShape {
  credentials: Record<string, CredentialRecord>;
}

export interface IssueResult {
  alreadyExisted: boolean;
  record: CredentialRecord;
  message?: string;
}
