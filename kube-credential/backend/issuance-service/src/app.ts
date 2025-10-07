import express from 'express';
import cors from 'cors';
import { issuanceRouter } from './routes/issuance.routes';

export const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/issuance', issuanceRouter);
