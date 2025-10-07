# Verification Service

Verifies credentials against its own store. Accepts a credential JSON, computes its id, checks local DB, and if not present, it can optionally call Issuance service to resolve.

- POST `/api/verification` — verify a credential JSON
- GET `/health` — health check

Environment:
- `PORT` (default 3001)
- `DB_FILE` (default `data/credentials.json`)
- `WORKER_ID` (optional; defaults to worker derived from `POD_NAME` or random)
- `POD_NAME` (optional; set via Kubernetes Downward API)
- `ISSUANCE_BASE_URL` (optional; if set, used to query issuance `/api/issuance/:id`)
