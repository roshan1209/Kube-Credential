import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VerifyPage } from '../pages/VerifyPage';
import { vi, test, expect } from 'vitest';

vi.stubGlobal('fetch', vi.fn(async (input: any, init?: any) => {
  if (String(input).includes('/api/verification')) {
    return {
      ok: true,
      json: async () => ({ status: 'valid', id: 'abc', issuedAt: '2020-01-01', workerId: 'worker-1' })
    } as any;
  }
  throw new Error('unexpected');
}));

test('verifies credential and shows result', async () => {
  render(<VerifyPage />);
  fireEvent.click(screen.getByText('Verify'));
  await waitFor(() => screen.getByText('Status:'));
  expect(screen.getByText('valid')).toBeInTheDocument();
});
