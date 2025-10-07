import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IssuePage } from '../pages/IssuePage';
import { vi, test, expect } from 'vitest';

vi.stubGlobal('fetch', vi.fn(async (input: any, init?: any) => {
  if (String(input).includes('/api/issuance')) {
    return {
      ok: true,
      json: async () => ({ status: 'issued', id: 'abc', issuedAt: '2020-01-01', workerId: 'worker-1' })
    } as any;
  }
  throw new Error('unexpected');
}));

test('issues credential and shows result', async () => {
  render(<IssuePage />);
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => screen.getByText('Status:'));
  expect(screen.getByText('issued')).toBeInTheDocument();
});
