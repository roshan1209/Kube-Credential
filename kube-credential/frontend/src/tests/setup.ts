import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
// Provide a default fetch mock if not already mocked in tests
if (typeof (globalThis as any).fetch === 'undefined') {
  (globalThis as any).fetch = vi.fn();
}
