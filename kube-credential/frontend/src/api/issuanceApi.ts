export async function issueCredential(data: unknown) {
  const base = import.meta.env.VITE_ISSUANCE_BASE_URL || '';
  const resp = await fetch(`${base.replace(/\/$/, '')}/api/issuance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json?.error || json?.message || 'Issuance error');
  return json as { status: string; id: string; issuedAt: string; workerId: string; message?: string };
}
