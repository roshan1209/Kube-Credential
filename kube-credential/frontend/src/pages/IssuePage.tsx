import React from 'react';
import { CredentialForm } from '../components/CredentialForm';
import { useApi } from '../hooks/useApi';
import { issueCredential } from '../api/issuanceApi';

export function IssuePage() {
  const { loading, error, data, call } = useApi(issueCredential);

  async function onSubmit(obj: any) {
    await call(obj);
  }

  return (
    <div>
      <h2>Issue Credential</h2>
      <CredentialForm onSubmit={onSubmit} submitting={loading} />
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="result">
          <div><b>Status:</b> {data.status}</div>
          <div><b>ID:</b> {data.id}</div>
          <div><b>Issued At:</b> {data.issuedAt}</div>
          <div><b>Worker:</b> {data.workerId}</div>
          {data.message && <div><b>Message:</b> {data.message}</div>}
        </div>
      )}
    </div>
  );
}
