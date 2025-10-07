# Issuance Service

Issues credentials as JSON and persists them locally (file-based DB). Returns which worker handled the request.

- POST `/api/issuance` — issue a credential
- GET `/health` — health check

Environment:
- `PORT` (default 3000)
- `DB_FILE` (default `data/credentials.json`)
- `WORKER_ID` (optional; defaults to worker derived from `POD_NAME` or random)
- `POD_NAME` (optional; set via Kubernetes Downward API)

Build & Run:
```bash
npm install
npm run build
npm start
```

Dev:
```bash
npm install
npm run dev
```

Test:
```bash
npm test
```

Docker:
```bash
docker build -t issuance-service .
 docker run -p 3000:3000 issuance-service
```
