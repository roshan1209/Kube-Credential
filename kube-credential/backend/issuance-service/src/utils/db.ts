import fs from 'fs';
import path from 'path';

export async function ensureDataFile(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch {
    await fs.promises.writeFile(filePath, JSON.stringify({ credentials: {} }, null, 2), 'utf8');
  }
}

export async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.promises.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tempPath, filePath);
}
