import React from 'react';
import { VerificationForm } from '../components/VerificationForm';
import { useApi } from '../hooks/useApi';
import { verifyCredential } from '../api/verificationApi';

export function VerifyPage() {
  const { loading, error, data, call } = useApi(verifyCredential);

  async function onSubmit(obj: any) {
    await call(obj);
  }

  return (
    <div>
      <h2>Verify Credential</h2>
      <VerificationForm onSubmit={onSubmit} submitting={loading} />
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="result">
          <div><b>Status:</b> {data.status}</div>
          {data.id && <div><b>ID:</b> {data.id}</div>}
          {data.issuedAt && <div><b>Issued At:</b> {data.issuedAt}</div>}
          {data.workerId && <div><b>Worker:</b> {data.workerId}</div>}
        </div>
      )}
    </div>
  );
}
