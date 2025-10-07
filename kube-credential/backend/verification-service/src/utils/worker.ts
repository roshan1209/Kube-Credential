import crypto from 'crypto';

let cachedWorkerId: string | null = null;

export function getWorkerId(): string {
  if (cachedWorkerId) return cachedWorkerId;

  const explicit = process.env.WORKER_ID;
  if (explicit) {
    cachedWorkerId = explicit;
    return cachedWorkerId;
  }

  const podName = process.env.POD_NAME || process.env.HOSTNAME;
  if (podName) {
    const hash = crypto.createHash('sha256').update(podName).digest('hex');
    const num = parseInt(hash.slice(0, 6), 16) % 10000; // 0..9999
    cachedWorkerId = `worker-${num}`;
    return cachedWorkerId;
  }

  const rand = Math.floor(Math.random() * 10000);
  cachedWorkerId = `worker-${rand}`;
  return cachedWorkerId;
}
