import React from 'react';

type Props = {
  onSubmit: (obj: any) => void;
  submitting?: boolean;
};

export function CredentialForm({ onSubmit, submitting }: Props) {
  const [text, setText] = React.useState<string>("{\n  \"subject\": \"alice\",\n  \"type\": \"employee\",\n  \"claims\": { \"level\": 1 }\n}");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const obj = JSON.parse(text);
      onSubmit(obj);
    } catch (err: any) {
      setError('Invalid JSON');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <label>Credential JSON</label>
      <textarea rows={10} className="input" value={text} onChange={(e) => setText(e.target.value)} />
      {error && <div className="error">{error}</div>}
      <div style={{ marginTop: 12 }}>
        <button className="primary" type="submit" disabled={submitting}>Submit</button>
      </div>
    </form>
  );
}
