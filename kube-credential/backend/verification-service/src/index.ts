import { app } from './app';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Verification service listening on port ${port}`);
});
