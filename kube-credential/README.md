# Kube Credential

A simple microservices application to issue and verify credentials.

- Backend: 2 Node.js (TypeScript) services
  - Issuance Service: POST `/api/issuance` issues credentials and returns worker id
  - Verification Service: POST `/api/verification` verifies credentials; optionally queries issuance by id
- Frontend: React (TypeScript) with tabs for Issue and Verify
- Containerized with Docker; Kubernetes manifests included

## Architecture

- Each backend has an independent persistence (file-based JSON). Replaceable with SQLite easily.
- Worker id is derived from `POD_NAME` or `WORKER_ID` env to demonstrate scaling; responses include `worker-<n>`.
- Verification can fall back to Issuance via `ISSUANCE_BASE_URL`.

## Local Development

Prereqs: Node 18+, Docker

- Unit tests
```bash
# Issuance
cd backend/issuance-service && npm install && npm test
# Verification
cd ../verification-service && npm install && npm test
# Frontend
cd ../../../frontend && npm install && npm test
```

- Run locally with Docker Compose
```bash
cd ./kube-credential
docker compose up --build
# Frontend at http://localhost:5173
# Issuance API at http://localhost:3000
# Verification API at http://localhost:3001
```

## Kubernetes (example manifests)

- Images in manifests use `:latest` and `IfNotPresent` for simplicity. Push your images to a registry and update `image` fields accordingly.
- Create namespace and deploy:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/issuance-deployment.yaml
kubectl apply -f k8s/issuance-service.yaml
kubectl apply -f k8s/verification-deployment.yaml
kubectl apply -f k8s/verification-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

- If using AWS EKS with ALB or NGINX ingress, adapt annotations and hostnames. For testing locally (kind/minikube), add `/etc/hosts` entry for `kube-credential.local`.

## API Contracts

- Issue
  - Request: arbitrary JSON
  - Responses:
    - 201 { status: "issued", id, issuedAt, workerId, message }
    - 200 { status: "already_issued", id, issuedAt, workerId, message }
- Verify
  - Request: arbitrary JSON
  - Responses:
    - 200 { status: "valid", id, issuedAt, workerId }
    - 404 { status: "invalid" }

## Assumptions
- File-based JSON DB is sufficient for the assignment scope; can swap to SQLite.
- Worker id uniqueness is derived from pod name hash.
- Frontend is static; env variables for API base URLs are baked at build time.

## Deliverables
- Source code with unit tests
- Dockerfiles and docker-compose
- Kubernetes manifests (`k8s/`)
- Update this README with your name, email, and contact number before submission and include deployment URLs/screenshots per instructions.
