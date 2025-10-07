import React from 'react';
import { IssuePage } from './pages/IssuePage';
import { VerifyPage } from './pages/VerifyPage';

export function App() {
  const [tab, setTab] = React.useState<'issue' | 'verify'>('issue');
  return (
    <div className="container">
      <header>
        <h1>Kube Credential</h1>
        <nav>
          <button className={tab === 'issue' ? 'active' : ''} onClick={() => setTab('issue')}>Issue</button>
          <button className={tab === 'verify' ? 'active' : ''} onClick={() => setTab('verify')}>Verify</button>
        </nav>
      </header>
      <main>
        {tab === 'issue' ? <IssuePage /> : <VerifyPage />}
      </main>
    </div>
  );
}
